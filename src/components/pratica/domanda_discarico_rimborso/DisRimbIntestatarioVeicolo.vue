<template>
  <div class="space-section">
    <v-form
      @submit.prevent="iniziaDomanda">
      <codice-fiscale
        :servizioCF="'IntestatarioIngiunzione'"
        ref="codiceFiscale"
        :pServerErr="serverErrors.codiceFiscale"
        v-on:cfchanged="serverErrors.codiceFiscale=''"
        v-if="!logged"
      />
      <!--accesso servizio con autenticaticazione-->
      <v-text-field
        v-else
        disabled
        label="Codice fiscale"
        v-model="userIdentity.cf">
      </v-text-field>
      <tassa-auto-recaptcha
        :pCount="noCaptchaCount"
        v-on:recaptchaverified="updRecaptchaVerified()"
        v-on:recaptchanotverified="recaptchaVerified = false"
        v-if="!logged"
      />
      <v-btn
        depressed
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
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['isUserLogged', 'userIdentity', 'isUserLoggedLocalhost']),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  methods: {
    iniziaDomanda () {
      if (!this.logged) {
        this.$refs.codiceFiscale.$v.cfForm.$touch()
        if (this.$refs.codiceFiscale.$v.cfForm.$invalid) return
        if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
          this.$emit('updateboxerr', {
            title: this.$i18n.t('general.error'),
            message: 'Dimostra di non essere un robot'
          })
          return
        }
      }
      if (!NavigatorService.checkInternetConnection()) return

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(CERCA_DOMANDA_DISCARICO_RIMBORSO, (this.logged) ? this.userIdentity.cf : this.$refs.codiceFiscale.getValore())
        .then(({ data }) => {
          this.$emit('controlspinner', { running: false })
          if (data.dataAnagraficiIntestatario.denominazione !== null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: 'Per poter inserire una domanda di discarico per una persona giuridica, è necessario utilizzare la ricerca per persona giuridica.'
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
