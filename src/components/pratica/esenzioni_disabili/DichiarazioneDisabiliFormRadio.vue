<template>
  <div class="space-section">
    <h2>{{ $t("pratica.esenzioni_disabili.dichiarazione.dichiarazione") }}</h2>
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
              $t('pratica.esenzioni_disabili.dichiarazione.il_sottoscritto')
            "
          />
        </v-col>
      </v-row>
    </v-alert>
    <v-radio-group
      v-model="dichiarazioneDisabiliForm.disabiliDichiarazioneRadio"
      @change="resetSelectB()"
      :error-count="1"
      :error-messages="disabiliDichiarazioneRadioErrors"
      name="disabiliDichiarazioneRadio"
      id="disabiliDichiarazioneForm"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="proprietarioDisabile">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t('pratica.esenzioni_disabili.dichiarazione.select_a')
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <div class="container">
              <v-radio-group
                v-model="dichiarazioneDisabiliForm.radioProprietario"
                v-if="
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                  'proprietarioDisabile'
                "
                :error-messages="proprietarioDisabileErrors"
              >
                <v-radio
                  value="riconosciutoPersonaDisabile"
                  id="riconosciutoPersonaDisabile"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_aa'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="personaDisabilitaPsichicaMentale"
                  id="personaDisabilitaPsichicaMentale"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_ab'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="personaVedenteIpovedente"
                  id="personaVedenteIpovedente"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_ac'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="invalidoRidotteImpediteCapacitaMotorie"
                  id="invalidoRidotteImpediteCapacitaMotorie"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_ad'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
            <v-radio value="disabileFamiliare">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t('pratica.esenzioni_disabili.dichiarazione.select_b')
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <v-radio value="disabileComproprietario">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t('pratica.esenzioni_disabili.dichiarazione.select_b1')
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <div class="container">
              <v-radio-group
                v-model="dichiarazioneDisabiliForm.radioDisabileFamiliare"
                v-if="
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                    'disabileFamiliare' ||
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                    'disabileComproprietario'
                "
                :error-messages="disabileFamiliareErrors"
              >
                <v-radio value="disabilitaGrave" id="disabilitaGrave">
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_ba'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="disabilitaPsichicaMentale"
                  id="disabilitaPsichicaMentale"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_bb'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="disabilitaNonVedenteIpovedente"
                  id="disabilitaNonVedenteIpovedente"
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_bc'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
                <v-radio
                  value="comproprietario"
                  id="comproprietario"
                  v-if="
                    dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                    'disabileComproprietario'
                  "
                >
                  <template v-slot:label>
                    <strong>
                      <div
                        v-html="
                          $t(
                            'pratica.esenzioni_disabili.dichiarazione.select_bd'
                          )
                        "
                      ></div>
                    </strong>
                  </template>
                </v-radio>
              </v-radio-group>
              <div
                class="col-md-6"
                v-if="
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                    'disabileFamiliare' ||
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                    'disabileComproprietario'
                "
              >
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.dichiarazione.relazione_parentela'
                      )
                    "
                  ></div>
                </strong>
                <v-select
                  v-model="dichiarazioneDisabiliForm.selezionaParentela"
                  id="selezionaParentela"
                  :items="gradiParentela"
                  label="Seleziona parentela"
                  v-if="
                    dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                      'disabileFamiliare' ||
                    dichiarazioneDisabiliForm.disabiliDichiarazioneRadio ===
                      'disabileComproprietario'
                  "
                ></v-select>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.esenzioni_disabili.dichiarazione.CF_familiare'
                      )
                    "
                  ></div>
                </strong>
                <v-text-field
                  :error-messages="cfFamiliareErrors"
                  autocomplete="off"
                  clear-icon="mdi-close-circle"
                  clearable
                  class="uppercase-input"
                  id="cfFamiliare"
                  label="Obbligatorio: Inserisci CF"
                  v-model="dichiarazioneDisabiliForm.cfFamiliare"
                  :maxlength="
                    $v.dichiarazioneDisabiliForm.cfFamiliare.$params.maxLength
                      .max
                  "
                  :error-count="3"
                ></v-text-field>
              </div>
              <p v-if="
                  dichiarazioneDisabiliForm.disabiliDichiarazioneRadio
                "
                v-html="$t('pratica.esenzioni_disabili.dichiarazione.nota_bc')"
              ></p>
            </div>
          </div>
        </div>
      </div>
    </v-radio-group>
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
          <p>
            {{ $t("pratica.esenzioni_disabili.dichiarazione.regione_alert") }}
          </p>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, alphaNum, maxLength, minLength } from 'vuelidate/lib/validators'
