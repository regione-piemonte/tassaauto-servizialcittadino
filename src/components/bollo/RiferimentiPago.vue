<template>
  <v-form>
    <div class="space-section" id="riferimentiPraticaPago">
      <h2>
        {{ $t('general.box_titles.riferimenti') }}
      </h2>
      <div class="app-row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2 col-12">
          <BoxErrore :error="detailError" />
        </div>
      </div>
      <v-alert
        color="info"
        border="left">
        <template v-slot:prepend>
          <v-icon x-large>mdi-information</v-icon>
        </template>
          Devi inserire un <strong>indirizzo e-mail</strong> per ricevere la
          notifica sull'esito della transazione di pagamento e lo IUV (Identificativo
          Univoco di pagamento) per scaricare la <strong>RICEVUTA TELEMATICA</strong> di pagamento.
      </v-alert>
      <div class="row" v-if="canaleEmailAttivo">
        <div class="col-xl-5">
          <v-text-field
          clearable
          clear-icon="mdi-close-circle"
          label="Indirizzo e-mail"
          id="email"
          type="text"
          v-model="rifForm.email"
          :error-messages="emailErrors"
          autocomplete="off"
          :error-count="2"
          ></v-text-field>
        </div>
      </div>
      <div class="inner-cont-2box info-left app-row">
        <div class="reset-margin">
          <div class="inline-check-submit">
            <div class="tooltip-field">
              <div class="position-relative d-inline-block">
                <v-checkbox
                  id="privacy"
                  v-model="rifForm.privacy"
                  @change="$v.rifForm.privacy.$touch()"
                  :error-messages="privacyErrors"
                  :state="!$v.rifForm.privacy.$error"
                  value="accepted"
                  unchecked-value="not_accepted"
                  :label="this.$i18n.t('general.privacy')">
                </v-checkbox>

                <v-btn
                  class="contextual-info privacy-btn"
                  @click="$refs.mwPrivacy.mostraModalePrivacy()">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </div>
              <div class="error--text"
                v-if="clickInvia && !$v.rifForm.privacy.acceptedPrivacy">
                Il consenso all'informativa sulla privacy è obbligatorio.
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
import { emailAttiva } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  // a differenza di RiferimentiPratica, in RiferimentiPago c'è solo l'email
  // perché - da requisito - per i pagamenti vale solo l'email.
  name: 'RiferimentiPago',
  components: { BoxErrore, ModalePrivacy },
  props: {
    pEmail: { type: String, required: true },
    pPrivacy: { type: String, required: true }
  },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      clickInvia: false,
      detailError: { message: '', title: '' },
      rifForm: {
        email: this.pEmail,
        privacy: this.pPrivacy
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    rifForm: {
      email: {
        email,
        required
      },
      privacy: { acceptedPrivacy }
    }
  },
  computed: {
    privacyErrors () {
      const errors = []
      if (!this.$v.rifForm.privacy.$error) return errors
      !this.$v.rifForm.privacy.acceptedPrivacy && errors.push('')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.rifForm.email.$dirty) return errors
      !this.$v.rifForm.email.required && errors.push('L\'indirizzo e-mail è obbligatorio.')
      !this.$v.rifForm.email.email && errors.push('Digitare un indirizzo e-mail corretto.')
      return errors
    }
  },
  methods: {
    iniziaValidazione () {
      this.clickInvia = true
    },

    getEmailPrivacy () {
      return { email: this.rifForm.email, privacy: this.rifForm.privacy }
    }
  },
  async created () {
    if (!this.canaleEmailAttivo) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: 'Impossibile proseguire, il canale di comunicazione Email è disabilitato.'
      }
      this.$emit('bloccapagamento')
    }
  }
}
</script>
