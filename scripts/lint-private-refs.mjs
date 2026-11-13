/**
 * Fail if a tracked file points at a host only the author can reach.
 *
 * This repository is public, and its README is what people copy to add
 * the theme to a site, so a private URL here is not a buried comment: it
 * ends up in front of everyone who follows the package's documentation.
 *
 * The rule is the shape of the host, not a list of known hostnames -
 * anything resolvable only inside a LAN. localhost, loopback and the
 * DDEV and Lando development domains are how a site runs locally, so
 * they are the exceptions.
 *
 * Known gap: this matches host shape, so it catches `scheme://host/...`
 * and scp-style git remotes. It cannot catch an internal project or
 * repository name written as prose, which has no shape to match. A
 * green run here is not a statement about that class.
 *
 * Usage: lint-private-refs.mjs [--staged] [<root>]
 *
 * By default it reads each tracked file from the working tree. With
 * --staged it reads the index instead, which is what a commit is made from:
 * the pre-commit hook uses it, because a private URL that is staged and then
 * edited out of the working tree alone would otherwise be committed unseen.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Development hosts that are meant to be here. */
const ALLOWED = [
  /^localhost$/i,
  /^127\./,
  /^::1$/,
  /\.ddev\.site$/i,
  /\.lndo\.site$/i,
]

/** Hosts nobody outside the author's network can resolve. */
const PRIVATE_HOST = [
  /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(local|internal|lan|home|corp|intranet)$/i,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  // Link-local, and the shared address space carrier-grade NAT and overlay
  // networks such as Tailscale hand out.
  /^169\.254\.\d{1,3}\.\d{1,3}$/,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/,
  /^f[cd][0-9a-f]{2}:/i,
  /^fe[89ab][0-9a-f]:/i,
]

/**
 * Scheme, then the authority's host.
 *
 * Userinfo has to be stepped over rather than captured, because a git
 * remote usually carries it - `https://oauth2:TOKEN@host/path` - and
 * capturing `oauth2` instead of the host let the whole URL through.
 *
 * The scp-style user is any user, not just `git`: CI remotes use
 * `gitlab-ci-token@` and deploy keys use their own.
 */
// The bracket class takes dots as well as hex: an IPv4-mapped literal such as
// [::ffff:10.0.0.8] is a bracketed host that carries an RFC1918 address.
const URL_HOST =
  /(?:[a-z][a-z0-9+.-]*:\/\/(?:[^/@\s]*@)?|\b[A-Za-z0-9._%+-]+@)(\[[0-9A-Fa-f:.]+\]|[A-Za-z0-9._-]+)/g

/**
 * The IPv4 address inside an IPv4-mapped IPv6 literal, else the host as given.
 *
 * A mapped address has four spellings, compressed or expanded, with the last
 * 32 bits written as dotted decimal or as two hex groups. Matching the dotted
 * spelling alone let `[0:0:0:0:0:ffff:0a00:0008]` name a private endpoint that
 * every pattern below then read as a public one.
 */
export function mappedToIpv4(host) {
  if (!/^[0-9a-f:.]+$/i.test(host) || !host.includes(':')) return host

  // A trailing dotted quad occupies the last two groups. Rewriting it as hex
  // first means the zero-fill below only ever counts groups.
  const text = host.replace(
    /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
    (_, a, b, c, d) =>
      [((+a << 8) | +b).toString(16), ((+c << 8) | +d).toString(16)].join(':')
  )

  const [head, tail] = text.split('::')
  const left = head ? head.split(':') : []
  const right = tail === undefined ? [] : tail ? tail.split(':') : []
  const groups =
    tail === undefined
      ? left
      : left.concat(Array(8 - left.length - right.length).fill('0'), right)

  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) {
    return host
  }
  const value = groups.map((g) => parseInt(g, 16))
  if (!value.slice(0, 5).every((g) => g === 0) || value[5] !== 0xffff) {
    return host
  }
  return [value[6] >> 8, value[6] & 0xff, value[7] >> 8, value[7] & 0xff].join(
    '.'
  )
}

