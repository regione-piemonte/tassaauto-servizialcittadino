<template>
  <v-form>
    <div class="space-section mt-12" id="riferimentiPraticaPago">
      <h2 class="mb-12">
        {{ $t("general.box_titles.riferimenti") }}
      </h2>
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2 col-12">
          <BoxErrore :error="detailError" />
        </div>
      </div>
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
              Devi inserire un <strong>indirizzo e-mail</strong> per ottenere la
              <strong>RICEVUTA TELEMATICA</strong> dell'esito positivo del versamento.
            </p>
          </v-col>
        </v-row>
      </v-alert>
      <div class="row" v-if="canaleEmailAttivo">
        <div class="col-lg-5">
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
            @keyup="toLow"
          ></v-text-field>
          <!-- @keyup="toLow" per evitare che la mail venga inserita maiuscola -->
        </div>
      </div>
      <div class="inner-cont-2box info-left row">
        <div class="reset-margin">
          <div class="inline-check-submit no-gutters-col offset-lg-0 col-12">
            <div class="tooltip-field py-md-0 pr-lg-0">
              <div class="position-relative d-inline-block">
                <v-checkbox
                  id="privacy"
                  v-model="rifForm.privacy"
                  @change="$v.rifForm.privacy.$touch()"
                  :error-messages="privacyErrors"
                  :state="!$v.rifForm.privacy.$error"
                  value="accepted"
                  unchecked-value="not_accepted"
                  :label="this.$i18n.t('general.privacy')"
                >
                </v-checkbox>
                <v-btn
                  aria-label="Privacy Policy per i servizi di Tassa Auto"
                  fab
                  depressed
                  class="contextual-info privacy-btn"
                  @click="$refs.mwPrivacy.mostraModalePrivacy()"
                >
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </div>
              <div
                class="error--text"
                v-if="clickInvia && !$v.rifForm.privacy.acceptedPrivacy"
              >
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
    toLow () {
      this.rifForm.email = this.rifForm.email.toLowerCase()
    },
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
