<script>
const prose = (h, content) =>
  h('div', { staticClass: 'method-prose', domProps: { innerHTML: content } })

// The list tags, opening or closing, with whatever attributes they carry.
const LIST_TAG = /<(\/?)(ol|ul|li)(?=[\s/>])[^>]*>/gi

/**
 * The first ordered list in `html`: where it starts and ends, and the inner
 * HTML of each of its own items. A list nested inside an item stays part of
 * that item, so the scan counts list depth rather than taking the first
 * closing tag. An item whose closing tag is left out ends where the next item
 * or the list does. Null when there is no ordered list, or it never closes.
 *
 * A tag scanner rather than DOMParser, because this runs in server rendering
 * too, where there is no DOM.
 */
const firstOrderedList = (html) => {
  const tags = html.matchAll(LIST_TAG)
  let start = -1
  let depth = 0
  let item = -1
  const items = []
  const close = (at) => {
    if (item !== -1) items.push(html.slice(item, at))
    item = -1
  }
  for (const tag of tags) {
    const [text, slash, name] = tag
    const closing = slash === '/'
    const kind = name.toLowerCase()
    if (start === -1) {
      if (kind === 'ol' && !closing) {
        start = tag.index
        depth = 1
      }
      continue
    }
    if (kind === 'li') {
      if (depth !== 1) continue
      close(tag.index)
      if (!closing) item = tag.index + text.length
      continue
    }
    if (!closing) {
      depth += 1
      continue
    }
    depth -= 1
    if (depth === 0) {
      close(tag.index)
      return { start, end: tag.index + text.length, items }
    }
  }
  return null
}

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
    const list = firstOrderedList(html)
    const items = list ? list.items : []
    if (!items.length) {
      return prose(h, html)
    }

    // The HTML around the list, which the steps do not carry.
    const before = html.slice(0, list.start).trim()
    const after = html.slice(list.end).trim()

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
