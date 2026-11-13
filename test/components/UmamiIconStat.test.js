import UmamiIconStat from '../../components/UmamiIconStat.vue'
import { expectAccessible, mountFunctional } from '../helpers'

describe('UmamiIconStat', () => {
  test('renders a clock and an empty figure with no element of its own', () => {
    const host = mountFunctional(UmamiIconStat)
    const [icon, paragraph] = host.element.children
    expect(host.element.children).toHaveLength(2)
    expect(icon.tagName).toBe('svg')
    expect(icon.classList).toContain('bi-clock')
    expect(paragraph.tagName).toBe('P')
    expect(paragraph.className).toBe('mt-2')
    expect(paragraph.textContent.trim()).toBe('')
  })

  test.each(['clock', 'people', 'puzzle', 'stopwatch'])(
    'draws the `%s` icon, at twice the size',
    (icon) => {
      const svg = mountFunctional(UmamiIconStat, { icon }).find('svg')
      expect(svg.classes()).toContain(`bi-${icon}`)
      expect(svg.attributes('style')).toBe('font-size: 200%;')
    }
  )

  test('falls back to the clock for an icon it does not know', () => {
    const svg = mountFunctional(UmamiIconStat, { icon: 'oven' }).find('svg')
    expect(svg.classes()).toContain('bi-clock')
  })

  test('renders the label over the value, then the unit', () => {
    const p = mountFunctional(UmamiIconStat, {
      icon: 'stopwatch',
      label: 'Cooking time',
      value: 40,
      unit: 'minutes',
    }).find('p')
    expect(p.html()).toContain('<span>Cooking time<br></span>')
    expect(p.text().replace(/\s+/g, ' ')).toBe('Cooking time 40 minutes')
  })

  test('renders the value as text, with no label or unit', () => {
    const p = mountFunctional(UmamiIconStat, { value: '<b>4</b>' }).find('p')
    expect(p.findAll('span')).toHaveLength(1)
    expect(p.text()).toBe('<b>4</b>')
    expect(p.find('b').exists()).toBe(false)
  })

  test('is accessible', async () => {
    await expectAccessible(
      mountFunctional(UmamiIconStat, {
        icon: 'people',
        label: 'Servings',
        value: 4,
      })
    )
  })
})
