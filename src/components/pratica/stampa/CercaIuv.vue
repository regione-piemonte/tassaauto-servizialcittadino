<template>
  <div>
    <v-form @submit.prevent="cercaIuv">
      <v-text-field
        :error-count="3"
        :error-messages="iuvErrors"
        :maxlength="$v.iuvForm.iuv.$params.maxLength.max"
        @change.native="resetErroriServer()"
        @focusout="toTrim()"
        autocomplete="off"
        class="uppercase-input"
        clear-icon="mdi-close-circle"
        clearable
        id="iuv"
        label="IUV / Codice di avviso di pagamento"
        type="text"
        v-model="iuvForm.iuv"
      ></v-text-field>
      <tassa-auto-recaptcha
        :pCount="noCaptchaCount"
        v-on:recaptchaverified="updRecaptchaVerified()"
        v-on:recaptchanotverified="recaptchaVerified = false"
      />
      <v-btn
        depressed
        class="spaceTopButtonSubmit"
        type="submit"
        color="primary"
      >
        {{ $t("general.buttons.search") }}
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import ApiError from '@/common/api.error'
import { NO_RECAPTCHA_ATTEMPTS, IUV_LENGTH } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import { STAMPA_AVV_ACCERTAMENTO_CERCA_IUV, STAMPA_AVV_SCADENZA_CERCA_IUV } from '@/store/actions.type'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, alphaNum, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'CercaIuv',
  props: {
    boxErr: { type: Object, required: true },
    pStampaAccertamento: { type: Boolean, required: true }
  },
  components: { TassaAutoRecaptcha },
  data () {
    return {
      iuvForm: { iuv: '' },
      noCaptchaCount: 0,
      recaptchaVerified: false,
      serverErrors: { iuv: '' }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    iuvForm: {
      iuv: {
        required,
        alphaNum,
        maxLength: maxLength(IUV_LENGTH),
        serverFailed: function () {
          return !ApiError.serverValidationFailed(this.serverErrors, 'iuv')
        }
      }
    }
  },
  computed: {
    iuvErrors () {
      const errors = []
      if (!this.$v.iuvForm.iuv.$dirty) return errors
      !this.$v.iuvForm.iuv.required && errors.push('Lo IUV / Codice di avviso di pagamento è obbligatorio.')
      !this.$v.iuvForm.iuv.alphaNum && errors.push('Lo IUV / Codice di avviso di pagamento deve contenere solo lettere e numeri.')
      !this.$v.iuvForm.iuv.serverFailed && errors.push(this.serverErrors.iuv)
      return errors
    }
  },
  methods: {
    toTrim () {
      this.iuvForm.iuv = this.iuvForm.iuv.replace(/\s/g, '').toUpperCase()
    },
    cercaIuv () {
      this.resetErroriServer()
      this.$v.iuvForm.iuv.$touch()
      if (this.$v.iuvForm.iuv.$invalid) return
      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        })
        return
      }
      if (!NavigatorService.checkInternetConnection()) return

      const action = (this.pStampaAccertamento) ? STAMPA_AVV_ACCERTAMENTO_CERCA_IUV : STAMPA_AVV_SCADENZA_CERCA_IUV
      const esito = (this.pStampaAccertamento) ? 'riepilogo_avviso_accertamento' : 'riepilogo_avviso_scadenza'

      this.$emit('controlspinner', { running: true })
      store
        .dispatch(action, this.iuvForm.iuv)
        .then(() => {
          this.$emit('controlspinner', { running: false })
          this.$router.push({ name: esito })
        })
        .catch((error) => {
          this.$emit('controlspinner', { running: false })
          if (error.response == null) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: error.message
            })
            return
          }

          if (error.response.status === 404 || error.response.status === 409 ||
            error.response.status === 422) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            })
            this.noCaptchaCount++
            this.serverErrors.iuv = error.response.data.title
          } else if (error.response.status === 500 || error.response.status === 503 || error.response.status === 505) {
            this.$emit('updateboxerr', {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            })
          }
        })
    },

    resetErroriServer () {
      this.serverErrors.iuv = ''
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.$emit('updateboxerr', { message: '', title: '' })
      this.noCaptchaCount = 0
    }
  }
}
</script>
