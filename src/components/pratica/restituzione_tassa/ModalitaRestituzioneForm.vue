<template>
  <div class="space-section">
    <h2>Modalità di restituzione</h2>
    <v-radio-group
      v-model="modalitaRestituzioneForm.modalitaRestituzioneRadio"
      :error-count="1"
      :error-messages="modalitaRestituzioneRadioErrors"
      name="modalitaRestituzioneRadio"
      id="modalitaRestituzioneRadio"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="accreditoCc">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.modalita_restituzione.chiedo_restituzione_cc'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <v-alert
              class="mt-5"
              show
              aria-live="off"
              type="info"
              border="left"
              :icon="false"
            >
              <v-row class="pl-6 pl-md-12">
                <v-col cols="12" md="1">
                  <v-img
                    width="40"
                    :src="require(`@/assets/images/icone/alert/info.svg`)"
                    :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
                  />
                </v-col>
                <v-col cols="12" md="10" class="bodyAlertDark">
                  <p  v-html="
                      $t(
                        'pratica.restituzione_tassa.modalita_restituzione.info1'
                      )
                    ">
                  </p>
                </v-col>
              </v-row>
            </v-alert>
            <template>
              <strong class="fix-align">
                <div>IBAN</div>
              </strong>
            </template>
            <v-text-field
              v-model="modalitaRestituzioneForm.iban"
              :error-messages="ibanErrors"
              :maxLength="
                $v.modalitaRestituzioneForm.iban.$params.maxLength.max
              "
              clearable
              clear-icon="mdi-close-circle"
              label="Inserisci IBAN"
              type="text"
              id="iban"
              autocomplete="off"
              :error-count="4"
              :disabled="
                modalitaRestituzioneForm.modalitaRestituzioneRadio !=
                'accreditoCc'
              "
            ></v-text-field>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="compensazione">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.modalita_restituzione.chiedo_restituzione_compensazione'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <v-alert
              class="mt-5"
              show
              aria-live="off"
              type="info"
              border="left"
              :icon="false"
            >
              <v-row class="pl-6 pl-md-12">
                <v-col cols="12" md="1">
                  <v-img
                    width="40"
                    :src="require(`@/assets/images/icone/alert/info.svg`)"
                    :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
                  />
                </v-col>
                <v-col cols="12" md="10" class="bodyAlertDark">
                  <p  v-html="
                      $t(
                        'pratica.restituzione_tassa.modalita_restituzione.info2'
                      )
                    ">
                  </p>
                </v-col>
              </v-row>
            </v-alert>
            <div class="container">
              <v-radio-group
                v-model="modalitaRestituzioneForm.radioCompensazione"
                :disabled="
                  modalitaRestituzioneForm.modalitaRestituzioneRadio !=
                  'compensazione'
                "
                :error-count="1"
                :error-messages="compensazioneErrors"
                name="radioCompensazione"
                id="radioCompensazione"
              >
                <v-radio value="miaProprieta" id="miaProprieta">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.modalita_restituzione.mia_proprieta'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio value="altroSoggetto" id="altroSoggetto">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.modalita_restituzione.altro_soggetto'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="col-12">
            <strong>
              <div>Codice Fiscale (CF)*</div>
            </strong>
            <v-text-field
              v-model="modalitaRestituzioneForm.codiceFiscale"
              :error-messages="cfErrors"
              :maxLength="
                $v.modalitaRestituzioneForm.codiceFiscale.$params.maxLength.max
              "
              clearable
              class="uppercase-input"
              clear-icon="mdi-close-circle"
              label="Inserisci CF"
              id="codiceFiscale"
              autocomplete="off"
              :error-count="3"
              :disabled="
                modalitaRestituzioneForm.radioCompensazione != 'altroSoggetto'
              "
            ></v-text-field>
          </div>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, alphaNum, maxLength, minLength } from 'vuelidate/lib/validators'
