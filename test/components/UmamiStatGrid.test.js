import UmamiStatGrid from '../../components/UmamiStatGrid.vue'
import { expectAccessible, expectThemed, mount } from '../helpers'

const stats = [
  { label: 'Preparation', value: '10 min' },
  { label: 'Cooking', value: '30 min' },
  { label: 'Servings', value: 4 },
]

describe('UmamiStatGrid', () => {
  test('renders an empty description list by default', () => {
    const wrapper = mount(UmamiStatGrid)
    expect(wrapper.element.tagName).toBe('DL')
    expect(wrapper.findAll('.stat-grid__cell')).toHaveLength(0)
  })

  test('renders each stat as a label over its value', () => {
    const cells = mount(UmamiStatGrid, { propsData: { stats } }).findAll(
      '.stat-grid__cell'
    )
    expect(
      cells.wrappers.map((cell) => [
        cell.find('dt').text(),
        cell.find('dd').text(),
      ])
    ).toEqual([
      ['Preparation', '10 min'],
      ['Cooking', '30 min'],
      ['Servings', '4'],
    ])
  })

  test('carries the classes the theme styles', () => {
    const wrapper = mount(UmamiStatGrid, { propsData: { stats } })
    expectThemed(wrapper, ['stat-grid', 'bleed'])
    expectThemed(wrapper, ['stat-grid__cell'], '.stat-grid__cell')
    expectThemed(wrapper, ['stat-grid__label'], 'dt')
    expectThemed(wrapper, ['stat-grid__value'], 'dd')
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiStatGrid, { propsData: { stats } }))
  })
})
