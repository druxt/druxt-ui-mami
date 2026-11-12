<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <!-- No label: the recipe display heads this list itself. -->
    <!-- Items -->
    <b-list-group>
      <b-list-group-item v-for="(item, key) of items" :key="key">
        <span v-text="item" />
      </b-list-group-item>
    </b-list-group>
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],
}
</script>
