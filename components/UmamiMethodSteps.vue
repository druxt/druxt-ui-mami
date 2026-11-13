<script>
const prose = (h, content) =>
  h('div', { staticClass: 'method-prose', domProps: { innerHTML: content } })

/**
 * A recipe's method, from its HTML: each item of its ordered list becomes a
 * numbered step, and the prose around the list stays prose. HTML with no
 * list renders as prose. Renders without an element of its own, so it sits
 * directly in whatever holds it.
 */
export default {
  functional: true,

  props: {
    /** The method, as trusted HTML. */
    html: { type: String, default: '' },
  },

  render(h, { props }) {
    const html = props.html || ''

    // The first ordered list holds the steps. Any other list, ordered or not,
    // is prose like the rest.
    const list = html.match(/<ol(?:\s[^>]*)?>([\s\S]*?)<\/ol>/i)
    const items = list
      ? [...list[1].matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/gi)].map(
          ([, item]) => item
        )
      : []
    if (!items.length) {
      return prose(h, html)
    }

    // The HTML around the list, which the steps do not carry.
    const before = html.slice(0, list.index).trim()
    const after = html.slice(list.index + list[0].length).trim()

    const steps = h(
      'ol',
      { staticClass: 'method-steps' },
      items.map((item, key) =>
        h('li', { key, staticClass: 'method-step' }, [
          h('span', { staticClass: 'method-step__n' }, String(key + 1)),
          ' ',
          h('span', {
            staticClass: 'method-step__text',
            domProps: { innerHTML: item },
          }),
        ])
      )
    )
    return [before && prose(h, before), steps, after && prose(h, after)].filter(
      Boolean
    )
  },
}
</script>
