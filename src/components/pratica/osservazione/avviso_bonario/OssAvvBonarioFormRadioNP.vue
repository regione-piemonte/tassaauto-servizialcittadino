<template>
  <div class="space-section mt-2 mx-2">
    <v-radio-group
      :error-count="1"
      :error-messages="osservazRadioErrors"
      v-model="ossAvvAccForm.osservazRadio"
      name="osservazRadio"
      id="formRadio-nonpagato"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="maiPosseduto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.mai_posseduto"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <v-textarea
              label="Puoi specificare dati aggiuntivi."
              outlined
              auto-grow
              clearable
              rows="3"
              clear-icon="mdi-close-circle"
              id="datiAggMaiPosseduto"
              type="text"
              v-model="
                grigliaAvvisoBonarioNonPagato.grigliaVeicoloMaiPosseduto
                  .datiAggiuntivi
              "
              :disabled="ossAvvAccForm.osservazRadio != 'maiPosseduto'"
            />
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-sm-7">
            <v-radio value="venduto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.venduto"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-text-field
                :disabled="ossAvvAccForm.osservazRadio != 'venduto'"
                v-model="grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo.data"
                id="dataVendita"
                label="Data di vendita"
                aria-label="inserire la data di vendita"
                type="date"
                :readonly="false"
                :error-messages="dataVenditaErrors"
                :error-count="2"
              ></v-text-field>
            </div>
            <v-checkbox
              id="vendutoConcessionario"
              v-model="
                grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo
                  .concessionario
              "
              :disabled="ossAvvAccForm.osservazRadio != 'venduto'"
              :label="
                this.$i18n.t(
                  'pratica.osservazione.avviso_accertamento.motivazione.venduto_concessionario'
                )
              "
            >
            </v-checkbox>
          </div>
          <div class="col-12">
            <v-alert
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
                      $t('pratica.osservazione.avviso_accertamento.intro')
                    "
                  />
                </v-col>
              </v-row>
            </v-alert>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="esportato">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.esportato"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-text-field
                :disabled="ossAvvAccForm.osservazRadio != 'esportato'"
                v-model="grigliaAvvisoBonarioNonPagato.grigliaRadiatoEsportazione.data"
                id="dataEsportazione"
                label="Data di esportazione"
                aria-label="inserire la data di esportazione"
                type="date"
                :readonly="false"
                :error-messages="dataEsportazioneErrors"
                :error-count="2"
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="nonDisponibile">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.non_disponibile"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <div class="row">
              <p class="col-12">
                {{
                  $t(
                    "pratica.osservazione.avviso_scadenza.motivazione.non_disponibile_desc"
                  )
                }}
              </p>
              <div class="col-md-6">
                <v-text-field
                  label="Dal"
                  aria-label="inserire la data di non disponibiltà del veicolo da"
                  :disabled="
                    ossAvvAccForm.osservazRadio != 'nonDisponibile'
                  "
                  v-model="grigliaAvvisoBonarioNonPagato
                    .grigliaPrivazioneDisponibilita.dataDal"
                  id="nonDisponibileDal"
                  type="date"
                  :readonly="false"
                  :error-messages="nonDisponibileDalErrors"
                  :error-count="3"
                ></v-text-field>
              </div>
              <div class="col-md-6">
                <v-text-field
                  label="Al"
                  :disabled="
                    ossAvvAccForm.osservazRadio != 'nonDisponibile'
                  "
                  v-model="grigliaAvvisoBonarioNonPagato
                    .grigliaPrivazioneDisponibilita.dataAl"
                  id="nonDisponibileAl"
                  aria-label="inserire la data di non disponibiltà del veicolo al"
                  type="date"
                  :readonly="false"
                  :error-messages="nonDisponibileAlErrors"
                  :error-count="2"
                ></v-text-field>
              </div>
              <div class="col-12">
                <v-textarea
                  id="motivoPrivazioneDisponibilita"
                  label="Specificare la motivazione."
                  type="text"
                  :error-messages="motivoPrivazioneDisponibilitaErrors"
                  :error-count="1"
                  v-model="
                    grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita
                      .motivazione
                  "
                  :disabled="ossAvvAccForm.osservazRadio != 'nonDisponibile'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--esenzione-->
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="esentato">
              <template v-slot:label>
                <strong class="col-12 fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_scadenza.motivazione.esentato"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <v-radio-group
              :error-messages="tipoEsenzioneRadioError"
              :error-count="1"
              v-model="ossAvvAccForm.tipoEsenzione"
              :disabled="ossAvvAccForm.osservazRadio !== 'esentato'"
              name="tipoEsenzione"
            >
              <!--esenzione disabili-->
              <v-radio value="esentatoDisabili">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{
                      $t(
                        "pratica.osservazione.avviso_accertamento.motivazione.esentato_disabili"
                      )
                    }}
                  </strong>
                </template>
              </v-radio>
              <div class="row">
                <div class="col-7">
                  <v-text-field
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Numero protocollo provvedimento"
                    id="numProtocolloDisabili"
                    type="text"
                    v-model="
                      grigliaAvvisoBonarioNonPagato.grigliaEsenzioni
                        .grigliaEsenzioniDisabili.numeroProtocolloProvvedimento
                    "
                    :error-messages="numProtocolloDisabiliErrors"
                    autocomplete="off"
                    :error-count="1"
                    :disabled="
                      ossAvvAccForm.tipoEsenzione != 'esentatoDisabili'
                    "
                  ></v-text-field>
                </div>
                <div class="col-7">
                  <v-text-field
                    label="Data"
                    :disabled="
                      ossAvvAccForm.tipoEsenzione != 'esentatoDisabili'
                    "
                    v-model="grigliaAvvisoBonarioNonPagato.grigliaEsenzioni
                      .grigliaEsenzioniDisabili.data"
                    id="dataProtocolloDisabili"
                    type="date"
                    :readonly="false"
                    aria-label="inserire la data di protocollo per l'esenzione disabili"
                    :error-messages="dataProtocolloDisabiliErrors"
                    :error-count="2"
                  ></v-text-field>
                </div>
              </div>
              <v-alert
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
                      :lazy-src="
                        require(`@/assets/images/icone/alert/info.svg`)
                      "
                    />
                  </v-col>
                  <v-col cols="12" md="10" class="bodyAlertDark">
                    <p
                      v-html="
                        $t(
                          'pratica.osservazione.esenzione.disabili.nota_protocollo'
                        )
                      "
                    />
                  </v-col>
                </v-row>
              </v-alert>
              <!--esenzione impianto-->
              <v-radio value="esentatoImpianto" v-if="regione === 'piemonte'">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{
                      $t(
                        "pratica.osservazione.avviso_accertamento.motivazione.esentato_impianto"
                      )
                    }}
                  </strong>
                </template>
              </v-radio>
              <div class="validation-cont" v-if="regione === 'piemonte'">
                <v-text-field
                  v-model="grigliaAvvisoBonarioNonPagato.grigliaEsenzioni
                    .grigliaInstallazioneGplMetano.data"
                  id="dataInstallImp"
                  aria-label="inserire la data di installazione impianto gpl"
                  type="date"
                  :readonly="false"
                  :error-messages="dataInstallImpErrors"
                  :error-count="2"
                  :disabled="
                    ossAvvAccForm.tipoEsenzione !== 'esentatoImpianto'
                  "
                ></v-text-field>
              </div>
              <!--esenzione altro motivo-->
              <v-radio value="esentatoAltroMotivo">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{
                      $t(
                        "pratica.osservazione.avviso_scadenza.motivazione.esentato_altro_motivo"
                      )
                    }}
                  </strong>
                </template>
              </v-radio>
              <v-textarea
                id="esentatoAltroMotivoTesto"
                :error-count="1"
                :error-messages="esentatoAltroMotivoTestoErrors"
                type="text"
                label="Specificare quale esenzione solleva dal pagamento della tassa."
                v-model="
                  grigliaAvvisoBonarioNonPagato.grigliaEsenzioni
                    .grigliaEsenzioniAltroMotivo.testo
                "
                :disabled="ossAvvAccForm.tipoEsenzione != 'esentatoAltroMotivo'"
              />
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="trasferitoRegione">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.trasferito_regione"
                    )
                  }}
                </strong>
              </template>
             </v-radio>
                <div class="validation-cont">
                  <v-text-field
                    v-model="grigliaAvvisoBonarioNonPagato.grigliaTrasferimentoRegione
                      .data"
                    id="dataTrasfRegione"
                    aria-label="inserire la data di trasferimento in altra Regione"
                    type="date"
                    :readonly="false"
                    :error-messages="dataTrasfRegioneErrors"
                    :error-count="2"
                    :disabled="
                      ossAvvAccForm.osservazRadio !== 'trasferitoRegione'
                    "
                  ></v-text-field>
             </div>
           </div>
         </div>
       </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="radiatoDemolizione">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.radiato_demolizione"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-text-field
                v-model="grigliaAvvisoBonarioNonPagato.grigliaRadiatoDemolizione.data"
                id="dataDemolizione"
                aria-label="inserire la data di demolizione del veicolo"
                type="date"
                :readonly="false"
                :error-messages="dataDemolizioneErrors"
                :error-count="2"
                :disabled="
                  ossAvvAccForm.osservazRadio !== 'radiatoDemolizione'
                "
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="competevaAltroSoggetto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{
                    $t(
                      "pratica.osservazione.avviso_accertamento.motivazione.competeva_altro_soggetto"
                    )
                  }}
                </strong>
              </template>
            </v-radio>
            <!-- TODO allargare textarea -->
            <v-textarea
              label="Specificare la motivazione."
              outlined
              auto-grow
              clearable
              rows="3"
              id="motivoCompetevaAltroSogg"
              type="text"
              v-model="
                grigliaAvvisoBonarioNonPagato.grigliaCompetevaAltroSoggetto
                  .motivazione
              "
              :error-count="1"
              :error-messages="motivoCompetevaAltroSoggErrors"
              :disabled="
                ossAvvAccForm.osservazRadio != 'competevaAltroSoggetto'
              "
            />
          </div>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OsservazioneService from '@/common/osservazione.service'
