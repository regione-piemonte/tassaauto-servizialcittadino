<template>
  <div class="space-section" id="riferimentiDomandaModifica">
    <h2>
      {{ $t('general.box_titles.riferimenti') }}
    </h2>
    <BoxSuccesso
      :success="detailSuccess"
    />
    <BoxErrore
      :error="detailError"
    />
    <div v-if="modificaRif">
      <v-form
        @submit.prevent="confermaModifica">
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Indirizzo e-mail"
        id="email"
        v-model="rifForm.email"
        :error-messages="emailErrors"
        autocomplete="off"
        :error-count="3"
        ></v-text-field>
        <v-text-field
          clearable
          type="tel"
          clear-icon="mdi-close-circle"
          label="Numero di telefono mobile"
          id="telefono"
          v-model="rifForm.telefono"
          :error-messages="telefonoErrors"
          :maxLength="$v.rifForm.telefono.$params.maxLength.max"
          autocomplete="off"
          :error-count="5"
          ></v-text-field>
        <div class="action-button-wide">
          <div class="col-lg-6">
            <v-btn
              id="undoBtnMod"
              type="button"
              @click="annullaModifica">
              {{ $t('general.buttons.undo') }}
            </v-btn>
          </div>
          <div class="col-lg-6 text-md-right">
            <v-btn
              type="submit"
              color="primary"
              id="confermaBtnModRiferimenti">
              Conferma
            </v-btn>
          </div>
        </div>
      </v-form>
    </div>
    <div v-else class="row">
      <div class="col-sm-9 mb-5 mb-sm-0"
        v-html="settedRif"
      />
      <div class="col-sm-3 text-md-right">
        <v-btn type="button"
          class="btn-secondary"
          :disabled="modificaBtnDisabled"
          @click="modifica"
          id="modificaBtnRiferimenti">
          Modifica
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CELL_MAX_LENGTH,
  CELL_MIN_LENGTH,
  emailAttiva,
  smsAttivo
} from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxSuccesso from '@/components/BoxSuccesso'
import BoxErrore from '@/components/BoxErrore'
import store from '@/store'
import {
  PRATICA_OSSERVAZIONE_MODIFICA,
  PRATICA_ACCERTAMENTO_MODIFICA,
  PRATICA_RATEIZZAZIONE_MODIFICA,
  PRATICA_DISC_RIMB_MODIFICA
} from '@/store/actions.type'
import { validationMixin } from 'vuelidate'
import { email, minLength, maxLength, numeric, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'RiferimentiPraticaModifica',
  props: {
    actionModifica: { type: String, required: true },
    codiceFiscale: { type: String, required: true },
    idComunicazione: { type: Number, required: true },
    protocollo: { type: String, required: false },
    numeroIdentificativo: { type: String, required: false },
    targa: { type: String, required: false },
    statoOsservazione: { type: String, required: false },
    tipoVeicolo: { type: String, required: false },
    propEmail: { type: String, required: false },
    propTelefono: { type: String, required: false }
  },
  components: { BoxSuccesso, BoxErrore },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo(),
      detailError: { message: '', title: '' },
      detailSuccess: { message: '', title: '' },
      modificaBtnDisabled: false,
      modificaRif: false,
      precEmail: this.propEmail,
      precTelefono: this.propTelefono,
      email: this.propEmail,
      telefono: this.propTelefono,
      rifForm: {
        email: this.propEmail,
        telefono: this.propTelefono
      }
    }
  },
  computed: {
    settedRif: function () {
      let valueRif = ''
      if (this.canaleEmailAttivo) {
        valueRif += 'Email: '
        valueRif += this.email !== null ? this.email : ''
      }
      if (valueRif !== '' && this.canaleSmsAttivo) valueRif += '<br>'
      if (this.canaleSmsAttivo) {
        valueRif += 'Numero di cellulare: '
        valueRif += this.telefono !== null ? this.telefono : ''
      }
      return valueRif
    },
    emailErrors () {
      const errors = []
      if (!this.$v.rifForm.email.$dirty) return errors
      !this.$v.rifForm.email.required && errors.push('L\'indirizzo e-mail è obbligatorio.')
      !this.$v.rifForm.email.email && errors.push('Digitare un indirizzo e-mail corretto.')
      if (!this.$v.rifForm.email.atLeastOne) errors.push(this.atLeastOneMsg)
      return errors
    },
    telefonoErrors () {
      const errors = []
      if (!this.$v.rifForm.telefono.$dirty) return errors
      !this.$v.rifForm.telefono.required && errors.push('Il numero di telefono mobile è obbligatorio.')
      !this.$v.rifForm.telefono.numeric && errors.push('Il numero di telefono mobile deve essere composto da soli numeri.')
      !this.$v.rifForm.telefono.minLength && errors.push('Il numero di telefono mobile deve essere composto da almeno ' + this.$v.rifForm.telefono.$params.minLength.min + ' numeri.')
      !this.$v.rifForm.telefono.maxLength && errors.push('Il numero di telefono mobile deve essere composto da massimo' + this.$v.rifForm.telefono.$params.maxLength.max + 'numeri.')
      if (!this.$v.rifForm.telefono.atLeastOne) errors.push(this.atLeastOneMsg)
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
      }
    }
  },
  methods: {
    annullaModifica () {
      this.modificaRif = false
      if (this.canaleEmailAttivo) {
        this.email = this.precEmail
        this.rifForm.email = this.precEmail
      }
      if (this.canaleSmsAttivo) {
        this.telefono = this.precTelefono
        this.rifForm.telefono = this.precTelefono
      }
    },

    modifica () {
      this.modificaRif = true
    },

    confermaModifica () {
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const params = {
        codiceFiscale: this.codiceFiscale,
        idComunicazione: this.idComunicazione
      }

      if (this.canaleEmailAttivo) {
        params.emailPrecedente = this.precEmail
        params.email = this.rifForm.email
      }
      if (this.canaleSmsAttivo) {
        params.cellularePrecedente = this.precTelefono
        params.cellulare = this.rifForm.telefono
      }

      if (this.actionModifica === PRATICA_OSSERVAZIONE_MODIFICA ||
        this.actionModifica === PRATICA_ACCERTAMENTO_MODIFICA) {
        params.numeroIdentificativo = this.numeroIdentificativo
        params.targa = this.targa
        params.statoOsservazione = this.statoOsservazione
        params.tipoVeicolo = this.tipoVeicolo
      } else if (this.actionModifica === PRATICA_RATEIZZAZIONE_MODIFICA) {
        params.protocollo = this.protocollo
      } else if (this.actionModifica === PRATICA_DISC_RIMB_MODIFICA) {
        params.numeroIdentificativo = this.numeroIdentificativo
      }

      store
        .dispatch(this.actionModifica, params)
        .then(() => {
          this.detailSuccess = {
            message: 'I riferimenti della pratica sono stati modificati correttamente.',
            title: 'Modifica completata'
          }
          if (this.canaleEmailAttivo) {
            this.email = this.rifForm.email
            this.precEmail = this.rifForm.email
          }
          if (this.canaleSmsAttivo) {
            this.telefono = this.rifForm.telefono
            this.precTelefono = this.rifForm.telefono
          }
          this.modificaRif = false
        })
        .catch((error) => {
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante la modifica dei riferimenti'
            }
          }
        })
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
        message: 'Impossibile proseguire, i canali di comunicazione Email ed SMS sono disabilitati.'
      }
      this.modificaBtnDisabled = true
    }
  }
}
</script>
