<script>
import {
  BIconClock,
  BIconPeople,
  BIconPuzzle,
  BIconStopwatch,
} from 'bootstrap-vue'

const ICONS = {
  clock: BIconClock,
  people: BIconPeople,
  puzzle: BIconPuzzle,
  stopwatch: BIconStopwatch,
}

/**
 * A figure under an icon: `clock`, `people`, `puzzle` or `stopwatch`, then
 * an optional label, the value and an optional unit. Renders without an
 * element of its own, so it sits directly in whatever holds it.
 */
export default {
  functional: true,

  props: {
    icon: { type: String, default: 'clock' },
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    /** After the value, as in "40 minutes". */
    unit: { type: String, default: '' },
  },

  render(h, { props }) {
    const text = [
      props.label && h('span', [`${props.label}`, h('br')]),
      ' ',
      h('span', { domProps: { textContent: props.value } }),
      props.unit && ` ${props.unit}`,
    ].filter(Boolean)
    return [
      h(ICONS[props.icon] || ICONS.clock, { props: { fontScale: 2 } }),
      ' ',
      h('p', { staticClass: 'mt-2' }, text),
    ]
  },
}
</script>
