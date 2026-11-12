<template>
  <!-- View displays only: this package renders, it does not edit. A form
       field reaching here renders nothing. -->
  <component :is="wrapper.component" v-if="isSchemaView" v-bind="wrapper.props">
    <!-- Image fields. -->
    <template v-if="isTypeImage">
      <DruxtEntity
        v-for="{ type, id } of relationships"
        :key="id"
        v-bind="{ type, uuid: id }"
      >
        <!-- A plain image with native lazy loading: it is in the page
             before JavaScript runs, and the browser decides when to fetch. -->
        <template #default="{ entity }">
          <img
            alt=""
            class="card-img"
            loading="lazy"
            :src="
              ($config.baseUrl || '') +
              entity.attributes.uri.value.replace(
                'public://',
                '/sites/default/files/'
              )
            "
          />
        </template>
      </DruxtEntity>
    </template>

    <!-- Reference fields. -->
    <template v-else-if="relationship">
      <DruxtEntity
        v-for="{ type, id } of relationships"
        :key="id"
        v-bind="{ type, uuid: id }"
      />
    </template>

    <!-- Link field. -->
    <template v-else-if="isTypeLink">
      <b-button
        v-for="(item, key) of items"
        :key="key"
        :to="item.uri.replace('internal:', '')"
      >
        {{ item.title }}
      </b-button>
    </template>

    <!-- Other View display fields. A div, because a text field's HTML holds
         its own paragraphs, and a p inside a p is re-parsed by the browser
         into markup the server never sent. -->
    <!-- eslint-disable-next-line -->
    <div v-else v-html="html" />
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'
import DruxtEntity from 'druxt-entity/dist/components/DruxtEntity.vue'

export default {
  components: { DruxtEntity },

  mixins: [DruxtFieldMixin],

  data: ({ value }) => ({ model: value }),

  computed: {
    /**
     * One size fits all HTML to render for View displays, with JSON.stringify() as a fallback.
     * @returns {string}
     */
    html: ({ model }) => {
      if (typeof model === 'string') return model
      if (
        model &&
        typeof model === 'object' &&
        ('processed' in model || 'value' in model)
      ) {
        return model.processed || model.value || ''
      }
      return model == null ? '' : JSON.stringify(model)
    },

    isSchemaView: ({ schema }) => schema.config.schemaType === 'view',

    isTypeLink: ({ schema }) => ['link'].includes(schema.type),
    isTypeImage: ({ schema }) => ['responsive_image'].includes(schema.type),

    relationships: ({ model }) =>
      typeof (model || {}).data === 'object'
        ? [model.data]
        : (model || {}).data || false,
  },
}
</script>
