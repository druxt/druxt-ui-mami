<template>
  <dl class="stat-grid bleed">
    <div v-for="stat of stats" :key="stat.label" class="stat-grid__cell">
      <dt class="stat-grid__label">{{ stat.label }}</dt>
      <dd class="stat-grid__value">{{ stat.value }}</dd>
    </div>
  </dl>
</template>

<script>
/** A full-width row of figures, each a small label over its value. */
export default {
  props: {
    /** `{ label, value }` each. */
    stats: { type: Array, default: () => [] },
  },
}
</script>
