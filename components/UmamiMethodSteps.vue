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
    const list = html.match(/(?<=<li>).*?(?=<\/li>)/g)
    if (!list) {
      return prose(h, html)
    }

    // The HTML around the list, which the steps do not carry.
    const start = html.search(/<ol[\s>]/i)
    const end = html.search(/<\/ol>/i)
    const before = start < 0 || end < 0 ? '' : html.slice(0, start).trim()
    const after =
      start < 0 || end < 0 ? '' : html.slice(end + '</ol>'.length).trim()

    const steps = h(
      'ol',
      { staticClass: 'method-steps' },
      list.map((item, key) =>
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
