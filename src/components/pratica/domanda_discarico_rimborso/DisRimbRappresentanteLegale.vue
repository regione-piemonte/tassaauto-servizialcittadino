<template>
  <div>
    <div v-show="step === 1">
      <sub-wizard
        :servizio="'richiesta_rappresentante_legale'"
        :stepAttivo="0"
      />
      <rappresentante-legale-box
        ref="RappresentanteLegaleBox"
      />
      <v-btn
        id="rappLegaleAvanti"
        @click="next()"
        type="submit" color="primary">
        {{ $t('general.buttons.avanti') }}
      </v-btn>
    </div>
    <div v-show="step === 2">
      <sub-wizard
        :servizio="'richiesta_rappresentante_legale'"
        :stepAttivo="1"
      />
      <div class="space-section">
        <h2>
          Dati soggetto rappresentato
        </h2>
        <v-form
          @submit.prevent="iniziaRichiestaDomandaDiscaricoRimborso">
          <codice-fiscale
            :servizioCF="'IntestatarioIngiunzioneRL'"
            ref="cFSoggRapp"
            :pServerErr="serverErrors.codiceFiscale"
            v-on:cfchanged="serverErrors.codiceFiscale=''"
          />
          <tassa-auto-recaptcha
            :pCount="noCaptchaCount"
            v-on:recaptchaverified="updRecaptchaVerified()"
            v-on:recaptchanotverified="recaptchaVerified = false"
          />
          <div class="action-button-wide spaceTopButtonSubmit">
            <div class="col-md-6">
              <v-btn
                id="indietroDTERL"
                @click.prevent="step = 1">
                Indietro
              </v-btn>
            </div>
            <div class="col-md-6 text-md-right">
              <v-btn
                id="cercaDTERL"
                type="submit"
                color="primary">
                {{ $t('general.buttons.avanti') }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import CodiceFiscale from '@/components/CodiceFiscale'
import RappresentanteLegaleBox from '@/components/pratica/RappresentanteLegaleBox'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import SubWizard from '@/components/layout/SubWizard'
import store from '@/store'
import {
  DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO,
  CERCA_DOMANDA_DISCARICO_RIMBORSO
} from '@/store/actions.type'

export default {
  name: 'DisRimbRappresentanteLegale',
  components: {
    CodiceFiscale,
    RappresentanteLegaleBox,
    SubWizard,
    TassaAutoRecaptcha
  },
  props: {
    boxErr: { type: Object, required: true }
  },
  data () {
    return {
      noCaptchaCount: 0,
      recaptchaVerified: false,
      step: 1,
      serverErrors: { codiceFiscale: '' }
    }
  },
  methods: {
    next () {
      if (!this.$refs.RappresentanteLegaleBox.datiRapprLegaleValidi()) return
      this.step = 2
    },

    iniziaRichiestaDomandaDiscaricoRimborso () {
      this.$refs.cFSoggRapp.$v.cfForm.$touch()
      if (this.$refs.cFSoggRapp.$v.cfForm.$invalid) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }

      const datiRapprLegale = this.$refs.RappresentanteLegaleBox.datiRappresentanteLegale()
      // dati del rappresentante legale messi nello store di Vuex
      store.dispatch(DATI_LEGALE_RAPPRESENTANTE_DOMANDA_DISCARICO, datiRapprLegale)

      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(CERCA_DOMANDA_DISCARICO_RIMBORSO, this.$refs.cFSoggRapp.getValore())
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.dataAnagraficiIntestatario.denominazione === null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Il Codice fiscale inserito non corrisponde ad una Persona Giuridica.'
            })
            return
          }
          this.$router.push({ name: 'crea_domanda_discarico_rimborso' })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error === null || error.response === undefined) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            })
            return
          }
          if (error.response.status === 400) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            })
            this.noCaptchaCount++
          } else if (error.response.status === 404) {
            // msg costante per poter usare i test con selenium
            const notFoundMsg = 'Ingiunzione/Cartella di Pagamento non presente in archivio con il CF inserito.'
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: notFoundMsg
            })
            this.serverErrors.codiceFiscale = notFoundMsg
            this.noCaptchaCount++
          } else if (error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.search_params_invalid')
            })
            this.noCaptchaCount++
            this.serverErrors.codiceFiscale = error.response.data.title
          } else if (error.response.status === 500) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            })
          }
        })
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  }
}
</script>
