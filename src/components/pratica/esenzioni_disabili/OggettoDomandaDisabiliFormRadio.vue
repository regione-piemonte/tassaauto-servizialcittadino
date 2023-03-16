<template>
  <div class="space-section">
    <h2>
      {{
        $t("pratica.esenzioni_disabili.oggetto_della_domanda.oggettoDomanda")
      }}
    </h2>
    <v-radio-group
      v-model="domandaDisabiliForm.disabiliOggettoDomandaRadio"
      :error-count="1"
      :error-messages="disabiliOggettoDomandaRadioErrors"
      name="disabiliOggettoDomandaRadio"
      id="disabiliOggettoDomandaForm"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="primaRichiesta">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.oggetto_della_domanda.select_a'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
          </div>
          <div class="container pl-9">
            <div class="row">
              <div class="col-md-6" v-if="domandaDisabiliForm.disabiliOggettoDomandaRadio === 'primaRichiesta'">
                <v-select
                  v-model="domandaDisabiliForm.selezionaVeicoloPR"
                  :error-messages="selezionaVeicoloPRErrors"
                  id="selezionaVeicoloPR"
                  :items="esenzioniVeicoli"
                  label="Seleziona il veicolo"
                  :error-count="1"
                  :disabled="
                    domandaDisabiliForm.disabiliOggettoDomandaRadio !=
                    'primaRichiesta'
                  "
                  :value="esenzioniVeicoli.value"
                  @input="setSelectedPR"
                ></v-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="trasferimentoEsenzione">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.oggetto_della_domanda.select_b'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
          </div>
          <template v-if="domandaDisabiliForm.disabiliOggettoDomandaRadio === 'trasferimentoEsenzione'">
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
                <p
                  v-html="
                    $t('pratica.esenzioni_disabili.oggetto_della_domanda.intro_b')
                  "
                />
              </v-col>
            </v-row>
          </v-alert>
          <div class="container pl-9">
            <div class="row">
              <div class="col-12">
                <strong class="fix-align">
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.oggetto_della_domanda.targa_esentato'
                      )
                    "
                  ></div>
                </strong>
              </div>
              <div class="col-md-6">
                <v-text-field
                  v-model="domandaDisabiliForm.targaEsentato"
                  :error-messages="targaErrors"
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Inserisci targa"
                  type="text"
                  id="targaEsentato"
                  autocomplete="off"
                  :error-count="4"
                  :disabled="
                    domandaDisabiliForm.disabiliOggettoDomandaRadio !=
                    'trasferimentoEsenzione'
                  "
                ></v-text-field>
                <strong class="fix-align">
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.oggetto_della_domanda.targa_esentare'
                      )
                    "
                  ></div>
                </strong>
                <v-select
                  v-model="domandaDisabiliForm.selezionaVeicoloTE"
                  :error-messages="selezionaVeicoloTEErrors"
                  id="selezionaVeicoloTE"
                  :items="esenzioniVeicoli"
                  label="Seleziona il veicolo"
                  :error-count="1"
                  :disabled="
                    domandaDisabiliForm.disabiliOggettoDomandaRadio !=
                    'trasferimentoEsenzione'
                  "
                  :value="esenzioniVeicoli.value"
                  @input="setSelectedTE"
                ></v-select>
              </div>
            </div>

          </div>
          </template>
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
                <p
                  v-html="
                    $t('pratica.esenzioni_disabili.oggetto_della_domanda.intro')
                  "
                />
              </v-col>
            </v-row>
          </v-alert>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, alphaNum } from 'vuelidate/lib/validators'