import { COD_FISCALE_MAX_LENGTH, COD_FISCALE_MIN_LENGTH, IBAN_MAX_LENGTH, IBAN_MIN_LENGTH } from '@/common/config'
const MR = store.getters.modalitaRestituzione
export default {
  name: 'ModalitaRestituzioneFormRadio',
  data () {
    return {
      modalitaRestituzioneForm: {
        modalitaRestituzioneRadio:
          MR.accreditoCc.checked
            ? 'accreditoCc'
            : MR.compensazione.checked ? 'compensazione' : null,
        radioCompensazione: MR.compensazione.miaProprieta
          ? 'miaProprieta'
          : MR.compensazione.altroSoggetto ? 'altroSoggetto' : null,
        iban: MR.accreditoCc.iban,
        codiceFiscale: MR.compensazione.codiceFiscale
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    modalitaRestituzioneForm: {
      modalitaRestituzioneRadio: { required },
      radioCompensazione: {
        required: requiredIf(function () { return this.modalitaRestituzioneForm.modalitaRestituzioneRadio === 'compensazione' })
      },
      codiceFiscale: {
        required: requiredIf(function () { return this.modalitaRestituzioneForm.radioCompensazione === 'altroSoggetto' }),
        alphaNum,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH)
      },
      iban: {
        required: requiredIf(function () { return this.modalitaRestituzioneForm.modalitaRestituzioneRadio === 'accreditoCc' }),
        minLength: minLength(IBAN_MIN_LENGTH),
        maxLength: maxLength(IBAN_MAX_LENGTH),
        alphaNum,
        ibanOk: function () {
          return this.validIban(this.modalitaRestituzioneForm.iban)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'modalitaRestituzione',
      'userIdentity'
    ]),
    modalitaRestituzioneRadioErrors () {
      const errors = []
      if (!this.$v.modalitaRestituzioneForm.modalitaRestituzioneRadio.$dirty) return errors
      !this.$v.modalitaRestituzioneForm.modalitaRestituzioneRadio.required && errors.push('Specificare modalità di restituzione.')
      return errors
    },
    compensazioneErrors () {
      const errors = []
      if (!this.$v.modalitaRestituzioneForm.radioCompensazione.$dirty) return errors
      !this.$v.modalitaRestituzioneForm.radioCompensazione.required && errors.push('Specificare compensazione.')
      return errors
    },
    accreditoCcErrors () {
      const errors = []
      if (!this.$v.modalitaRestituzioneForm.accreditoCc.$dirty || !this.$v.modalitaRestituzioneForm.accreditoCc.$dirty) return errors
      !this.$v.modalitaRestituzioneForm.accreditoCc.required && errors.push('Seleziona il veicolo.')
      return errors
    },
    ibanErrors () {
      const errors = []
      if (this.modalitaRestituzioneForm.modalitaRestituzioneRadio === 'accreditoCc' && !this.$v.modalitaRestituzioneForm.iban.$dirty) return errors
      !this.$v.modalitaRestituzioneForm.iban.required && errors.push('L\'IBAN è obbligatorio.')
      !this.$v.modalitaRestituzioneForm.iban.maxLength && errors.push('L\'IBAN deve avere una lunghezza massima di ' + this.$v.modalitaRestituzioneForm.iban.$params.maxLength.max + ' caratteri.')
      !this.$v.modalitaRestituzioneForm.iban.alphaNum && errors.push('L\'IBAN deve contenere solo lettere e numeri e non ci devono essere spazi vuoti.')
      !this.$v.modalitaRestituzioneForm.iban.ibanOk && errors.push('L\'IBAN non è formalmente corretto.')
      return errors
    },
    cfErrors () {
      const errors = []
      if (!this.$v.modalitaRestituzioneForm.codiceFiscale.$dirty) return errors
      !this.$v.modalitaRestituzioneForm.codiceFiscale.required && errors.push('Il Codice fiscale / P.IVA è obbligatorio.')
      !this.$v.modalitaRestituzioneForm.codiceFiscale.minLength && errors.push('Il Codice fiscale / P.IVA deve avere una lunghezza minima di ' + this.$v.modalitaRestituzioneForm.codiceFiscale.$params.minLength.min + ' caratteri.')
      !this.$v.modalitaRestituzioneForm.codiceFiscale.alphaNum && errors.push('Il Codice fiscale / P.IVA deve contenere solo lettere e numeri.')
      return errors
    }
  },
  methods: {
    validIban (inpIban) {
      if (this.modalitaRestituzioneForm.modalitaRestituzioneRadio !== 'accreditoCc') return true
      const IBAN = require('iban')
      return IBAN.isValid(inpIban)
    }
  }
}
</script>
