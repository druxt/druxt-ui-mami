import UmamiIngredients from '../../components/UmamiIngredients.vue'
import { expectAccessible, mount } from '../helpers'

const items = ['2 carrots', '1 celery root', '<b>3</b> l water']

describe('UmamiIngredients', () => {
  test('renders an empty list by default', () => {
    const wrapper = mount(UmamiIngredients)
    expect(wrapper.classes()).toContain('list-group')
    expect(wrapper.findAll('.list-group-item')).toHaveLength(0)
  })

  test('renders an item for each ingredient, as text', () => {
    const wrapper = mount(UmamiIngredients, { propsData: { items } })
    const rows = wrapper.findAll('.list-group-item')
    expect(rows.wrappers.map((row) => row.text())).toEqual(items)
    expect(wrapper.find('b').exists()).toBe(false)
  })

  test('is accessible', async () => {
    await expectAccessible(mount(UmamiIngredients, { propsData: { items } }))
  })
})
