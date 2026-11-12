<template>
  <!-- The routed entity, rendered. The Umami demo wraps this in its View and
       Edit tabs; this package renders only. A contact form is a form, so it
       is left out here. -->
  <div>
    <DruxtEntity
      v-if="!isContactForm"
      v-bind="route.props"
      class="page-tabs__pane"
    />
  </div>
</template>

<script>
import { DruxtRouterMixin } from 'druxt-router'

export default {
  mixins: [DruxtRouterMixin],

  computed: {
    isContactForm() {
      return this.route.props.type === 'contact_form--contact_form'
    },
  },
}
</script>
