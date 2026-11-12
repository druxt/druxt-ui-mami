<template>
  <div class="page-node">
    <UmamiPageHead :title="title">
      <template #breadcrumb>
        <slot name="breadcrumb" />
      </template>
    </UmamiPageHead>

    <div class="page-node__measure">
      <div class="page-node__body">
        <slot />
      </div>

      <slot name="after" />
    </div>
  </div>
</template>

<script>
/** A basic page: the head band, the body at a reading measure, then anything after it. */
export default {
  props: {
    title: { type: String, default: '' },
  },
}
</script>
