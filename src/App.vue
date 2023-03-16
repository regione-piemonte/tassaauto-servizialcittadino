<template>
  <v-app ref="routerView">
    <vue-headful
      lang="it"
      :title="headTitle"
    />
    <div :class="(this.$route.name !== 'home') ? 'footer-fix' : 'footer-fix footer-fixHome'" aria-relevant="true">
      <div role="listbox" aria-label="Navigazione nascosta per screen reader" v-if="headerHidden">
        <a href='#main-content' class="skip-link" role="listitem">Vai al contenuto principale</a>
        <a href='#footer' class="skip-link" role="listitem">Vai al footer</a>
      </div>
    <Header />
    <main id="main-content" aria-relevant="text">
      <csi-app-bootstrap>
        <router-view />
      </csi-app-bootstrap>
    </main>
    </div>
    <Footer />
  </v-app>
</template>

<script>
import Vue from 'vue'
import vueHeadful from 'vue-headful'
import { REGIONE_PARAMS } from '@/common/config'
import CsiAppBootstrap from '@/components/global/common/CsiAppBootstrap'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

Vue.component('vue-headful', vueHeadful)

export default {
  name: 'App',
  components: { CsiAppBootstrap, Header, Footer },
  data () {
    return {
      headTitle: REGIONE_PARAMS.HEAD_TITLE,
      headerHidden: false
    }
  },
  watch: {
    $route: function () {
      this.$nextTick(function () {
        setTimeout(() => {
          const focusTarget = this.$refs.routerView.$el
          focusTarget.setAttribute('tabindex', '-1')
          focusTarget.focus()
          // Rimuovere tabIndex: https://axesslab.com/skip-links/#update-3-a-comment-from-gov-uk
          focusTarget.removeAttribute('tabindex')
        }, 0)
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.headerHidden = true
    }, 5)
    this.$nextTick(() => {
      document.body.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
          const home = document.getElementById('home-button')
          if (home != null) {
            home.focus()
            home.classList.add('keyFocus')
          }
        }
        if (e.key === 'Tab') {
          const focused = Array.from(document.getElementsByClassName('keyFocus'))
          focused.concat(document.getElementsByTagName('a'))
          focused.concat(document.getElementsByClassName('v-list-item--link'))
          new Promise((resolve) => {
            focused.forEach(function (element) {
              element.classList.remove('keyFocus')
            })
            resolve()
          }).then(() => {
            if (document.activeElement.classList.contains('v-btn--disabled') || document.activeElement.classList.contains('cursor-pointer-off') || document.activeElement.classList.contains('disabled-card h3')) {
              document.activeElement.classList.remove('keyFocus')
            } else {
              if (document.activeElement.offsetParent.classList.value === 'v-select__slot' || document.activeElement.offsetParent.classList.value === 'v-input--selection-controls__input' || document.activeElement.offsetParent.classList.value === 'v-list-item--link') {
                document.activeElement.offsetParent.classList.add('keyFocus')
              } else {
                document.activeElement.classList.add('keyFocus')
              }
            }
          })
            .catch((error) => {
              console.log(error)
            })
        }
        if (e.key === 'Escape') {
          document.activeElement.classList.remove('keyFocus')
        }
      }, false)
    })
  }
}
</script>
