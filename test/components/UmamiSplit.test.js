import UmamiSplit from '../../components/UmamiSplit.vue'
import { expectAccessible, marker, mount } from '../helpers'

describe('UmamiSplit', () => {
  test('renders a row of two thirds and one third from md', () => {
    const wrapper = mount(UmamiSplit)
    expect(wrapper.classes()).toEqual(['row'])
    const [main, aside] = wrapper.findAll('.row > div').wrappers
    expect(main.classes()).toEqual(['mb-4', 'mb-md-0', 'col-md-8'])
    expect(aside.classes()).toEqual(['col-md-4'])
  })

  test('renders the main slot in the wide column and the aside in the narrow', () => {
    const wrapper = mount(UmamiSplit, {
      slots: { main: marker('main'), aside: marker('aside') },
    })
    expect(wrapper.find('.col-md-8 > [data-slot=main]').exists()).toBe(true)
    expect(wrapper.find('.col-md-4 > [data-slot=aside]').exists()).toBe(true)
  })

  test('is accessible', async () => {
    await expectAccessible(
      mount(UmamiSplit, {
        slots: { main: '<p>Main</p>', aside: '<p>Aside</p>' },
      })
    )
  })
})
