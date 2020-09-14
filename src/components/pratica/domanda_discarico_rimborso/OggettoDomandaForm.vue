<template>
  <div class="space-section mt-2">
    <h2>
      Oggetto della domanda
    </h2>
    <v-radio-group
      v-model="oggDomandaForm.oggDomRadio"
      :error-messages="oggDomandaErrors"
      :error-count="1"
      column
      name="OggettoDomanda">
      <div class="multiple-inline-form-container">
        <v-radio
          @input="delDati()"
          value="discaricoAmministrativo">
          <template v-slot:label>
            <strong id="discaricoAmministrativo">
              Chiedo il discarico amministrativo
            </strong>
          </template>
        </v-radio>
        <v-radio-group
        class="pl-md-9"
        v-model="oggDomandaForm.tipoDiscAmministr"
        :error-count="1"
        :error-messages="tipoDiscAmministrErrors"
        :disabled="oggDomandaForm.oggDomRadio !== 'discaricoAmministrativo'"
        name="OggettoDomandaDiscarico">
          <v-radio
            value="totale"
            >
            <template v-slot:label>
              <strong id="discaricoAmministrativo-totale">
                Totale
              </strong>
            </template>
          </v-radio>
          <v-radio
            value="parziale"
            class="w-100">
            <template v-slot:label>
              <strong id="discaricoAmministrativo">
                Parziale
              </strong>
            </template>
          </v-radio>
        </v-radio-group>
        <v-radio
          value="rimborsoPagamento"
          @input="delDati()">
          <template v-slot:label>
            <div class="row">
              <strong
                class="col-12"
                id="rimborsoPagamento">
                Chiedo il rimborso, avendo già provveduto al pagamento
              </strong>
            </div>
          </template>
        </v-radio>
        <v-alert
        show
        aria-live="off"
        type="info"
        border="left"
        :icon="false">
          <v-row class="pl-6 pl-md-12">
            <v-col cols="12" md="1">
              <v-img
                width="40"
                :src="require(`@/assets/images/icone/alert/info.svg`)"
                :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"/>
            </v-col>
            <v-col cols="12" md="10" class="bodyAlertDark">
              <p>
                <strong>Attenzione</strong>: Dato <strong>obbligatorio</strong><br/>
                è necessario inserire l'IBAN del Conto Corrente su cui deve essere accreditato l'importo da rimborsare.
              </p>
            </v-col>
          </v-row>
        </v-alert>
        <p class="fix-align mr-3">
          IBAN
        </p>
        <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        label="Inserisci IBAN"
        :disabled="oggDomandaForm.oggDomRadio !== 'rimborsoPagamento'"
        id="targa"
        type="text"
        :maxLength="$v.oggDomandaForm.iban.$params.maxLength.max"
        v-model="oggDomandaForm.iban"
        :error-messages="ibanErrors"
        autocomplete="off"
        :error-count="4"
        ></v-text-field>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import { IBAN_MIN_LENGTH, IBAN_MAX_LENGTH } from '@/common/config'
import DomDiscRimbService from '@/common/domanda_discarico_rimborso.service'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'

export default {
  name: 'OggettoDomandaForm',
  props: {
    pOggettoDomanda: { type: Object, required: true }
  },
  data () {
    return {
      oggettoDomanda: this.pOggettoDomanda,
      oggDomandaForm: {
        oggDomRadio: null,
        tipoDiscAmministr: null,
        iban: this.pOggettoDomanda.rimborsoGiaPagato.iban
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    oggDomandaForm: {
      oggDomRadio: {
        required
      },
      tipoDiscAmministr: {
        required: requiredIf(function () {
          return this.oggDomandaForm.oggDomRadio === 'discaricoAmministrativo'
        })
      },
      iban: {
        required: requiredIf(function () {
          return this.oggDomandaForm.oggDomRadio === 'rimborsoPagamento'
        }),
        minLength: minLength(IBAN_MIN_LENGTH),
        maxLength: maxLength(IBAN_MAX_LENGTH),
        alphaNum,
        ibanOk: function () {
          return this.validIban(this.oggDomandaForm.iban)
        }
      }
    }
  },
  computed: {
    oggDomandaErrors () {
      const errors = []
      if (!this.$v.oggDomandaForm.oggDomRadio.$dirty) return errors
      !this.$v.oggDomandaForm.oggDomRadio.required && errors.push('L\'oggetto della domanda è obbligatorio.')
      return errors
    },
    tipoDiscAmministrErrors () {
      const errors = []
      if (!this.$v.oggDomandaForm.tipoDiscAmministr.$dirty && this.$v.oggDomandaForm.oggDomRadio !== 'discaricoAmministrativo') return errors
      !this.$v.oggDomandaForm.tipoDiscAmministr.required && errors.push('Il tipo di discarico amministrativo (annullamento) è obbligatorio.')
      return errors
    },
    ibanErrors () {
      const errors = []
      if (!this.$v.oggDomandaForm.iban.$dirty && this.$v.oggDomandaForm.oggDomRadio !== 'rimborsoPagamento') return errors
      !this.$v.oggDomandaForm.iban.required && errors.push('L\'IBAN è obbligatorio.')
      !this.$v.oggDomandaForm.iban.minLength && errors.push('L\'IBAN deve avere una lunghezza minima di ' + this.$v.oggDomandaForm.iban.$params.minLength.min + ' caratteri.')
      !this.$v.oggDomandaForm.iban.alphaNum && errors.push('L\'IBAN deve contenere solo lettere e numeri.')
      !this.$v.oggDomandaForm.iban.ibanOk && errors.push('L\'IBAN non è formalmente corretto.')
      return errors
    }
  },
  methods: {
    delDati () {
      if (this.oggDomandaForm.oggDomRadio === 'discaricoAmministrativo') this.oggDomandaForm.iban = ''
      if (this.oggDomandaForm.oggDomRadio === 'rimborsoPagamento') this.oggDomandaForm.tipoDiscAmministr = null
    },
    validIban (inpIban) {
      if (this.oggDomandaForm.oggDomRadio !== 'rimborsoPagamento') return true
      const IBAN = require('iban')
      return IBAN.isValid(inpIban)
    },
    updDatiOggDomanda () {
      const newOggDomanda = {
        discaricoAmministrativo: { },
        rimborsoGiaPagato: { }
      }
      const radioValue = this.oggDomandaForm.oggDomRadio
      if (radioValue === 'discaricoAmministrativo') {
        newOggDomanda.discaricoAmministrativo = {
          value: true,
          totale: (this.oggDomandaForm.tipoDiscAmministr === 'totale'),
          parziale: (this.oggDomandaForm.tipoDiscAmministr === 'parziale')
        }
        newOggDomanda.rimborsoGiaPagato = { value: false, iban: null }
      } else if (radioValue === 'rimborsoPagamento') {
        newOggDomanda.discaricoAmministrativo = { value: false, totale: false, parziale: false }
        newOggDomanda.rimborsoGiaPagato = { value: true, iban: this.oggDomandaForm.iban }
      }
      return newOggDomanda
    }
  },
  async created () {
    this.oggDomandaForm.oggDomRadio = await DomDiscRimbService.oggettoDomanda(this.pOggettoDomanda)
    this.oggDomandaForm.tipoDiscAmministr = await DomDiscRimbService.tipoDiscAmministr(this.pOggettoDomanda.discaricoAmministrativo)
  }
}
</script>
