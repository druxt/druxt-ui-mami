import UmamiMethodSteps from '../../components/UmamiMethodSteps.vue'
import { expectAccessible, expectThemed, mountFunctional } from '../helpers'

const method =
  '<ol>\n<li>Preheat the oven.</li>\n<li>Chop the <em>red</em> onions.</li>\n</ol>'

const steps = (host) =>
  host.findAll('.method-step__text').wrappers.map((step) => step.html())

describe('UmamiMethodSteps', () => {
  test('renders an empty prose block by default', () => {
    const host = mountFunctional(UmamiMethodSteps)
    expect(host.element.children).toHaveLength(1)
    expect(host.find('.method-prose').text()).toBe('')
  })

  test('numbers each item of the ordered list, keeping its markup', () => {
    const host = mountFunctional(UmamiMethodSteps, { html: method })
    expect(host.element.children).toHaveLength(1)
    const list = host.find('ol.method-steps')
    expect(list.findAll('li.method-step')).toHaveLength(2)
    expect(
      list.findAll('.method-step__n').wrappers.map((n) => n.text())
    ).toEqual(['1', '2'])
    expect(steps(host)).toEqual([
      '<span class="method-step__text">Preheat the oven.</span>',
      '<span class="method-step__text">Chop the <em>red</em> onions.</span>',
    ])
  })

  test('keeps the prose before and after the list', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: `<p>Before you start.</p>${method}<p>Serve hot.</p>`,
    })
    const children = [...host.element.children]
    expect(children.map((child) => child.className)).toEqual([
      'method-prose',
      'method-steps',
      'method-prose',
    ])
    expect(children[0].innerHTML).toBe('<p>Before you start.</p>')
    expect(children[2].innerHTML).toBe('<p>Serve hot.</p>')
  })

  test('renders HTML with no list as prose', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: '<p>Just <strong>mix</strong> it.</p>',
    })
    expect(host.find('.method-steps').exists()).toBe(false)
    expect(host.find('.method-prose').html()).toContain(
      '<p>Just <strong>mix</strong> it.</p>'
    )
  })

  test('renders an unordered list as prose rather than as steps', () => {
    const html = '<p>You need:</p><ul><li>Flour</li><li>Water</li></ul>'
    const host = mountFunctional(UmamiMethodSteps, { html })
    expect(host.find('.method-steps').exists()).toBe(false)
    expect(host.find('.method-prose').element.innerHTML).toBe(html)
  })

  test('numbers only the ordered list’s items, leaving another list in the prose', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: `<ul><li>Flour</li></ul>${method}`,
    })
    expect(steps(host)).toEqual([
      '<span class="method-step__text">Preheat the oven.</span>',
      '<span class="method-step__text">Chop the <em>red</em> onions.</span>',
    ])
    expect(host.find('.method-prose').element.innerHTML).toBe(
      '<ul><li>Flour</li></ul>'
    )
  })

  test('reads list items that carry attributes or run over lines', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: '<ol start="1">\n<li class="first">Mix the\nflour.</li>\n<li>Knead.</li></ol>',
    })
    expect(
      host.findAll('.method-step__text').wrappers.map((s) => s.text())
    ).toEqual(['Mix the\nflour.', 'Knead.'])
  })

  test('keeps a list nested in a step inside that step', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: '<ol><li>Mix.<ol><li>Knead.</li></ol>Rest.</li><li>Bake.</li></ol><p>Serve.</p>',
    })
    expect(steps(host)).toEqual([
      '<span class="method-step__text">Mix.<ol><li>Knead.</li></ol>Rest.</span>',
      '<span class="method-step__text">Bake.</span>',
    ])
    expect(host.findAll('li.method-step')).toHaveLength(2)
    expect(host.find('.method-prose').element.innerHTML).toBe('<p>Serve.</p>')
  })

  test('reads a quoted attribute holding > as part of its tag', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: `<ol><li title="Rest > 5 minutes">Mix.</li><li data-x='a>b'>Bake.</li></ol>`,
    })
    expect(
      host.findAll('.method-step__text').wrappers.map((s) => s.text())
    ).toEqual(['Mix.', 'Bake.'])
  })

  test('keeps an unordered list nested in a step inside that step', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: '<OL><LI>Mix:<ul><li>flour</li><li>water</li></ul></LI><LI>Bake.</LI></OL>',
    })
    expect(steps(host)).toEqual([
      '<span class="method-step__text">Mix:<ul><li>flour</li><li>water</li></ul></span>',
      '<span class="method-step__text">Bake.</span>',
    ])
  })

  test('ends an item whose closing tag is left out at the next item', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: '<ol><li>Mix.<li>Bake.</ol>',
    })
    expect(
      host.findAll('.method-step__text').wrappers.map((s) => s.text())
    ).toEqual(['Mix.', 'Bake.'])
  })

  test('renders an ordered list that never closes as prose', () => {
    const html = '<ol><li>Mix.</li><li>Bake.</li>'
    const host = mountFunctional(UmamiMethodSteps, { html })
    expect(host.find('.method-steps').exists()).toBe(false)
    expect(host.find('.method-prose').element.innerHTML).toBe(
      '<ol><li>Mix.</li><li>Bake.</li></ol>'
    )
  })

  test('does not read an <old> or <link> tag as a list', () => {
    const html = '<p>An <old>tag</old> and <link rel="x"> here.</p>'
    const host = mountFunctional(UmamiMethodSteps, { html })
    expect(host.find('.method-steps').exists()).toBe(false)
  })

  test('carries the classes the theme styles', () => {
    const host = mountFunctional(UmamiMethodSteps, {
      html: `<p>Before.</p>${method}`,
    })
    expectThemed(host, ['method-prose'], '.method-prose')
    expectThemed(host, ['method-steps'], 'ol')
    expectThemed(host, ['method-step'], 'li')
    expectThemed(host, ['method-step__n'], '.method-step__n')
    expectThemed(host, ['method-step__text'], '.method-step__text')
  })

  test('is accessible', async () => {
    await expectAccessible(
      mountFunctional(UmamiMethodSteps, {
        html: `<p>Before.</p>${method}<p>After.</p>`,
      })
    )
  })
})
