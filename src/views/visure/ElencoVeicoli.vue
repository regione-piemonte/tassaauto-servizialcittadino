<template>
  <div class="container">
    <div class="row inner-cont-bollo">
      <div class="text-intro text-descrizione-servizio col-lg-8 offset-lg-2">
        <p>La visura Bollo auto on line permette al contribuente di consultare la regolarità dei pagamenti già effettuati (fino ai sei anni che precedono la consultazione)</p>
      </div>
    </div>
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page" v-if="visureElencoVeicoli !== null">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-9 mx-auto">
            <h3>Elenco Veicoli</h3>
            <p>
              Data ultimo aggiornamento: {{new Date(visureElencoVeicoli.dataUltimoAggiornamento) | dateFormat('DD/MM/YYYY')}}
            </p>
            <div class="noAccordion mt-9" role="tablist">
              <v-card
                v-for="(item, index) in visureElencoVeicoli.visure"
                :key="index"
                class="px-9 py-5 mb-5"
                no-body>
                <v-row align="center" :class="'dl-inline-header text-center bg-icoAlign bg-ico bg-ico-'+ item.tipoVeicolo.tipoVeicolo.codice" >
                  <dl class="col-md-6 col-lg-3">
                    <dt>
                      tipo
                    </dt>
                    <dd>
                      {{ item.tipoVeicolo.tipoVeicolo.descrizione }}
                    </dd>
                  </dl>
                  <dl class="col-md-6 col-lg-3">
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
                </v-row>
                <v-row align="center" justify="center">
                   <div class="col-auto mx-auto">
                    <v-btn
                      color="primary"
                      :aria-label="'vai alla pagina di dettaglio del veicolo ' + item.tipoVeicolo.targa"
                      depressed
                      type="submit"
                      @click="paginaDettaglio(visureElencoVeicoli.visure[index])">
                        Dettaglio
                    </v-btn>
                  </div>
                </v-row>
              </v-card>
            </div>
          </div>
        </div>
      </v-card>
       <v-card class="card-view-page" v-else>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxNeutral
              show
              :msg="detailInfo"
              class="printDisplay"
            />
          </div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  VISURE_CONTRIBUENTE,
  DETTAGLIO_VEICOLO_VISURE_KEY,
  DETTAGLIO_VEICOLO_SCELTO
} from '@/store/actions.type'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral.vue'
import Spinner from '@/components/layout/Spinner'
import store from '@/store'

export default {
  name: 'ElencoVeicoliVisure',
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
      this.overlay = true
      store
        .dispatch(DETTAGLIO_VEICOLO_VISURE_KEY, params)
        .then(() => {
          this.overlay = false
          this.$router.push(
            { name: 'dettaglio_veicoli_visure' }
          )
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          }
        })
    }
  },
  async created () {
    this.overlay = true
    if (store.getters.userIdentity) {
      await store
        .dispatch(VISURE_CONTRIBUENTE, store.getters.userIdentity.cf)
        .then(this.overlay = false)
        .catch((error) => {
          if (error === null) {
            this.overlay = false
            this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: null, errorMessage: 'Non è possibile accedere al servizio' } })
          }
          if (error.response.status) {
            this.overlay = false
            this.$router.push({ name: 'pageErrorAuth', params: { errorStatus: error.response.data.status, errorMessage: error.response.data.title } })
          }
        })
    }
  }
}
</script>