import { OSS_AVV_BONARIO_SALVA_GRIGLIA_NON_PAG } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'
import { REGIONE_ABILITATA } from '@/common/config'

export default {
  name: 'OssAvvBonarioFormRadioNP',
  data () {
    return {
      regione: REGIONE_ABILITATA,
      ossAvvAccForm: {
        osservazRadio: '',
        tipoEsenzione: ''
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    ossAvvAccForm: {
      osservazRadio: { required },
      tipoEsenzione: {
        required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'esentato' })
      }
    },
    grigliaAvvisoBonarioNonPagato: {
      grigliaVenditaVeicolo: {
        data: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'venduto' }),
          notFutureDate
        }
      },
      grigliaRadiatoDemolizione: {
        data: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'radiatoDemolizione' }),
          notFutureDate
        }
      },
      grigliaRadiatoEsportazione: {
        data: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'esportato' }),
          notFutureDate
        }
      },
      grigliaEsenzioni: {
        grigliaEsenzioniDisabili: {
          data: {
            required: requiredIf(function () { return (this.ossAvvAccForm.osservazRadio === 'esentato' && this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili') }),
            notFutureDate
          },
          numeroProtocolloProvvedimento: {
            required: requiredIf(function () { return (this.ossAvvAccForm.osservazRadio === 'esentato' && this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili') })
          }
        },
        grigliaInstallazioneGplMetano: {
          data: {
            required: requiredIf(function () { return (this.ossAvvAccForm.osservazRadio === 'esentato' && this.ossAvvAccForm.tipoEsenzione === 'esentatoImpianto') }),
            notFutureDate
          }
        },
        grigliaEsenzioniAltroMotivo: {
          testo: {
            required: requiredIf(function () { return (this.ossAvvAccForm.osservazRadio === 'esentato' && this.ossAvvAccForm.tipoEsenzione === 'esentatoAltroMotivo') })
          }
        }
      },
      grigliaPrivazioneDisponibilita: {
        dataDal: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'nonDisponibile' }),
          notFutureDate,
          previousAlFailed: function () {
            return this.checkDateDisponibilitaPrivata()
          }
        },
        dataAl: {
          // required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'nonDisponibile' }),
          notFutureDate
        },
        motivazione: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'nonDisponibile' })
        }
      },
      grigliaTrasferimentoRegione: {
        data: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'trasferitoRegione' }),
          notFutureDate
        }
      },
      grigliaCompetevaAltroSoggetto: {
        motivazione: {
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'competevaAltroSoggetto' })
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'grigliaAvvisoBonarioNonPagato'
    ]),
    datiVeicRettdisabled: function () {
      return this.ossAvvAccForm.osservazRadio !== 'datiVeicoloRettifica'
    },
    osservazRadioErrors () {
      const errors = []
      if (!this.$v.ossAvvAccForm.osservazRadio.$dirty) return errors
      !this.$v.ossAvvAccForm.osservazRadio.required && errors.push('Specificare il motivo dell\'osservazione.')
      return errors
    },
    tipoEsenzioneRadioError () {
      const errors = []
      if (!this.$v.ossAvvAccForm.tipoEsenzione.$dirty) return errors
      !this.$v.ossAvvAccForm.tipoEsenzione.required && errors.push('Specificare il motivo dell\'osservazione.')
      return errors
    },
    dataVenditaErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'venduto' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo.data.required && errors.push('La data di vendita è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo.data.notFutureDate && errors.push('La data di vendita non può essere futura.')
      return errors
    },
    dataEsportazioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'esportato' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoEsportazione.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoEsportazione.data.required && errors.push('La data di esportazione è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoEsportazione.data.notFutureDate && errors.push('La data di esportazione non può essere futura.')
      return errors
    },
    nonDisponibileDalErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataDal.$dirty) return errors
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataDal.required) {
        errors.push('La data è obbligatoria.')
        return errors
      }
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataDal.notFutureDate) errors.push('La data non può essere futura.')
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataDal.previousAlFailed) errors.push('La data di inizio indisponibilità non può essere successiva a quella di fine indisponibilità.')
      return errors
    },
    nonDisponibileAlErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataAl.$dirty) return errors
      // !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataAl.required && errors.push('La data è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataAl.notFutureDate && errors.push('La data non può essere futura.')
      return errors
    },
    motivoPrivazioneDisponibilitaErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.motivazione.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.motivazione.required && errors.push('Il motivo della privazione della disponibilità è obbligatorio.')
      return errors
    },
    numProtocolloDisabiliErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.numeroProtocolloProvvedimento.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.numeroProtocolloProvvedimento.required && errors.push('Il numero di protocollo è obbligatorio.')
      return errors
    },
    dataProtocolloDisabiliErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.required && errors.push('La data del protocollo è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.notFutureDate && errors.push('La data del protocollo non può essere futura.')
      return errors
    },
    esentatoAltroMotivoTestoErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'esentatoAltroMotivo' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.testo.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.testo.required && errors.push('Il motivo dell\'esenzione è obbligatorio.')
      return errors
    },
    motivoCompetevaAltroSoggErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'competevaAltroSoggetto' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaCompetevaAltroSoggetto.motivazione.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaCompetevaAltroSoggetto.motivazione.required && errors.push('Il motivo del perché il pagamento competeva ad un altro soggetto è obbligatorio.')
      return errors
    },
    dataInstallImpErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoImpianto' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.required && errors.push('La data di collaudo dell\'impianto GPL/Metano è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.notFutureDate && errors.push('La data di collaudo dell\'impianto GPL/Metano non può essere futura.')
      return errors
    },
    dataTrasfRegioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'trasferitoRegione' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaTrasferimentoRegione.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaTrasferimentoRegione.data.required && errors.push('La data di trasferimento in altra regione è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaTrasferimentoRegione.data.notFutureDate && errors.push('La data di trasferimento in altra regione non può essere futura.')
      return errors
    },
    dataDemolizioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'radiatoDemolizione' && !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoDemolizione.data.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoDemolizione.data.required && errors.push('La data di demolizione è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioNonPagato.grigliaRadiatoDemolizione.data.notFutureDate && errors.push('La data di demolizione non può essere futura.')
      return errors
    }
  },
  methods: {
    checkDateDisponibilitaPrivata () {
      const dateDal = new Date(this.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataDal.toString()).getTime()
      const dateAl = new Date(this.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.dataAl.toString()).getTime()
      if (isNaN(dateDal) || isNaN(dateAl)) {
        return true
      }
      if (dateDal - dateAl > 0) {
        return false
      }
      return true
    },

    updMotivOssNonPagato () {
      const radioValue = this.ossAvvAccForm.osservazRadio
      const tipoEsenzRadio = this.ossAvvAccForm.tipoEsenzione
      this.grigliaAvvisoBonarioNonPagato.grigliaVenditaVeicolo.value = (radioValue === 'venduto')
      this.grigliaAvvisoBonarioNonPagato.grigliaRadiatoDemolizione.value = (radioValue === 'radiatoDemolizione')
      this.grigliaAvvisoBonarioNonPagato.grigliaRadiatoEsportazione.value = (radioValue === 'esportato')
      this.grigliaAvvisoBonarioNonPagato.grigliaPrivazioneDisponibilita.value = (radioValue === 'nonDisponibile')
      this.grigliaAvvisoBonarioNonPagato.grigliaVeicoloMaiPosseduto.value = (radioValue === 'maiPosseduto')
      this.grigliaAvvisoBonarioNonPagato.grigliaTrasferimentoRegione.value = (radioValue === 'trasferitoRegione')
      this.grigliaAvvisoBonarioNonPagato.grigliaCompetevaAltroSoggetto.value = (radioValue === 'competevaAltroSoggetto')
      this.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.value = (radioValue === 'esentato')
      this.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoDisabili')
      this.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoImpianto')
      this.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoAltroMotivo')
      store.dispatch(OSS_AVV_BONARIO_SALVA_GRIGLIA_NON_PAG, this.grigliaAvvisoBonarioNonPagato)
    }
  },
  async created () {
    this.ossAvvAccForm.osservazRadio = await OsservazioneService.motivoOssAvvBonarioNonPagato(this.grigliaAvvisoBonarioNonPagato)
    if (this.ossAvvAccForm.osservazRadio === 'esentato') {
      this.ossAvvAccForm.tipoEsenzione = await OsservazioneService.tipoEsenzioneAcc(this.grigliaAvvisoBonarioNonPagato.grigliaEsenzioni)
    }
  }
}
</script>
