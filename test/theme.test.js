/**
 * @jest-environment node
 */
import fs from 'fs'
import path from 'path'

const THEME = fs.readFileSync(
  path.resolve(__dirname, '..', 'dist/umami.css'),
  'utf8'
)

// Every declaration in a rule for `selector`, as one string, including the
// rules inside a media query.
const rule = (selector) =>
  THEME.split('}')
    .map((block) => block.split('{'))
    .filter((parts) => parts.length > 1)
    .filter((parts) => parts[parts.length - 2].split(',').includes(selector))
    .map((parts) => parts[parts.length - 1])
    .join(';')

describe('the theme', () => {
  test('clears --umami-top-offset above the sticky masthead', () => {
    expect(rule('.masthead-sticky')).toContain(
      'top:var(--umami-top-offset, 0px)'
    )
    expect(rule('html')).toContain(
      'scroll-padding-top:calc(var(--umami-top-offset, 0px) + 76px)'
    )
    expect(rule('.recipe-ingredients')).toContain(
      'top:calc(var(--umami-top-offset, 0px) + 16px)'
    )
  })

  test('takes the flush band padding from --umami-flush-band-padding', () => {
    expect(rule('.band.band--flush')).toContain(
      'padding-top:var(--umami-flush-band-padding, 0)'
    )
  })
})
