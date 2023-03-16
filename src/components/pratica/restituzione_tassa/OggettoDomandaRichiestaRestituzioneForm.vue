<template>
  <div class="space-section">
    <h2>Oggetto della domanda</h2>
    Indicare il tipo di restituzione richiesta:
    <v-radio-group
      v-model="oggDomRestituzioneForm.oggDomRestituzioneRadio"
      :error-count="1"
      :error-messages="oggDomRestituzioneRadioErrors"
      name="oggDomRestituzioneRadio"
      id="oggDomRestituzioneForm"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="doppioPagamento">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.ogg_dom_restituzione.select_a_all'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <v-radio value="pagamentoEccessivo">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.ogg_dom_restituzione.select_b_all'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <div class="container">
              <v-radio-group
                v-model="oggDomRestituzioneForm.radioPagamentoEccessivo"
                :disabled="
                  oggDomRestituzioneForm.oggDomRestituzioneRadio !=
                  'pagamentoEccessivo'
                "
                :error-messages="pagamentoEccessivoErrors"
              >
                <v-radio value="erroreMateriale" id="erroreMateriale">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.ogg_dom_restituzione.select_b1'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio value="targaErrata" id="targaErrata">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.ogg_dom_restituzione.select_b2'
                          )
                        "
                      ></div>
                    </strong>
                  </template> </v-radio
                >Indicare la targa
                <v-text-field
                  v-model="oggDomRestituzioneForm.targaErrataInput"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Inserisci targa"
                  type="text"
                  id="targaErrataInput"
                  autocomplete="off"
                  :error-count="4"
                  :error-messages="targaErrors"
                  :disabled="
                    oggDomRestituzioneForm.radioPagamentoEccessivo !=
                    'targaErrata'
                  "
                ></v-text-field>
              </v-radio-group>
            </div>
            <v-radio value="pagamentoNonDovuto" id="pagamentoNonDovuto">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.ogg_dom_restituzione.select_c_edit'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <div class="container">
              <v-textarea
                v-model="oggDomRestituzioneForm.pagamentoNonDovutoInput"
                :error-messages="textareaErrors"
                clearable
                clear-icon="mdi-close-circle"
                label="Obbligatorio: specificare il motivo"
                id="pagamentoNonDovutoInput"
                autocomplete="off"
                :error-count="3"
                type="text"
                :disabled="
                  oggDomRestituzioneForm.oggDomRestituzioneRadio !=
                  'pagamentoNonDovuto'
                "
              ></v-textarea>
            </div>
            <v-radio value="perditaDiPossesso">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.ogg_dom_restituzione.select_d'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <div class="container">
              <v-radio-group
                v-model="oggDomRestituzioneForm.radioPerditaDiPossesso"
                :disabled="
                  oggDomRestituzioneForm.oggDomRestituzioneRadio !=
                  'perditaDiPossesso'
                "
                :error-messages="perditaDiPossessoErrors"
              >
                <v-radio value="restituzionePeriodo" id="restituzionePeriodo">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.ogg_dom_restituzione.select_d1'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="restituzioneDifferenza"
                  id="restituzioneDifferenza"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.restituzione_tassa.ogg_dom_restituzione.select_d2'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
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
import { required, requiredIf } from 'vuelidate/lib/validators'
const ODR = store.getters.oggettoDomandaRestituzione
export default {
  name: 'OggettoDomandaRestituzioneFormRadio',
  data () {
    return {
      oggDomRestituzioneForm: {
        oggDomRestituzioneRadio:
          ODR.doppioPagamento
            ? 'doppioPagamento'
            : ODR.pagamentoEccessivo.checked
              ? 'pagamentoEccessivo'
              : ODR.pagamentoNonDovuto.checked
                ? 'pagamentoNonDovuto'
                : ODR.perditaDiPossesso.checked ? 'perditaDiPossesso' : null,
        radioPagamentoEccessivo:
          ODR.pagamentoEccessivo.erroreMateriale
            ? 'erroreMateriale'
            : ODR.pagamentoEccessivo.targaErrata ? 'targaErrata' : null,
        radioPerditaDiPossesso:
          ODR.perditaDiPossesso.restituzionePeriodo
            ? 'restituzionePeriodo'
            : ODR.perditaDiPossesso.restituzioneDifferenza ? 'restituzioneDifferenza' : null,
        pagamentoNonDovutoInput: ODR.pagamentoNonDovuto.motivo,
        targaErrataInput: ODR.pagamentoEccessivo.targa
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    oggDomRestituzioneForm: {
      oggDomRestituzioneRadio: { required },
      radioPagamentoEccessivo: {
        required: requiredIf(function () { return this.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'pagamentoEccessivo' })
      },
      radioPagamentoNonDovuto: {
        required: requiredIf(function () { return this.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'radioPagamentoNonDovuto' })
      },
      radioPerditaDiPossesso: {
        required: requiredIf(function () { return this.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'radioPerditaDiPossesso' })
      },
      targaErrataInput: {
        required: requiredIf(function () { return this.oggDomRestituzioneForm.radioPagamentoEccessivo === 'targaErrata' && this.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'pagamentoEccessivo' })
      },
      pagamentoNonDovutoInput: {
        required: requiredIf(function () { return this.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'pagamentoNonDovuto' })
      }
    }
  },
  computed: {
    ...mapGetters([
      'oggettoDomandaRestituzione'
    ]),
    oggDomRestituzioneRadioErrors () {
      const errors = []
      if (!this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio.$dirty) return errors
      !this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio.required && errors.push('Specificare oggetto domanda')
      return errors
    },
    pagamentoEccessivoErrors () {
      const errors = []
      if (this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio !== 'pagamentoEccessivo' && !this.$v.oggDomRestituzioneForm.radioPagamentoEccessivo.$dirty) return errors
      !this.$v.oggDomRestituzioneForm.radioPagamentoEccessivo.required && errors.push('Specificare pagamento eccessivo.')
      return errors
    },
    textareaErrors () {
      const errors = []
      if (!this.$v.oggDomRestituzioneForm.pagamentoNonDovutoInput.$dirty && this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio === 'pagamentoNonDovuto') return errors
      !this.$v.oggDomRestituzioneForm.pagamentoNonDovutoInput.required && errors.push('Specificare il motivo.')
      return errors
    },
    targaErrors () {
      const errors = []
      if (!this.$v.oggDomRestituzioneForm.targaErrataInput.$dirty) return errors
      !this.$v.oggDomRestituzioneForm.targaErrataInput.required && errors.push('Specificare la targa.')
      return errors
    },
    pagamentoNonDovutoErrors () {
      const errors = []
      if (!this.$v.oggDomRestituzioneForm.radioPagamentoNonDovuto.$dirty && this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio !== 'pagamentoNonDovuto') return errors
      !this.$v.oggDomRestituzioneForm.radioPagamentoNonDovuto.required && errors.push('Specificare pagamento non dovuto.')
      return errors
    },
    perditaDiPossessoErrors () {
      const errors = []
      if (!this.$v.oggDomRestituzioneForm.radioPerditaDiPossesso.$dirty && this.$v.oggDomRestituzioneForm.oggDomRestituzioneRadio !== 'perditaDiPossesso') return errors
      !this.$v.oggDomRestituzioneForm.radioPerditaDiPossesso.required && errors.push('Specificare perdita possesso.')
      return errors
    }

  },
  methods: {
  }
}
</script>
