/**
 * Audit what a consumer installs, and only that.
 *
 * `npm audit --omit=dev` over this checkout reports far more than the package
 * ships. npm installs peer dependencies, so the `nuxt` peer brings the whole
 * Nuxt 2 tree in, and a package reachable both from a devDependency and from
 * that peer carries neither the dev nor the peer flag, so `--omit=dev
 * --omit=peer` still counts it as shipped. The test tooling's PostCSS 7 is
 * reported that way.
 *
 * So this packs the package, installs the tarball into an empty directory
 * without its peers, the way a site that already has Nuxt and Vue resolves it,
 * and audits that tree. Blocking at high and above. The peers are the site's
 * own install, audited by the site.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const level = process.argv[2] || 'high'

const npm = (args, cwd) =>
  execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: 'pipe' })

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'druxt-ui-mami-audit-'))
let status = 0
try {
  // JSON, because `prepare` runs on pack and its output shares stdout.
  const packed = npm(['pack', '--json', '--pack-destination', work], ROOT)
  const tarball = JSON.parse(packed.slice(packed.search(/^\[/m)))[0].filename
  fs.writeFileSync(
    path.join(work, 'package.json'),
    JSON.stringify({ name: 'audit-shipped', private: true })
  )
  npm(
    [
      'install',
      path.join(work, tarball),
      '--legacy-peer-deps',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
    ],
    work
  )
  try {
    process.stdout.write(npm(['audit', `--audit-level=${level}`], work))
  } catch (error) {
    process.stdout.write(error.stdout || '')
    process.stderr.write(error.stderr || '')
    status = error.status || 1
  }
} finally {
  fs.rmSync(work, { recursive: true, force: true })
}
process.exit(status)
