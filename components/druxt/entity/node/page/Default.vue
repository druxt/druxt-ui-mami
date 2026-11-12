<template>
  <div class="page-node">
    <!-- The head band, as a term draws it: breadcrumb and title. -->
    <div class="term-head bleed">
      <b-container class="term-head__inner">
        <DruxtBreadcrumb />
        <h1 class="term-head__title" v-text="entity.attributes.title" />
      </b-container>
    </div>

    <div class="page-node__measure">
      <div class="page-node__body">
        <slot name="field_body" />
      </div>

      <!-- The About page carries the frontend's own section: what Druxt is.
           Drupal's body above stays the editor's. -->
      <section v-if="isAbout" class="about-druxt">
        <div class="about-druxt__head">
          <AppDruxtMark class="about-druxt__mark" />
          <div>
            <span class="about-druxt__kicker">{{ $t('about.kicker') }}</span>
            <h2 class="about-druxt__title">{{ $t('about.title') }}</h2>
          </div>
        </div>
        <p>{{ $t('about.p1') }}</p>
        <p>{{ $t('about.p2') }}</p>
        <p>{{ $t('about.p3') }}</p>
      </section>
    </div>
  </div>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'

/** The About page's alias in each language. */
const ABOUT = ['/about-umami', '/acerca-de-umami']

export default {
  mixins: [DruxtEntityMixin],

  computed: {
    isAbout: ({ entity }) =>
      ABOUT.includes(((entity.attributes || {}).path || {}).alias),
  },

  druxt: {
    query: {
      fields: ['field_body', 'path', 'title'],
    },
  },
}
</script>
