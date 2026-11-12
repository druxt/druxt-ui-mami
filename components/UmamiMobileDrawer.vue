<template>
  <b-sidebar
    :id="id"
    backdrop
    left
    no-close-on-route-change
    no-header
    shadow
    width="min(330px, 86vw)"
    @hidden="lockPage(false)"
    @shown="lockPage(true)"
  >
    <template #default="{ hide }">
      <div class="drawer">
        <div class="drawer__head">
          <nuxt-link class="drawer__brand" :to="to" @click.native="hide">
            <span class="drawer__wordmark">{{ name }}</span>
            <span class="drawer__tagline">{{ tagline }}</span>
          </nuxt-link>

          <button
            :aria-label="closeLabel"
            class="drawer__close"
            type="button"
            @click="hide"
          >
            <BIconX aria-hidden="true" />
          </button>
        </div>

        <!-- The menu. The slot gets `hide`, to close the drawer when a link
             is followed. -->
        <slot name="menu" :hide="hide" />

        <UmamiLanguageSwitch
          :languages="languages"
          variant="drawer"
          @navigate="hide"
        />

        <!-- The credit line at the foot. -->
        <div v-if="creditHref" class="drawer__druxt">
          <span class="drawer__druxt-kicker">
            <slot name="credit-icon" />
            {{ creditLabel }}
          </span>

          <a
            class="drawer__druxt-link"
            :href="creditHref"
            rel="noopener"
            target="_blank"
          >
            {{ creditText }} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { BIconX } from 'bootstrap-vue'

/**
 * The phone menu: a drawer from the left, opened by UmamiMasthead's toggle.
 * The page behind it holds still while it is open.
 */
export default {
  components: { BIconX },

  props: {
    /** The id UmamiMasthead's toggle names. */
    id: { type: String, default: 'menu' },

    name: { type: String, default: 'Umami' },
    tagline: { type: String, default: 'Food magazine' },
    /** Where the brand links. */
    to: { type: [String, Object], default: '/' },

    closeLabel: { type: String, default: 'Close menu' },

    /** The language buttons, as UmamiLanguageSwitch takes them. */
    languages: { type: Array, default: () => [] },

    /** The credit line: a kicker, and a link. No link, no credit line. */
    creditLabel: { type: String, default: '' },
    creditHref: { type: String, default: '' },
    creditText: { type: String, default: '' },

    /**
     * The current page's path. A new page starts at the top, so when it
     * changes the drawer forgets the scroll position it would restore.
     */
    path: { type: String, default: '' },
  },

  watch: {
    path() {
      this.scrollY = 0
    },
  },

  beforeDestroy() {
    this.lockPage(false)
  },

  methods: {
    /**
     * Hold the page still behind the open drawer, so a swipe scrolls the
     * drawer, and put the reader back where they were when it closes.
     */
    lockPage(locked) {
      const body = document.body
      if (locked) {
        this.scrollY = window.scrollY
        Object.assign(body.style, {
          position: 'fixed',
          top: `-${this.scrollY}px`,
          width: '100%',
        })
        return
      }
      if (body.style.position !== 'fixed') {
        return
      }
      Object.assign(body.style, { position: '', top: '', width: '' })
      window.scrollTo(0, this.scrollY || 0)
    },
  },
}
</script>
