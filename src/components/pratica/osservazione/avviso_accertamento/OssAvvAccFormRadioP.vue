<template>
  <div class="space-section mt-2">
    <v-radio-group
      v-model="ossAvvAccForm.osservazRadio"
      id="formRadio-pagato"
      column
      :error-messages="osservazRadioErrors">
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              class="formRadioPagato"
              name="osservazRadio"
              value="pagamentiCorretti">
              <template v-slot:label>
                <strong class="fix-align">
                  I pagamenti sono corretti
                </strong>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              class="formRadioPagato"
              name="osservazRadio"
              value="targaErrata">
              <template v-slot:label>
                <strong class="fix-align">
                  Ho indicato la targa in modo errato
                </strong>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              class="formRadioPagato"
              value="scadenzaErrata">
              <template v-slot:label>
                <div>
                  <strong class="fix-align w-100">
                    Ho indicato una scadenza errata
                  </strong>
                  <br/>
                  <small>
                    Se si è indicata una data dell'anno precedente o successivo a quello per cui si contesta il mancato pagamento,
                    allegare copia di entrambe le ricevute.
                  </small>
                </div>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              class="formRadioPagato"
              value="veicoloRitargato">
              <template v-slot:label>
                <div>
                  <strong class="fix-align w-100">
                    Il veicolo è stato ritargato
                  </strong>
                  <small>
                    Allegare una copia di circolazione.
                  </small>
                </div>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              class="formRadioPagato"
              value="pagamentoAltraRegioneProvincia">
              <template v-slot:label>
                <strong class="fix-align">
                  Ho pagato a favore di altra Regione o Provincia autonoma
                </strong>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
    </v-radio-group>
    <h2 class="mt-9">
      Inserire gli estremi di pagamento
    </h2>
      <div class="row">
        <div class="col-12 col-md-6 col-xl-4">
          <fieldset :disabled="ossAvvAccForm.osservazRadio !== '' ? false : true">
            <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="N° Quietanza"
            id="numeroQuietanza"
            v-model="grigliaAccertamentoPagato.numeroQuietanza"
            type="text"
            :error-messages="numeroQuietanzaErrors"
            autocomplete="off"
            :error-count="1"
            ></v-text-field>
            <div
              id="dataPagamentoGroup">
              <v-menu
                v-model="dataPagamentoPicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dataPagamentoFormatted"
                    id="dataPagamento"
                    label="Data del pagamento"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataPagamentoErrors"
                    :error-count="2"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="grigliaAccertamentoPagato.dataPagamento" @input="dataPagamentoPicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
            <v-text-field
              clearable
              clear-icon="mdi-close-circle"
              label="Ufficio Accettante"
              id="ufficioAccettante"
              v-model="grigliaAccertamentoPagato.ufficioAccettante"
              type="text"
              :error-messages="ufficioAccettanteErrors"
              autocomplete="off"
              :error-count="1"
            ></v-text-field>
          </fieldset>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OsservazioneService from '@/common/osservazione.service'
import { OSS_AVV_ACC_SALVA_GRIGLIA_PAG } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'

export default {
  name: 'OssAvvAccFormRadioP',
  data () {
    return {
      ossAvvAccForm: {
        osservazRadio: {}
      },
      date: null,
      dataPagamentoPicker: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    ossAvvAccForm: {
      osservazRadio: { required }
    },
    grigliaAccertamentoPagato: {
      numeroQuietanza: {
        required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio !== '' })
      },
      dataPagamento: {
        notFutureDate,
        required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio !== '' })
      },
      ufficioAccettante: {
        required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio !== '' })
      }
    }
  },
  computed: {
    ...mapGetters([
      'grigliaAccertamentoPagato'
    ]),
    osservazRadioErrors () {
      const errors = []
      if (!this.$v.ossAvvAccForm.osservazRadio.$dirty) return errors
      !this.$v.ossAvvAccForm.osservazRadio.required && errors.push('Specificare il motivo dell\'osservazione.')
      return errors
    },
    numeroQuietanzaErrors () {
      const errors = []
      if (!this.$v.grigliaAccertamentoPagato.numeroQuietanza.$dirty) return errors
      !this.$v.grigliaAccertamentoPagato.numeroQuietanza.required && errors.push('Il Numero di Quietanza è obbligatorio.')
      return errors
    },
    ufficioAccettanteErrors () {
      const errors = []
      if (!this.$v.grigliaAccertamentoPagato.ufficioAccettante.$dirty) return errors
      !this.$v.grigliaAccertamentoPagato.ufficioAccettante.required && errors.push('L\'Ufficio Accettante è obbligatorio.')
      return errors
    },
    dataPagamentoErrors () {
      const errors = []
      if (!this.$v.grigliaAccertamentoPagato.dataPagamento.$dirty) return errors
      !this.$v.grigliaAccertamentoPagato.dataPagamento.required && errors.push('La data del pagamento è obbligatoria.')
      !this.$v.grigliaAccertamentoPagato.dataPagamento.notFutureDate && errors.push('La data del pagamento non può essere futura.')
      return errors
    },
    dataPagamentoFormatted () {
      return this.formatDate(this.grigliaAccertamentoPagato.dataPagamento)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getValidationClass (fieldName) {
      const field = this.$v.grigliaAccertamentoPagato[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    updMotivOssPagato () {
      const radioValue = this.ossAvvAccForm.osservazRadio
      console.log(this.grigliaAccertamentoPagato.dataPagamento + 'this.grigliaAccertamentoPagato.dataPagamento')
      this.grigliaAccertamentoPagato.pagamentiCorretti = (radioValue === 'pagamentiCorretti')
      this.grigliaAccertamentoPagato.targaErrata = (radioValue === 'targaErrata')
      this.grigliaAccertamentoPagato.scadenzaErrata = (radioValue === 'scadenzaErrata')
      this.grigliaAccertamentoPagato.veicoloRitargato = (radioValue === 'veicoloRitargato')
      this.grigliaAccertamentoPagato.pagamentoAltraRegioneProvincia = (radioValue === 'pagamentoAltraRegioneProvincia')
      store.dispatch(OSS_AVV_ACC_SALVA_GRIGLIA_PAG, this.grigliaAccertamentoPagato)
    }
  },
  async created () {
    this.ossAvvAccForm.osservazRadio = await OsservazioneService.motivoOssAvvAccPagato(this.grigliaAccertamentoPagato)
  }
}
</script>
