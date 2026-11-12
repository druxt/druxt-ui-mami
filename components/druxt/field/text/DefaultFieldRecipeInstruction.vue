<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <!-- No label: the recipe display heads the method itself. -->

    <!-- Prose before the list, such as a note on preparation. -->
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="list && prose.before"
      class="method-prose"
      v-html="prose.before"
    />
    <!-- eslint-enable vue/no-v-html -->

    <!-- Each list item becomes a numbered step. -->
    <ol v-if="list" class="method-steps">
      <li v-for="(item, key) of list" :key="key" class="method-step">
        <span class="method-step__n">{{ key + 1 }}</span>
        <!-- eslint-disable vue/no-v-html -->
        <span class="method-step__text" v-html="item" />
        <!-- eslint-enable vue/no-v-html -->
      </li>
    </ol>

    <!-- Prose after the list: Umami's recipes close with how to serve. -->
    <!-- eslint-disable vue/no-v-html -->
    <div v-if="list && prose.after" class="method-prose" v-html="prose.after" />
    <!-- eslint-enable vue/no-v-html -->

    <!-- eslint-disable vue/no-v-html -->
    <div
      v-else-if="!list"
      class="method-prose"
      v-html="items[0].processed"
    />
    <!-- eslint-enable vue/no-v-html -->
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],

  computed: {
    list() {
      return this.items[0].processed.match(/(?<=<li>).*?(?=<\/li>)/g)
    },
    /** The HTML around the list, which the steps do not carry. */
    prose() {
      const html = this.items[0].processed
      const start = html.search(/<ol[\s>]/i)
      const end = html.search(/<\/ol>/i)
      if (start < 0 || end < 0) return { before: '', after: '' }
      return {
        before: html.slice(0, start).trim(),
        after: html.slice(end + '</ol>'.length).trim(),
      }
    },
  },
}
</script>
