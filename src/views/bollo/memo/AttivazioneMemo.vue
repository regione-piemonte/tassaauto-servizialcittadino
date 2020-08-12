<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-xxl-8 offset-xxl-2">
        <BoxErrore :error="detailError" />
      </div>
    </div>
    <div class="app-row inner-cont-2box">
      <div class="col-xxl-8 offset-xxl-2">
        <h2>
          Risultato della ricerca
        </h2>
        <div
          :class="'dl-inline-header text-center bg-ico bg-ico-'+ esitoMemoVerifica.tipoVeicolo.codice" id="desc-veicolo">
          <dl class="col-4 col-md-3 col-lg-3 col-xl-2">
            <dt>
              tipo
            </dt>
            <dd>
              {{ esitoMemoVerifica.tipoVeicolo.descrizione }}
            </dd>
          </dl>
          <dl class="col-4 col-md-3 col-lg-3 col-xl-2">
            <dt>
              targa
            </dt>
            <dd>
              {{ esitoMemoVerifica.targa }}
            </dd>
          </dl>
        </div>
      </div>
      <AttivazioneEmailMemo
        v-bind:boxErr.sync="detailError"
        v-on:controlspinner="overlay = $event.running"
        v-on:updateboxerr="updateDetailError($event)"
        v-if="canaleEmailAttivo"
      />
      <AttivazioneSmsMemo
        v-bind:boxErr.sync="detailError"
        v-on:controlspinner="overlay = $event.running"
        v-on:updateboxerr="updateDetailError($event)"
        v-if="canaleSmsAttivo"
      />
      <div class="text-intro col-xxl-8 offset-xxl-2 col-12">
        <div class="action-button-wide">
          <div class="col-md-6">
            <BtnHome />
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              color="primary"
              :to="{ name: 'cerca_veicolo_memo' }">
              {{ $t('general.buttons.nuovo_veicolo') }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    </v-card>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { emailAttiva, smsAttivo } from '@/common/config'
import AttivazioneEmailMemo from '@/components/bollo/memo/AttivazioneEmailMemo'
import AttivazioneSmsMemo from '@/components/bollo/memo/AttivazioneSmsMemo'
import BoxErrore from '@/components/BoxErrore'
import BtnHome from '@/components/layout/btn/BtnHome'
import Spinner from '@/components/layout/Spinner'
import { MEMO_VERIFICA } from '@/store/actions.type'
import store from '@/store'

export default {
  components: {
    AttivazioneEmailMemo,
    AttivazioneSmsMemo,
    BoxErrore,
    BtnHome,
    Spinner
  },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo(),
      detailError: { title: '', message: '' },
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'esitoMemoVerifica'
    ])
  },
  methods: {
    updateMemo (pCodFiscale, pTarga, pTipoVeicolo) {
      store
        .dispatch(MEMO_VERIFICA, {
          codiceFiscale: pCodFiscale,
          targa: pTarga,
          tipoVeicolo: pTipoVeicolo
        })
        .then(({ data }) => {
        })
        .catch((error) => {
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Parametri obbligatori non valorizzati'
            }
          } else if (error.response.status === 403) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Codice fiscale non corrisponde al proprietario del veicolo'
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: 'Veicolo non trovato'
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            }
          }
        })
    },
    updateDetailError (detErr) {
      this.detailError = detErr
    }
  }
}
</script>
