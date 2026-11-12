<template>
  <div class="term-page">
    <UmamiPageHead
      :count="count"
      :description="description"
      :kicker="kicker"
      :title="title"
    >
      <template #breadcrumb>
        <slot name="breadcrumb" />
      </template>
    </UmamiPageHead>

    <div v-if="!empty" class="card-grid">
      <slot />
    </div>
    <p v-else-if="emptyText" class="term-page__empty">
      {{ emptyText }}
    </p>

    <slot name="note" />
  </div>
</template>

<script>
/** A collection's page: its head band, then its cards in a grid. */
export default {
  props: {
    title: { type: String, default: '' },
    kicker: { type: String, default: 'Collection' },
    /** Under the title, as trusted HTML. */
    description: { type: String, default: '' },
    /** A line such as "18 recipes and 4 articles". */
    count: { type: String, default: '' },
    /** True when there are no cards: the empty text shows instead. */
    empty: { type: Boolean, default: false },
    /** Leave it empty while the cards are loading. */
    emptyText: { type: String, default: '' },
  },
}
</script>
