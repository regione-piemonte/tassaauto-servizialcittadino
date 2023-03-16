<template>
  <div class="container datiContribuente">
    <div class="card-view-page">
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="noAccordion mt-9" role="tablist" v-if="commonDatiContribuente">
        <v-row>
          <v-col cols="12" md="6">
            <dl class="data-user data-image--before">
              <dt class="text-capitalize">
                {{anagSoggetto}}
              </dt>
              <dd>
                {{commonDatiContribuente.codiceFiscale}}
              </dd>
            </dl>
          </v-col>
          <v-col cols="12" md="6">
            <dl class="data-address data-image--before">
              <dt class="text-uppercase">
                Residenza
              </dt>
              <dd>
                {{commonDatiContribuente.indirizzo}} | {{commonDatiContribuente.descComune}}
                ({{commonDatiContribuente.provincia}})
              </dd>
            </dl>
          </v-col>
        </v-row>
      </div>
      <div class="mt-9" v-else>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxNeutral
              show
              :msg="detailInfo"
              class="printDisplay"
            />
          </div>
        </div>
      </div>
    </div>
    <Spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import BoxNeutral from '@/components/BoxNeutral.vue'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import store from '@/store'
import {
  COMMON_DATI_CONTRIBUENTE
} from '@/store/actions.type'

export default {
  name: 'DatiContribuente',
  components: {
    BoxErrore,
    BoxNeutral,
    Spinner
  },
  data () {
    return {
      overlay: false,
      detailError: {
        message: '',
        title: ''
      },
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'commonDatiContribuente'
    ]),
    anagSoggetto: function () {
      if (this.commonDatiContribuente.denominazione) return this.commonDatiContribuente.denominazione
      return this.commonDatiContribuente.nome + ' ' + this.commonDatiContribuente.cognome
    }
  },
  async created () {
    this.overlay = true
    if (store.getters.userIdentity) {
      await store
        .dispatch(COMMON_DATI_CONTRIBUENTE, store.getters.userIdentity.cf)
        .then(() => {
          this.overlay = false
        })
        .catch((error) => {
          this.overlay = false
          if (error === null || error.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          }
          if (error.response.status) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          }
        })
    }
  }
}

</script>
