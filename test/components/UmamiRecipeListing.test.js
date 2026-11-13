import UmamiRecipeListing from '../../components/UmamiRecipeListing.vue'
import { expectAccessible, expectThemed, marker, mount } from '../helpers'

const items = [
  { id: 'a', title: 'Borscht' },
  { id: 'b', title: 'Pasta bake' },
]

const props = {
  items,
  difficulties: [
    { value: 'easy', text: 'Easy' },
    { value: 'hard', text: 'Hard' },
  ],
  sortOptions: [
    { value: 'title', text: 'Title' },
    { value: 'time', text: 'Time' },
  ],
  sort: 'title',
  countText: '2 of 12',
}

function card({ item }) {
  return this.$createElement(
    'p',
    { attrs: { 'data-card': item.id } },
    item.title
  )
}

const listing = (propsData = props, options = {}) =>
  mount(UmamiRecipeListing, {
    propsData,
    scopedSlots: { card },
    ...options,
  })

describe('UmamiRecipeListing', () => {
  test('renders the filters and the empty text by default', () => {
    const wrapper = mount(UmamiRecipeListing)
    const field = wrapper.find('input')
    expect(field.attributes()).toMatchObject({
      type: 'search',
      placeholder: 'Filter by ingredient',
    })
    expect(field.element.value).toBe('')
    const labels = wrapper.findAll('.stat-grid__label').wrappers
    expect(labels.map((label) => label.text())).toEqual(['Difficulty', 'Sort'])
    expect(wrapper.find('.btn').exists()).toBe(false)
    expect(wrapper.find('.recipe-filters__count').text()).toBe('')
    expect(wrapper.find('p.text-center').text()).toBe(
      'Nothing matches those filters yet.'
    )
  })

  test('renders a card cell for each item through the card slot', () => {
    const wrapper = listing()
    const cells = wrapper.findAll('.card-cell')
    expect(cells).toHaveLength(2)
    expect(cells.at(0).classes()).toEqual(
      expect.arrayContaining(['col-12', 'col-sm-6', 'col-md-4', 'col-lg-3'])
    )
    expect(
      wrapper
        .findAll('[data-card]')
        .wrappers.map((c) => c.attributes('data-card'))
    ).toEqual(['a', 'b'])
    expect(wrapper.find('p.text-center').exists()).toBe(false)
  })

  test('renders the strings it is given', () => {
    const wrapper = listing({
      ...props,
      items: [],
      query: 'carrot',
      filterPlaceholder: 'Filtrar por ingrediente',
      difficultyLabel: 'Dificultad',
      sortLabel: 'Ordenar',
      emptyText: 'Nada coincide.',
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'Filtrar por ingrediente'
    )
    expect(wrapper.find('input').element.value).toBe('carrot')
    expect(
      wrapper.findAll('.stat-grid__label').wrappers.map((l) => l.text())
    ).toEqual(['Dificultad', 'Ordenar'])
    expect(wrapper.find('.recipe-filters__count').text()).toBe('2 of 12')
    expect(wrapper.find('p.text-center').text()).toBe('Nada coincide.')
  })

  test('emits `update:query` with the text, after a pause in typing', async () => {
    jest.useFakeTimers()
    const wrapper = listing()
    await wrapper.find('input').setValue('carrot')
    expect(wrapper.emitted('update:query')).toBeUndefined()
    jest.advanceTimersByTime(150)
    expect(wrapper.emitted('update:query')).toEqual([['carrot']])
    jest.useRealTimers()
  })

  test('renders a button per difficulty, pressed for the current one', () => {
    const wrapper = listing({ ...props, difficulty: 'hard' })
    const buttons = wrapper.findAll('.recipe-filters__group .btn')
    expect(buttons.wrappers.map((b) => b.text())).toEqual(['Easy', 'Hard'])
    expect(buttons.at(0).attributes('aria-pressed')).toBe('false')
    expect(buttons.at(0).classes()).toContain('btn-outline-secondary')
    expect(buttons.at(1).attributes('aria-pressed')).toBe('true')
    expect(buttons.at(1).classes()).toContain('btn-primary')
  })

  test('emits `update:difficulty` to choose a difficulty, and null to clear it', async () => {
    const wrapper = listing({ ...props, difficulty: 'hard' })
    const buttons = wrapper.findAll('.recipe-filters__group .btn')
    await buttons.at(0).trigger('click')
    await buttons.at(1).trigger('click')
    expect(wrapper.emitted('update:difficulty')).toEqual([['easy'], [null]])
  })

  test('renders the sort, labelled by its label, and emits `update:sort`', async () => {
    const wrapper = listing({ ...props, sortLabelId: 'sort-label' })
    const select = wrapper.find('select')
    expect(select.attributes('aria-labelledby')).toBe('sort-label')
    expect(wrapper.find('#sort-label').text()).toBe('Sort')
    expect(select.element.value).toBe('title')
    expect(select.findAll('option').wrappers.map((o) => o.text())).toEqual([
      'Title',
      'Time',
    ])
    await select.setValue('time')
    expect(wrapper.emitted('update:sort')).toEqual([['time']])
  })

  test('labels the sort with `recipe-sort-label` by default', () => {
    const select = listing().find('select')
    expect(select.attributes('aria-labelledby')).toBe('recipe-sort-label')
  })

  test('works with `.sync` on the query, difficulty and sort', async () => {
    jest.useFakeTimers()
    const host = mount({
      data: () => ({ query: '', difficulty: null, sort: 'title', props }),
      template: `<UmamiRecipeListing
        v-bind="props"
        :query.sync="query"
        :difficulty.sync="difficulty"
        :sort.sync="sort"
      />`,
    })
    await host.find('input').setValue('leek')
    jest.advanceTimersByTime(150)
    await host.findAll('.recipe-filters__group .btn').at(0).trigger('click')
    await host.find('select').setValue('time')
    expect(host.vm.$data).toMatchObject({
      query: 'leek',
      difficulty: 'easy',
      sort: 'time',
    })
    expect(host.find('.btn-primary').text()).toBe('Easy')
    jest.useRealTimers()
  })

  test('renders the note slot last', () => {
    const wrapper = listing(props, { slots: { note: marker('note') } })
    expect(wrapper.element.lastElementChild.dataset.slot).toBe('note')
  })

  test('carries the classes the theme styles', () => {
    const wrapper = listing()
    expectThemed(wrapper, ['recipe-filters'], '.recipe-filters')
    expectThemed(
      wrapper,
      ['recipe-filters__field', 'masthead__search'],
      'input'
    )
    expectThemed(
      wrapper,
      ['recipe-filters__group', 'recipe-filters__group--scroll'],
      '.recipe-filters__group--scroll'
    )
    expectThemed(wrapper, ['recipe-filters__row'], '.recipe-filters__row')
    expectThemed(wrapper, ['recipe-filters__count'], '.recipe-filters__count')
    expectThemed(wrapper, ['stat-grid__label'], '.stat-grid__label')
  })

  test('is accessible', async () => {
    await expectAccessible(listing({ ...props, difficulty: 'easy' }))
  })
})