import { COMMON_GRADI_PARENTELA } from '@/store/actions.type'
import {
  COD_FISCALE_MAX_LENGTH,
  COD_FISCALE_MIN_LENGTH
} from '@/common/config'
const DIC = store.getters.dichiarazione
export default {
  name: 'DichiarazioneDisabiliFormRadio',
  data () {
    return {
      dichiarazioneDisabiliForm: {
        disabiliDichiarazioneRadio:
          DIC.proprietarioDisabile.checked
            ? 'proprietarioDisabile'
            : DIC.disabileFamiliare.checked
              ? 'disabileFamiliare'
              : DIC.disabileComproprietario.checked
                ? 'disabileComproprietario'
                : null,
        radioProprietario:
          DIC.proprietarioDisabile.riconosciutoPersonaDisabile
            ? 'riconosciutoPersonaDisabile'
            : DIC.proprietarioDisabile.personaDisabilitaPsichicaMentale
              ? 'personaDisabilitaPsichicaMentale'
              : DIC.proprietarioDisabile.personaVedenteIpovedente
                ? 'personaVedenteIpovedente'
                : DIC.proprietarioDisabile.invalidoRidotteImpediteCapacitaMotorie ? 'invalidoRidotteImpediteCapacitaMotorie' : null,
        radioDisabileFamiliare:
          DIC.disabileFamiliare.disabilitaGrave
            ? 'disabilitaGrave'
            : DIC.disabileFamiliare.disabilitaPsichicaMentale
              ? 'disabilitaPsichicaMentale'
              : DIC.disabileFamiliare.disabilitaNonVedenteIpovedente
                ? 'disabilitaNonVedenteIpovedente'
                : DIC.disabileFamiliare.disabilitaGrave
                  ? 'disabilitaGrave'
                  : DIC.disabileComproprietario.disabilitaPsichicaMentale
                    ? 'disabilitaPsichicaMentale'
                    : DIC.disabileComproprietario.disabilitaNonVedenteIpovedente
                      ? 'disabilitaNonVedenteIpovedente'
                      : DIC.disabileComproprietario.comproprietario
                        ? 'comproprietario'
                        : null,
        selezionaParentela:
          DIC.disabileFamiliare.parentela
            ? DIC.disabileFamiliare.parentela
            : DIC.disabileComproprietario.parentela,
        cfFamiliare:
          DIC.disabileFamiliare.cfFamiliare
            ? DIC.disabileFamiliare.cfFamiliare
            : DIC.disabileComproprietario.cfFamiliare
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    dichiarazioneDisabiliForm: {
      disabiliDichiarazioneRadio: { required },
      radioProprietario: {
        required: requiredIf(function () { return this.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio === 'proprietarioDisabile' })
      },
      cfFamiliare: {
        required: requiredIf(function () { return this.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio !== 'proprietarioDisabile' }),
        alphaNum,
        minLength: minLength(COD_FISCALE_MIN_LENGTH),
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH)
      },
      selezionaParentela: {
        required: false
      },
      radioDisabileFamiliare: {
        required: requiredIf(function () { return this.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio === 'disabileFamiliare' || this.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio === 'disabileComproprietario' })
      }
    }
  },
  computed: {
    ...mapGetters([
      'esenzioniDisabili',
      'esenzioniDisabiliAllegati',
      'gradiParentela',
      'dichiarazione'
    ]),
    disabiliDichiarazioneRadioErrors () {
      const errors = []
      if (!this.$v.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio.$dirty) return errors
      !this.$v.dichiarazioneDisabiliForm.disabiliDichiarazioneRadio.required && errors.push('Specificare dichiarazione.')
      return errors
    },
    proprietarioDisabileErrors () {
      const errors = []
      if (!this.$v.dichiarazioneDisabiliForm.radioProprietario.$dirty) return errors
      !this.$v.dichiarazioneDisabiliForm.radioProprietario.required && errors.push('Specificare proprietario.')
      return errors
    },
    disabileFamiliareErrors () {
      const errors = []
      if (!this.$v.dichiarazioneDisabiliForm.radioDisabileFamiliare.$dirty) return errors
      !this.$v.dichiarazioneDisabiliForm.radioDisabileFamiliare.required && errors.push('Campi obbligatori')
      return errors
    },
    cfFamiliareErrors () {
      const errors = []
      if (!this.$v.dichiarazioneDisabiliForm.cfFamiliare.$dirty) return errors
      !this.$v.dichiarazioneDisabiliForm.cfFamiliare.required && errors.push('Il Codice fiscale / P.IVA è obbligatorio.')
      !this.$v.dichiarazioneDisabiliForm.cfFamiliare.minLength && errors.push('Il Codice fiscale / P.IVA deve avere una lunghezza minima di ' + this.$v.dichiarazioneDisabiliForm.cfFamiliare.$params.minLength.min + ' caratteri.')
      !this.$v.dichiarazioneDisabiliForm.cfFamiliare.maxLength && errors.push('Il Codice fiscale / P.IVA deve avere una lunghezza massima di ' + this.$v.dichiarazioneDisabiliForm.cfFamiliare.$params.maxLength.max + ' caratteri.')
      !this.$v.dichiarazioneDisabiliForm.cfFamiliare.alphaNum && errors.push('Il Codice fiscale / P.IVA deve contenere solo lettere e numeri.')
      return errors
    },
    selezionaParentelaErrors () {
      const errors = []
      if (!this.$v.dichiarazioneDisabiliForm.cfFamiliare.$dirty) return errors
      !this.$v.dichiarazioneDisabiliForm.cfFamiliare.required && errors.push('Il campo parentela è obbligatorio.')
      return errors
    }
  },
  methods: {
    resetSelectB () {
      this.dichiarazioneDisabiliForm.radioDisabileFamiliare = null
      this.dichiarazioneDisabiliForm.selezionaParentela = null
      this.dichiarazioneDisabiliForm.cfFamiliare = null
    }
  },
  async created () {
    store.dispatch(COMMON_GRADI_PARENTELA)
  }
}
</script>