import { ESENZIONI_DISABILI_VEICOLI } from '@/store/actions.type'
const OG = store.getters.oggettoDomanda
export default {
  name: 'OggettoDomandaDisabiliFormRadio',
  data () {
    return {
      domandaDisabiliForm: {
        disabiliOggettoDomandaRadio: OG.valueName,
        selezionaVeicoloPR: OG.primaRichiestaEsenzione.veicolo,
        selezionaVeicoloTE: OG.trasferimentoEsenzione.veicolo,
        targaEsentato: OG.trasferimentoEsenzione.targa
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    domandaDisabiliForm: {
      disabiliOggettoDomandaRadio: { required },
      selezionaVeicoloPR: {
        required: requiredIf(function () { return this.domandaDisabiliForm.disabiliOggettoDomandaRadio === 'primaRichiesta' })
      },
      selezionaVeicoloTE: {
        required: requiredIf(function () { return this.domandaDisabiliForm.disabiliOggettoDomandaRadio === 'trasferimentoEsenzione' })
      },
      targaEsentato: {
        required: requiredIf(function () { return this.domandaDisabiliForm.disabiliOggettoDomandaRadio === 'trasferimentoEsenzione' }),
        alphaNum
      }
    }
  },
  computed: {
    ...mapGetters([
      'esenzioniDisabili',
      'esenzioniDisabiliAllegati',
      'esenzioniVeicoli',
      'oggettoDomanda',
      'userIdentity'
    ]),
    disabiliOggettoDomandaRadioErrors () {
      const errors = []
      if (!this.$v.domandaDisabiliForm.disabiliOggettoDomandaRadio.$dirty) return errors
      !this.$v.domandaDisabiliForm.disabiliOggettoDomandaRadio.required && errors.push('Specificare oggetto della domanda.')
      return errors
    },
    selezionaVeicoloTEErrors () {
      const errors = []
      if (!this.$v.domandaDisabiliForm.selezionaVeicoloTE.$dirty && !this.$v.domandaDisabiliForm.selezionaVeicoloTE !== null) return errors
      if (this.esenzioniVeicoli.length === 1) {
        errors.push('Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione')
        return errors
      }
      !this.$v.domandaDisabiliForm.selezionaVeicoloTE.required && errors.push('Seleziona il veicolo.')
      return errors
    },
    selezionaVeicoloPRErrors () {
      const errors = []
      if (!this.$v.domandaDisabiliForm.selezionaVeicoloPR.$dirty && !this.$v.domandaDisabiliForm.selezionaVeicoloPR !== null) return errors
      if (this.esenzioniVeicoli.length === 1) {
        errors.push('Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione')
        return errors
      }
      !this.$v.domandaDisabiliForm.selezionaVeicoloPR.required && errors.push('Seleziona il veicolo.')
      return errors
    },
    targaErrors () {
      const errors = []
      if (this.domandaDisabiliForm.disabiliOggettoDomandaRadio === 'trasferimentoEsenzione' && !this.$v.domandaDisabiliForm.targaEsentato.$dirty) return errors
      !this.$v.domandaDisabiliForm.targaEsentato.required && errors.push('La Targa/Telaio è obbligatoria/o.')
      // !this.$v.domandaDisabiliForm.targaEsentato.maxLength && errors.push('La Targa/Telaio deve avere una lunghezza massima di ' + this.$v.domandaDisabiliForm.targaEsentato.$params.maxLength.max + ' caratteri.')
      !this.$v.domandaDisabiliForm.targaEsentato.alphaNum && errors.push('La Targa/Telaio deve contenere solo lettere e numeri.')
      return errors
    }
  },
  methods: {
    setSelectedTE (event) {
      if (event === null && this.esenzioniVeicoli.length === 1) {
        // Scommenate se si desidere inserire anche la gestione mediante msg box
        /*
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione'
        })
        */
      }
    },
    setSelectedPR (event) {
      if (event === null && this.esenzioniVeicoli.length === 1) {
        // Scommetare se si desidere inserie anche la gestione mediante msg box
        /*
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione'
        })
        */
      }
    },
    checkVeicoli () {
      if (this.esenzioniVeicoli.length <= 1) {
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: 'Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione'
        })
      }
    }
  },
  async created () {
    store
      .dispatch(ESENZIONI_DISABILI_VEICOLI, this.userIdentity.cf)
      .catch((error) => {
        if (error === null || error.response.status === 500 || error.response.status === 404) {
          this.$emit('updateboxerr', {
            title: this.$i18n.t('general.api.errors.no_results'),
            message: this.$i18n.t('Non sono presenti veicoli aventi le caratteristiche tecniche idonee per richiedere l\'esenzione')
          })
        }
      })
  }
}
</script>
