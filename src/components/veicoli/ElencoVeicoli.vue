<template>
  <div class="container">
    <div class="card-view-page" v-if="visureElencoVeicoli !== null">
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="noAccordion mt-9" role="tablist">
        <div
          v-for="(item, index) in visureElencoVeicoli.visure"
          :key="index"
          class="py-5 tabListVeicoli"
          no-body>
          <v-row align="center" :class="'pt-5 tabListSingleVeicoli dl-inline-header text-center bg-icoAlign bg-ico bg-ico-'+ item.tipoVeicolo.tipoVeicolo.codice" >
            <dl class="col-md-6 col-lg-2">
              <dt>
                tipo
              </dt>
              <dd>
                {{ item.tipoVeicolo.tipoVeicolo.descrizione }}
              </dd>
            </dl>
            <dl class="col-md-6 col-lg-2">
              <dt>
                targa
              </dt>
              <dd>
                {{ item.tipoVeicolo.targa }}
              </dd>
            </dl>
            <dl class="col-md-6 col-lg-3">
              <dt v-if="item.dataFineProprieta">
                Data fine proprietà
              </dt>
              <dd v-if="item.dataFineProprieta">
                {{new Date(item.dataFineProprieta) | dateFormat('DD/MM/YYYY')}}
              </dd>
            </dl>
            <dl class="col-md-6 col-lg-2">
              <v-btn
                color="primary"
                :aria-label="'vai alla pagina di dettaglio del veicolo ' + item.tipoVeicolo.targa"
                depressed
                type="submit"
                @click="paginaDettaglio(visureElencoVeicoli.visure[index])">
                  Dettaglio
              </v-btn>
            </dl>
          </v-row>
        </div>
      </div>
    </div>
    <div class="card-view-page" v-else>
      <div class="row inner-cont-alert" v-if="detailError.message">
        <div class="text-intro col-lg-8 offset-lg-2">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="row inner-cont-alert" v-else>
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
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VISURE_CONTRIBUENTE,
  DETTAGLIO_VEICOLO_VISURE_KEY,
  DETTAGLIO_VEICOLO_SCELTO,
  VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE
} from '@/store/actions.type'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral.vue'
import Spinner from '@/components/layout/Spinner'
import store from '@/store'

export default {
  name: 'ElencoVeicoli',
  data () {
    return {
      overlay: false,
      detailError: { message: '', title: '' },
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      }
    }
  },
  components: { BoxErrore, BoxNeutral, Spinner },
  computed: {
    ...mapGetters([
      'userIdentity',
      'visureElencoVeicoli'
    ])
  },
  methods: {
    paginaDettaglio (veicolo, index) {
      store.dispatch(VISURE_DETTAGLIO_VEICOLO_SCELTO_RESET_STATE)
      const params = {
        cf: this.userIdentity.cf,
        visura: {
          tipoVeicolo: {
            targa: veicolo.tipoVeicolo.targa,
            tipoVeicolo: {
              codice: veicolo.tipoVeicolo.tipoVeicolo.codice,
              descrizione: veicolo.tipoVeicolo.tipoVeicolo.codice
            },
            descrizione: veicolo.tipoVeicolo.descrizione,
            idVeicolo: veicolo.tipoVeicolo.idVeicolo
          },
          dataInizioProprieta: veicolo.dataInizioProprieta,
          dataFineProprieta: veicolo.dataFineProprieta
        }
      }
      store.dispatch(DETTAGLIO_VEICOLO_SCELTO, veicolo)
      this.$emit('controlspinner', { running: true })
      store
        .dispatch(DETTAGLIO_VEICOLO_VISURE_KEY, params)
        .then(() => {
          this.$emit('controlspinner', { running: false })
          this.$router.push(
            { name: 'dettaglio_veicoli_visure' }
          )
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error == null || error.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          }
          if (error) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          }
        })
    }
  },
  async created () {
    this.$emit('controlspinner', { running: true })
    if (store.getters.userIdentity) {
      await store
        .dispatch(VISURE_CONTRIBUENTE, store.getters.userIdentity.cf)
        .then(() => {
          if (this.visureElencoVeicoli) {
            this.$emit('controlspinner', { running: false })
          }
        })
        .catch((error) => {
          if (error === null) {
            this.$emit('controlspinner', { running: false })
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Non è possibile accedere al servizio'
            }
          }
          if (error.response.status) {
            this.$emit('controlspinner', { running: false })
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
