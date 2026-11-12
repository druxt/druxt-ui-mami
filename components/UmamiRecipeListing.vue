<template>
  <div>
    <!-- Below md the filters stack: the field full width, the difficulty
         buttons in one sideways scroller, then sort and count on a row. -->
    <div class="recipe-filters">
      <b-form-input
        v-model="queryModel"
        class="recipe-filters__field masthead__search"
        debounce="120"
        :placeholder="filterPlaceholder"
        type="search"
      />

      <div class="recipe-filters__group recipe-filters__group--scroll">
        <span class="stat-grid__label">{{ difficultyLabel }}</span>
        <b-button
          v-for="option of difficulties"
          :key="option.value"
          :pressed="difficulty === option.value"
          size="sm"
          :variant="difficulty === option.value ? 'primary' : 'outline-secondary'"
          @click="
            $emit(
              'update:difficulty',
              difficulty === option.value ? null : option.value
            )
          "
        >
          {{ option.text }}
        </b-button>
      </div>

      <div class="recipe-filters__row">
        <div class="recipe-filters__group">
          <span :id="sortLabelId" class="stat-grid__label">{{
            sortLabel
          }}</span>
          <b-form-select
            v-model="sortModel"
            :aria-labelledby="sortLabelId"
            :options="sortOptions"
            size="sm"
            style="width: auto"
          />
        </div>

        <span class="recipe-filters__count">
          {{ countText }}
        </span>
      </div>
    </div>

    <!-- Three across from md, four from lg. -->
    <b-row>
      <b-col
        v-for="item of items"
        :key="item.id"
        class="mb-4 card-cell"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <slot name="card" :item="item" />
      </b-col>
    </b-row>

    <p v-if="!items.length" class="text-center py-5" style="color: #8a7f70">
      {{ emptyText }}
    </p>

    <slot name="note" />
  </div>
</template>

<script>
/**
 * A filterable list of recipe cards: a text filter, difficulty buttons, a
 * sort and a count, over a grid of cards. It filters nothing itself: bind
 * `query`, `difficulty` and `sort` with `.sync`, and pass the matching
 * items. The `card` slot renders each item.
 */
export default {
  props: {
    /** The items to show, each with an `id`. */
    items: { type: Array, default: () => [] },

    query: { type: String, default: '' },
    filterPlaceholder: { type: String, default: 'Filter by ingredient' },

    /** The difficulty buttons: `{ value, text }` each. */
    difficulties: { type: Array, default: () => [] },
    difficulty: { type: String, default: null },
    difficultyLabel: { type: String, default: 'Difficulty' },

    /** The sort's options, as b-form-select takes them. */
    sortOptions: { type: Array, default: () => [] },
    sort: { type: String, default: '' },
    sortLabel: { type: String, default: 'Sort' },
    sortLabelId: { type: String, default: 'recipe-sort-label' },

    /** "4 of 12", or however the count should read. */
    countText: { type: String, default: '' },
    emptyText: { type: String, default: 'Nothing matches those filters yet.' },
  },

  computed: {
    queryModel: {
      get() {
        return this.query
      },
      set(value) {
        this.$emit('update:query', value)
      },
    },

    sortModel: {
      get() {
        return this.sort
      },
      set(value) {
        this.$emit('update:sort', value)
      },
    },
  },
}
</script>