/** Every private host referenced by `text`, with the line it sits on. */
export function findPrivateRefs(text) {
  const found = []
  text.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(URL_HOST)) {
      const host = mappedToIpv4(
        match[1].replace(/^\[|\]$/g, '').replace(/\.+$/, '')
      )
      if (ALLOWED.some((pattern) => pattern.test(host))) {
        continue
      }
      if (PRIVATE_HOST.some((pattern) => pattern.test(host))) {
        found.push({ line: index + 1, host })
      }
    }
  })
  return found
}

/** Tracked files, which is the set that actually gets published. */
export function trackedFiles(root = ROOT) {
  return execFileSync('git', ['-C', root, 'ls-files', '-z'], {
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
}

/**
 * The rule's own source and test state private hosts on purpose - the
 * patterns here, the examples there. Nothing else gets an exemption:
 * an opt-out marker anyone could paste would eventually be pasted over
 * a real leak.
 */
const SELF = ['scripts/lint-private-refs.mjs', 'test/private-refs.test.js']

/**
 * Each staged file's content from the index, as `[path, text]` pairs.
 *
 * One `git cat-file --batch` over the blob ids `ls-files --stage` gives,
 * rather than a `git show` per file. Ids rather than paths keep a path with
 * a newline in it from breaking the batch protocol. A submodule entry, which
 * has no blob here, is skipped.
 */
export function stagedFiles(root = ROOT) {
  const entries = execFileSync(
    'git',
    ['-C', root, 'ls-files', '--stage', '-z'],
    {
      encoding: 'utf8',
    }
  )
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const [meta, file] = entry.split('\t')
      const [mode, id] = meta.split(' ')
      return { mode, id, file }
    })
    .filter(({ mode }) => mode !== '160000')
  if (entries.length === 0) return []

  const output = execFileSync('git', ['-C', root, 'cat-file', '--batch'], {
    input: entries.map(({ id }) => id).join('\n') + '\n',
    maxBuffer: 1024 * 1024 * 1024,
  })
  const files = []
  let offset = 0
  for (const { file } of entries) {
    const newline = output.indexOf(0x0a, offset)
    const header = output.toString('utf8', offset, newline).split(' ')
    const size = Number(header[2])
    const start = newline + 1
    files.push([file, output.toString('utf8', start, start + size)])
    offset = start + size + 1
  }
  return files
}

/** Each tracked file's content from the working tree, as `[path, text]`. */
function workingFiles(root) {
  const files = []
  for (const file of trackedFiles(root)) {
    try {
      files.push([file, fs.readFileSync(path.join(root, file), 'utf8')])
    } catch {
      // Deleted from the working tree but still tracked: nothing to read.
    }
  }
  return files
}

export function lintPrivateRefs(root = ROOT, { staged = false } = {}) {
  const problems = []
  for (const [file, text] of staged ? stagedFiles(root) : workingFiles(root)) {
    if (SELF.includes(file)) {
      continue
    }
    if (text.includes('\0')) {
      continue
    }
    for (const hit of findPrivateRefs(text)) {
      problems.push(`${file}:${hit.line}: ${hit.host}`)
    }
  }
  return problems
}

export function main(root = ROOT, { staged = false } = {}) {
  const problems = lintPrivateRefs(root, { staged })
  if (problems.length > 0) {
    console.error(
      [
        '',
        `These ${staged ? 'staged' : 'tracked'} files reference a host that only resolves on a private network:`,
        '',
        ...problems.map((problem) => `  ${problem}`),
        '',
        'This repository is public. Replace the reference with a public one,',
        'or describe the thing without a URL.',
        '',
      ].join('\n')
    )
    process.exit(1)
  }
  console.log(
    `No private hosts referenced by ${staged ? 'staged' : 'tracked'} files.`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  // An explicit root keeps the tests honest: they run the real command
  // against a throwaway repository rather than this one.
  const args = process.argv.slice(2)
  const staged = args.includes('--staged')
  const root = args.find((arg) => arg !== '--staged')
  main(root ? path.resolve(root) : ROOT, { staged })
}
