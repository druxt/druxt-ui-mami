<template>
  <article class="article-page">
    <div class="node-hero node-hero--article bleed">
      <slot name="media" />
    </div>

    <!-- One measure at every width. At lg the meta moves into the left rail
         and the column holds at 680px. -->
    <div class="article-page__grid">
      <aside class="article-page__rail">
        <template v-for="(line, i) of rail"
          >{{ line }}<br v-if="i < rail.length - 1" :key="i"
        /></template>
      </aside>

      <div class="article-page__column">
        <span class="article-page__kicker">
          {{ kicker }}
        </span>

        <h1 class="article-page__title" v-text="title" />

        <p class="article-page__byline">
          {{ byline
          }}<span v-if="date" class="article-page__date"> · {{ date }}</span>
        </p>

        <div class="field--body article-page__body">
          <slot name="body" />
        </div>

        <div class="recipe-tags">
          <slot name="tags" />
        </div>

        <div class="article-page__more">
          <slot name="more" />
        </div>

        <slot name="note" />
      </div>
    </div>
  </article>
</template>

<script>
/**
 * An article: the photograph, then a column with the kicker, title, byline
 * and date, the body, tags, and whatever follows. From lg the `rail` lines
 * sit in a left margin.
 */
export default {
  props: {
    title: { type: String, default: '' },
    /** Above the title, such as "Article · 4 min read". */
    kicker: { type: String, default: '' },
    byline: { type: String, default: '' },
    date: { type: String, default: '' },
    /** The left margin's lines, from lg. */
    rail: { type: Array, default: () => [] },
  },
}
</script>
