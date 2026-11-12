<template>
  <b-sidebar
    id="menu"
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
          <nuxt-link class="drawer__brand" to="/" @click.native="hide">
            <span class="drawer__wordmark">Umami</span>
            <span class="drawer__tagline">{{ $t('site.tagline') }}</span>
          </nuxt-link>

          <button
            :aria-label="$t('nav.closeMenu')"
            class="drawer__close"
            type="button"
            @click="hide"
          >
            <BIconX aria-hidden="true" />
          </button>
        </div>

        <DruxtMenu class="drawer__menu" component="nav" name="main">
          <!-- The slot replaces the menu's own list item, so it keeps one:
               a list holds nothing but items. -->
          <template #item="{ item: { entity }, to }">
            <li class="drawer__item">
              <nuxt-link class="drawer__link" :to="to" @click.native="hide">
                {{ entity.attributes.title }}
              </nuxt-link>
            </li>
          </template>
        </DruxtMenu>

        <div class="drawer__lang">
          <nuxt-link
            v-for="code in ['en', 'es']"
            :key="code"
            :class="['drawer__lang-btn', { 'is-active': code === current }]"
            :to="path(code)"
            @click.native="hide"
          >
            {{ code.toUpperCase() }}
          </nuxt-link>
        </div>

        <!-- The promo layer stays confined to blue. -->
        <div class="drawer__druxt">
          <span class="drawer__druxt-kicker">
            <AppDruxtLogo class="drawer__druxt-logo" />
            {{ $t('demoBar.builtWith') }}
          </span>

          <a
            class="drawer__druxt-link"
            href="https://druxtjs.org"
            rel="noopener"
            target="_blank"
          >
            druxtjs.org <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import { BIconX } from 'bootstrap-vue'
import { langSwitchMixin } from '../../utils/lang'

export default {
  components: { BIconX },

  // The language buttons: each one to that language's version of the page.
  mixins: [langSwitchMixin],

  fetchKey: 'lang-switch-drawer',

  watch: {
    /** A link in the drawer opens a new page, which starts at the top. */
    '$route.path'() {
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
