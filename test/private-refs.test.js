/**
 * The private-host rule.
 *
 * Driven as a command against throwaway repositories rather than
 * imported, because the linter is an ESM script that has to keep
 * running under plain `node`. That also puts its exit code under test,
 * which is the part CI depends on.
 *
 * The fixtures below are deliberately private-looking; this file is one
 * of the two the linter skips for exactly that reason.
 */

import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const LINTER = path.resolve(__dirname, '../scripts/lint-private-refs.mjs')

let repo

/**
 * The environment without git's own variables.
 *
 * A pre-commit hook sets GIT_DIR and GIT_INDEX_FILE for the repository being
 * committed. Inherited, they send every git call below to that repository, so
 * `init` reinitialises it and `add` overwrites the index the commit is made
 * from. Read on each call, so a variable set after this file loads is dropped
 * too.
 */
const env = () =>
  Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_'))
  )

/** A throwaway git repository, because the linter reads tracked files. */
const commit = (files) => {
  Object.entries(files).forEach(([name, contents]) => {
    fs.mkdirSync(path.dirname(path.join(repo, name)), { recursive: true })
    fs.writeFileSync(path.join(repo, name), contents)
  })
  execFileSync('git', ['-C', repo, 'add', '-A'], { env: env() })
}

const run = (...flags) => {
  const result = spawnSync(process.execPath, [LINTER, ...flags, repo], {
    encoding: 'utf8',
    env: env(),
  })
  return { status: result.status, output: result.stdout + result.stderr }
}

const fresh = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'druxt-ui-mami-private-'))
  execFileSync('git', ['-C', dir, 'init', '-q'], { env: env() })
  return dir
}

beforeEach(() => {
  repo = fresh()
})

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true })
})

describe('the throwaway repositories', () => {
  test('run git without the git variables a commit hook sets', () => {
    // Jest gives this file its own process.env, but a child process inherits
    // the worker's, so a hook's GIT_DIR reaches git unless every call passes
    // its environment explicitly.
    const names = ['GIT_DIR', 'GIT_INDEX_FILE', 'GIT_WORK_TREE']
    const saved = Object.fromEntries(names.map((n) => [n, process.env[n]]))
    names.forEach((n) => {
      process.env[n] = `/repository/being/committed/${n}`
    })
    try {
      names.forEach((n) => expect(env()).not.toHaveProperty(n))
      expect(env().PATH).toBe(process.env.PATH)
    } finally {
      names.forEach((n) => {
        if (saved[n] === undefined) delete process.env[n]
        else process.env[n] = saved[n]
      })
    }
  })
})

describe('lint:private', () => {
  test('passes a repository with only public and local hosts', () => {
    commit({
      'README.md': [
        'http://localhost:3000/callback',
        'http://127.0.0.1:8888/jsonapi',
        'http://druxt-ui-mami.ddev.site',
        'https://umami.demo.druxtjs.org/recipes',
      ].join('\n'),
    })

    const { status, output } = run()

    expect(status).toBe(0)
    expect(output).toContain('No private hosts')
  })

  test('fails on a private host, naming the file and line', () => {
    commit({
      'docs/setup.md': 'first\nsecond\nsee http://example.local/path\n',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('docs/setup.md:3: example.local')
  })

  test('fails on an scp-style git remote', () => {
    commit({ 'CONTRIBUTING.md': 'git@example.internal:group/project.git' })

    expect(run().status).toBe(1)
  })

  test('fails on an scp-style remote whose user is not git', () => {
    // GitLab CI remotes use gitlab-ci-token@, and deploy keys use their own
    // user. Only `git@` was recognised, so these reached a public repository.
    commit({
      'a.md': 'deploy@example.internal:group/repo.git',
      'b.md': 'gitlab-ci-token@example.local:group/repo.git',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('example.internal')
    expect(output).toContain('example.local')
  })

  test('steps over userinfo to reach the host', () => {
    // Capturing the username instead of the host let whole URLs through.
    commit({ 'notes.md': 'https://oauth2:token@example.local/x' })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('example.local')
  })

  test('fails on private address ranges', () => {
    commit({
      'a.md': 'http://10.1.2.3/a',
      'b.md': 'http://192.168.0.9/b',
      'c.md': 'http://172.16.4.5/c',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('10.1.2.3')
    expect(output).toContain('192.168.0.9')
    expect(output).toContain('172.16.4.5')
  })

  test('fails on a private address written as an IPv4-mapped IPv6 literal', () => {
    // Same three addresses as above, in the spellings that read as IPv6.
    commit({
      'a.md': 'http://[::ffff:10.1.2.3]/a',
      'b.md': 'http://[::ffff:c0a8:0009]/b',
      'c.md': 'http://[0:0:0:0:0:ffff:172.16.4.5]/c',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('10.1.2.3')
    expect(output).toContain('192.168.0.9')
    expect(output).toContain('172.16.4.5')
  })

  test('fails on a collapsed IPv6 unique-local address', () => {
    // A ULA that ends on its own colons. Stripping them left `fd00`, which
    // no private-host pattern matches.
    commit({
      'a.md': 'http://[fd00::]/a',
      'b.md': 'http://[fc00::]/b',
      'c.md': 'http://[fe80::]/c',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('fd00::')
    expect(output).toContain('fc00::')
    expect(output).toContain('fe80::')
  })

  test('fails on link-local and shared address space', () => {
    commit({
      'a.md': 'http://169.254.169.254/latest/meta-data',
      'b.md': 'http://100.64.0.1/b',
      'c.md': 'http://100.127.255.254/c',
    })

    const { status, output } = run()

    expect(status).toBe(1)
    expect(output).toContain('169.254.169.254')
    expect(output).toContain('100.64.0.1')
    expect(output).toContain('100.127.255.254')
  })

  test('passes the public addresses either side of the shared space', () => {
    commit({
      'a.md': 'http://100.63.255.255/a',
      'b.md': 'http://100.128.0.1/b',
      'c.md': 'http://169.255.0.1/c',
    })

    expect(run().status).toBe(0)
  })

  test('ignores an untracked file, which is not published', () => {
    fs.writeFileSync(path.join(repo, 'scratch.md'), 'http://example.local/x')

    expect(run().status).toBe(0)
  })

  test('with --staged, reads the index rather than the working tree', () => {
    // Staged, then edited out of the working tree only: the commit still
    // carries the private URL, and only the index shows it.
    commit({ 'docs/setup.md': 'see http://example.local/path\n' })
    fs.writeFileSync(path.join(repo, 'docs/setup.md'), 'see the docs\n')

    expect(run().status).toBe(0)
    const { status, output } = run('--staged')
    expect(status).toBe(1)
    expect(output).toContain('docs/setup.md:1: example.local')
  })

  test('with --staged, passes a private URL that is not staged', () => {
    commit({ 'docs/setup.md': 'see the docs\n', 'logo.bin': 'a\0b' })
    fs.writeFileSync(
      path.join(repo, 'docs/setup.md'),
      'see http://example.local/path\n'
    )

    expect(run().status).toBe(1)
    const { status, output } = run('--staged')
    expect(status).toBe(0)
    expect(output).toContain('No private hosts referenced by staged files')
  })

  test('with --staged, passes an empty index', () => {
    expect(run('--staged').status).toBe(0)
  })

  test('says nothing about a bare project name, which it cannot see', () => {
    // The documented gap: prose has no host shape to match, so a green
    // run is not evidence that an internal name is absent.
    commit({
      'README.md': 'mirrored to the internal group as some-private-project',
    })

    expect(run().status).toBe(0)
  })
})
