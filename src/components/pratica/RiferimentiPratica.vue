<template>
  <v-form>
    <div class="space-section" id="riferimentiPratica">
      <h2>
        {{ $t("general.box_titles.riferimenti") }}
      </h2>
      <v-alert show aria-live="off" type="info" border="left" :icon="false">
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              Devi inserire {{ descrizione }} per ricevere il
              <strong>numero di protocollo</strong> della pratica inviata.
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <div class="row inner-cont-alert my-9">
        <div class="text-intro col-12">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <div class="row" v-if="canaleEmailAttivo" id="canaleEmail">
        <div class="col-12 col-sm-6">
          <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="Indirizzo e-mail"
            id="email"
            v-model="rifForm.email"
            :error-messages="emailErrors"
            autocomplete="off"
            :error-count="3"
            @keyup="toLow"
          ></v-text-field>
           <!-- @keyup="toLow" per evitare che la mail venga inserita maiuscola -->
        </div>
      </div>
      <div class="row" v-if="canaleSmsAttivo" id="canaleSms">
        <div class="col-12 col-sm-6">
          <v-text-field
            clearable
            type="tel"
            @focus="resetErroriMsg()"
            clear-icon="mdi-close-circle"
            label="Numero di telefono mobile"
            id="telefono"
            v-model="rifForm.telefono"
            :error-messages="telefonoErrors"
            :maxLength="$v.rifForm.telefono.$params.maxLength.max"
            autocomplete="off"
            :error-count="5"
          ></v-text-field>
        </div>
      </div>
      <div class="inner-cont-2box info-left row" id="informativa-privacy">
        <div class="reset-margin">
          <div class="inline-check-submit no-gutters-col offset-lg-0 col-12">
            <div class="tooltip-field">
              <div class="position-relative d-inline-block">
                <v-checkbox
                  id="privacy"
                  v-model="rifForm.privacy"
                  @change="$v.rifForm.privacy.$touch()"
                  :state="!$v.rifForm.privacy.$error"
                  value="accepted"
                  unchecked-value="not_accepted"
                  :error-messages="privacyErrors"
                  :error-count="2"
                  :label="this.$i18n.t('general.privacy')"
                >
                </v-checkbox>
                <v-btn
                  fab
                  depressed
                  class="contextual-info privacy-btn"
                  @click="$refs.mwPrivacy.mostraModalePrivacy()"
                >
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalePrivacy
      ref="mwPrivacy"
      v-on:privacyaccepted="rifForm.privacy = 'accepted'"
    />
  </v-form>
</template>

<script>
import {
  CELL_MAX_LENGTH,
  CELL_MIN_LENGTH,
  emailAttiva,
  smsAttivo
} from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import { validationMixin } from 'vuelidate'
import { email, minLength, maxLength, numeric, requiredIf } from 'vuelidate/lib/validators'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  name: 'RiferimentiPratica',
  components: { BoxErrore, ModalePrivacy },
  props: {
    errorMsgPratica: { type: Object, required: false }
  },
  data () {
    return {
      atLeastOneMsg: 'Devi specificare almeno uno fra e-mail e numero di telefono cellulare.',
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo(),
      clickInvia: false,
      detailError: { message: '', title: '' },
      rifForm: {
        email: '',
        telefono: '',
        privacy: 'not_accepted'
      }
    }
  },
  computed: {
    descrizione: function () {
      let descrRif = ''
      if (this.canaleEmailAttivo) descrRif += 'un indirizzo e-mail valido'
      if (descrRif !== '' && this.canaleSmsAttivo) descrRif += ' e/o '
      if (this.canaleSmsAttivo) descrRif += 'un numero di telefono mobile'
      return descrRif
    },
    privacyErrors () {
      const errors = []
      if (!this.$v.rifForm.privacy.$error) return errors
      if (this.clickInvia && !this.$v.rifForm.privacy.acceptedPrivacy) errors.push(this.$i18n.t('general.labels.error.privacy'))
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.rifForm.email.$dirty) return errors
      !this.$v.rifForm.email.required && errors.push('L\'indirizzo e-mail è obbligatorio.')
      !this.$v.rifForm.email.email && errors.push('Digitare un indirizzo e-mail corretto.')
      if (this.clickInvia && !this.$v.rifForm.email.atLeastOne) errors.push(this.atLeastOneMsg)
      return errors
    },
    telefonoErrors () {
      const errors = []
      if (!this.$v.rifForm.telefono.$dirty) return errors
      !this.$v.rifForm.telefono.required && errors.push('Il numero di telefono mobile è obbligatorio.')
      !this.$v.rifForm.telefono.numeric && errors.push('Il numero di telefono mobile deve essere composto da soli numeri.')
      !this.$v.rifForm.telefono.minLength && errors.push('Il numero di telefono mobile deve essere composto da almeno ' + this.$v.rifForm.telefono.$params.minLength.min + ' numeri.')
      !this.$v.rifForm.telefono.maxLength && errors.push('Il numero di telefono mobile deve essere composto da massimo' + this.$v.rifForm.telefono.$params.maxLength.max + 'numeri.')
      if (this.clickInvia && !this.$v.rifForm.email.atLeastOne) errors.push(this.atLeastOneMsg)
      if (this.errorMsgPratica) errors.push(this.$i18n.t('general.api.errors.phone_error'))
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    rifForm: {
      email: {
        email,
        required: requiredIf(function () { return (this.canaleEmailAttivo && !this.canaleSmsAttivo) }),
        atLeastOne: function () {
          return !this.mailTelefonoVuoti()
        }
      },
      telefono: {
        minLength: minLength(CELL_MIN_LENGTH),
        maxLength: maxLength(CELL_MAX_LENGTH),
        numeric,
        required: requiredIf(function () { return (!this.canaleEmailAttivo && this.canaleSmsAttivo) }),
        atLeastOne: function () {
          return !this.mailTelefonoVuoti()
        }
      },
      privacy: { acceptedPrivacy }
    }
  },
  methods: {
    resetErroriMsg () {
      if (this.errorMsgPratica) {
        this.$emit('resetMsgErrorsPage', true)
      }
    },
    toLow () {
      this.rifForm.email = this.rifForm.email.toLowerCase()
    },
    iniziaValidazione () {
      this.clickInvia = true
    },
    getRiferimenti () {
      const retObj = {}
      if (this.canaleEmailAttivo) retObj.email = this.rifForm.email
      if (this.canaleSmsAttivo) retObj.telefono = this.rifForm.telefono
      return retObj
    },

    mailTelefonoVuoti () {
      if (!this.canaleEmailAttivo || !this.canaleSmsAttivo) return false
      if ((this.rifForm.email == null || this.rifForm.email === '') &&
        (this.rifForm.telefono == null || this.rifForm.telefono === '')) return true
      return false
    }
  },
  async created () {
    if (!this.canaleEmailAttivo && !this.canaleSmsAttivo) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, i canali di comunicazione E-mail ed SMS sono disabilitati.'
      }
      this.$emit('bloccainvioosservazione')
    }
  }
}
</script>
