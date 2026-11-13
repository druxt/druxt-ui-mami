/**
 * @jest-environment node
 */
import { execFile } from 'child_process'
import fs from 'fs'
import http from 'http'
import os from 'os'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const SCRIPTS = path.join(ROOT, '.gitlab/scripts')
const MARKER = '<!-- note-test -->'

// A notes API for one merge request: `pages` is the list of note pages, and
// `answer` can replace any response with a status of its own.
const serve = ({ pages = [], answer } = {}) =>
  new Promise((resolve) => {
    const requests = []
    const server = http.createServer((req, res) => {
      requests.push(`${req.method} ${req.url}`)
      req.resume()
      req.on('end', () => {
        const custom = answer && answer(req)
        if (custom) {
          res.writeHead(custom.status, custom.headers || {})
          res.end(custom.body || '')
          return
        }
        if (req.method === 'GET') {
          const page = Number(
            new URL(req.url, 'http://x').searchParams.get('page')
          )
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(pages[page - 1] || []))
          return
        }
        res.writeHead(req.method === 'POST' ? 201 : 200)
        res.end('{}')
      })
    })
    server.listen(0, '127.0.0.1', () => resolve({ server, requests }))
  })

// Runs a script against the mock, without the caller's GitLab variables.
const run = (server, script, args, extra = {}) =>
  new Promise((resolve) => {
    const env = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => !/^(CI_|GITLAB_|GIT_)/.test(key)
      )
    )
    execFile(
      'bash',
      [path.join(SCRIPTS, script), ...args],
      {
        env: {
          ...env,
          GITLAB_API_TOKEN: 'test-token',
          CI_API_V4_URL: `http://127.0.0.1:${server.address().port}/api/v4`,
          CI_PROJECT_ID: '1',
          CI_MERGE_REQUEST_IID: '2',
          ...extra,
        },
      },
      (error, stdout, stderr) =>
        resolve({ status: error ? error.code : 0, output: stdout + stderr })
    )
  })

const filler = (count, from = 0) =>
  Array.from({ length: count }, (_, i) => ({
    id: from + i,
    body: 'other',
    system: false,
  }))

let mock
let body
beforeEach(() => {
  body = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'mr-note-')),
    'body.md'
  )
  fs.writeFileSync(body, `${MARKER}\nhello\n`)
})
afterEach(() => mock && mock.server.close())

describe('upsert-mr-note.sh', () => {
  test('updates a marked note on page 21', async () => {
    const pages = Array.from({ length: 20 }, (_, i) => filler(100, i * 100))
    pages.push([{ id: 4321, body: `${MARKER}\nold`, system: false }])
    mock = await serve({ pages })

    const { status, output } = await run(mock.server, 'upsert-mr-note.sh', [
      MARKER,
      body,
    ])

    expect({ status, output }).toEqual({
      status: 0,
      output: expect.stringContaining('4321'),
    })
    expect(mock.requests).toContain(
      'PUT /api/v4/projects/1/merge_requests/2/notes/4321'
    )
    expect(mock.requests.some((r) => r.startsWith('POST'))).toBe(false)
  })

  test('creates a note once every page has been read', async () => {
    mock = await serve({ pages: [filler(100), filler(3, 100)] })

    const { status } = await run(mock.server, 'upsert-mr-note.sh', [
      MARKER,
      body,
    ])

    expect(status).toBe(0)
    expect(mock.requests.filter((r) => r.startsWith('GET'))).toHaveLength(3)
    expect(mock.requests).toContain(
      'POST /api/v4/projects/1/merge_requests/2/notes'
    )
  })

  test('fails past the page limit rather than posting a duplicate', async () => {
    mock = await serve({ pages: [filler(100), filler(100), filler(100)] })

    const { status, output } = await run(
      mock.server,
      'upsert-mr-note.sh',
      [MARKER, body],
      {
        NOTE_PAGE_LIMIT: '2',
      }
    )

    expect(status).not.toBe(0)
    expect(output).toContain('More than 2 pages')
    expect(mock.requests.some((r) => r.startsWith('POST'))).toBe(false)
  })

  test('fails when a write is redirected', async () => {
    mock = await serve({
      answer: (req) =>
        req.method === 'POST' && {
          status: 302,
          headers: { Location: '/elsewhere' },
        },
    })

    const { status, output } = await run(mock.server, 'upsert-mr-note.sh', [
      MARKER,
      body,
    ])

    expect(status).not.toBe(0)
    expect(output).toContain('HTTP 302')
    expect(output).not.toContain('Created')
  })

  test('fails when the token is refused', async () => {
    mock = await serve({
      answer: () => ({ status: 401, body: '{"message":"401"}' }),
    })

    const { status, output } = await run(mock.server, 'upsert-mr-note.sh', [
      MARKER,
      body,
    ])

    expect(status).not.toBe(0)
    expect(output).toContain('HTTP 401')
    expect(mock.requests.some((r) => r.startsWith('POST'))).toBe(false)
  })
})

describe('delete-mr-note.sh', () => {
  test('deletes a marked note on page 21', async () => {
    const pages = Array.from({ length: 20 }, (_, i) => filler(100, i * 100))
    pages.push([{ id: 4321, body: `${MARKER}\nold`, system: false }])
    mock = await serve({ pages })

    const { status } = await run(mock.server, 'delete-mr-note.sh', [MARKER])

    expect(status).toBe(0)
    expect(mock.requests).toContain(
      'DELETE /api/v4/projects/1/merge_requests/2/notes/4321'
    )
  })
})
