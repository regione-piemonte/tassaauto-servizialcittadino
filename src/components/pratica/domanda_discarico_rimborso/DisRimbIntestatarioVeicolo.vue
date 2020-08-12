<template>
  <div class="space-section">
    <v-form
      @submit.prevent="iniziaDomanda">
      <codice-fiscale
        :servizioCF="'IntestatarioIngiunzione'"
        ref="codiceFiscale"
        :pServerErr="serverErrors.codiceFiscale"
        v-on:cfchanged="serverErrors.codiceFiscale=''"
      />
      <tassa-auto-recaptcha
        :pCount="noCaptchaCount"
        v-on:recaptchaverified="updRecaptchaVerified()"
        v-on:recaptchanotverified="recaptchaVerified = false"
      />
      <v-btn
        class="spaceTopButtonSubmit"
        id="btnIntVeicAvanti"
        type="submit"
        color="primary"
      >
        Avanti
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import CodiceFiscale from '@/components/CodiceFiscale'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { CERCA_DOMANDA_DISCARICO_RIMBORSO } from '@/store/actions.type'

export default {
  name: 'DisRimbIntestatarioVeicolo',
  components: { CodiceFiscale, TassaAutoRecaptcha },
  data () {
    return {
      noCaptchaCount: 0,
      recaptchaVerified: false,
      serverErrors: { codiceFiscale: '' }
    }
  },
  methods: {
    iniziaDomanda () {
      this.$refs.codiceFiscale.$v.cfForm.$touch()
      if (this.$refs.codiceFiscale.$v.cfForm.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(CERCA_DOMANDA_DISCARICO_RIMBORSO, this.$refs.codiceFiscale.getValore())
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.dataAnagraficiIntestatario.denominazione !== null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Il Codice fiscale inserito non corrisponde ad una Persona Fisica.'
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
