<template>
  <div class="space-section mt-2">
    <v-radio-group
    :error-count="1"
    :error-messages="osservazRadioErrors"
    v-model="ossAvvAccForm.osservazRadio"
    name="osservazRadio"
    id="formRadio-nonpagato">
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="maiPosseduto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.mai_posseduto') }}
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
              v-model="grigliaAccertamentoNonPagato.grigliaVeicoloMaiPosseduto.datiAggiuntivi"
              :disabled="ossAvvAccForm.osservazRadio != 'maiPosseduto'"/>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-sm-7">
            <v-radio
              value="venduto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.venduto') }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-menu
                v-model="dataVenditaPicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="ossAvvAccForm.osservazRadio != 'venduto'"
                    v-model="grigliaVenditaVeicoloDateFormatted"
                    id="dataVendita"
                    label="Data di vendita"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataVenditaErrors"
                    :error-count="2"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.data" @input="dataVenditaPicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
              <v-checkbox
                id="vendutoConcessionario"
                v-model="grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.concessionario"
                :disabled="ossAvvAccForm.osservazRadio != 'venduto'"
                :label="this.$i18n.t('pratica.osservazione.avviso_accertamento.motivazione.venduto_concessionario')">
              </v-checkbox>
          </div>
          <div class="col-12">
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
                    <strong>Attenzione</strong>: la procedura a vendere, la dichiarazione di scarico responsabilità, l'affidamento,
                    la fattura o simili, <strong>non sono idonei</strong> a provare il trasferimento di proprietà e <strong>non costituiscono valida giustificazione per il mancato pagamento</strong>:
                    occorre un atto di compravendita registrato presso il Pubblico Registro Automobilistico (<strong>voltura o minivoltura</strong>) o se l'acquirente non ha provveduto
                    all'obbligo di registrazione, un atto di data certa, come ad esempio l'autentica notarile, ovvero una sentenza del giudice di pace.
                  </p>
                </v-col>
              </v-row>
            </v-alert>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="esportato">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.esportato') }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-menu
                v-model="dataEsportazionePicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="ossAvvAccForm.osservazRadio != 'esportato'"
                    v-model="dataEsportazioneFormatted"
                    id="dataEsportazione"
                    label="Data di esportazione"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataEsportazioneErrors"
                    :error-count="2"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.data" @input="dataEsportazionePicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="nonDisponibile">
              <template v-slot:label>
                  <strong class="fix-align">
                    {{ $t('pratica.osservazione.avviso_accertamento.motivazione.non_disponibile') }}
                  </strong>
              </template>
            </v-radio>
            <div class="row">
              <p class="col-12">
                {{ $t('pratica.osservazione.avviso_scadenza.motivazione.non_disponibile_desc') }}
              </p>
              <div class="col-md-6">
                <v-menu
                  v-model="nonDisponibileDalPicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      label="Dal"
                      :disabled="ossAvvAccForm.osservazRadio != 'nonDisponibile'"
                      v-model="nonDisponibileDalFormatted"
                      id="nonDisponibileDal"
                      append-icon="event"
                      readonly
                      v-on="on"
                      :error-messages="nonDisponibileDalErrors"
                      :error-count="3"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal" @input="nonDisponibileDalPicker = false" locale="it-IT"></v-date-picker>
                </v-menu>
              </div>
              <div class="col-md-6">
                <v-menu
                  label="Al"
                  v-model="nonDisponibileAlPicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :disabled="ossAvvAccForm.osservazRadio != 'nonDisponibile'"
                      v-model="nonDisponibileAlFormatted"
                      id="nonDisponibileAl"
                      append-icon="event"
                      readonly
                      v-on="on"
                      :error-messages="nonDisponibileAlErrors"
                      :error-count="2"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl" @input="nonDisponibileAlPicker = false" locale="it-IT"></v-date-picker>
                </v-menu>
              </div>
              <v-textarea id="motivoPrivazioneDisponibilita"
                label="Specificare la motivazione."
                type="text"
                :error-messages="motivoPrivazioneDisponibilitaErrors"
                :error-count="1"
                v-model="grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.motivazione"
                :disabled="ossAvvAccForm.osservazRadio != 'nonDisponibile'"
              />
            </div>
          </div>
        </div>
      </div>
      <!--esenzione-->
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="esentato">
              <template v-slot:label>
                <strong class="col-12 fix-align">
                  {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato') }}
                </strong>
              </template>
            </v-radio>
            <v-radio-group
              :error-messages="tipoEsenzioneRadioError"
              :error-count="1"
              v-model="ossAvvAccForm.tipoEsenzione"
              :disabled="ossAvvAccForm.osservazRadio !== 'esentato'"
              name="tipoEsenzione">

              <!--esenzione disabili-->
              <v-radio
                value="esentatoDisabili">
                <template v-slot:label>
                  <strong class="fix-align">
                      {{ $t('pratica.osservazione.avviso_accertamento.motivazione.esentato_disabili') }}
                    </strong>
                </template>
              </v-radio>
              <div class="row">
                <div class="col-7 ">
                  <v-text-field
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Numero protocollo provvedimento"
                  id="numProtocolloDisabili"
                  type="text"
                  v-model="grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.numeroProtocolloProvvedimento"
                  :error-messages="numProtocolloDisabiliErrors"
                  autocomplete="off"
                  :error-count="1"
                  :disabled="ossAvvAccForm.tipoEsenzione != 'esentatoDisabili'"
                  ></v-text-field>
                </div>
                <div class="col-7">
                  <v-menu
                    v-model="dataProtocolloDisabiliPicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        label="Data"
                        :disabled="ossAvvAccForm.tipoEsenzione != 'esentatoDisabili'"
                        v-model="dataProtocolloDisabiliFormatted"
                        id="dataProtocolloDisabili"
                        append-icon="event"
                        readonly
                        v-on="on"
                        :error-messages="dataProtocolloDisabiliErrors"
                        :error-count="2"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data" @input="dataProtocolloDisabiliPicker = false" locale="it-IT"></v-date-picker>
                  </v-menu>
                </div>
              </div>
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
                    <p
                      v-html="$t('pratica.osservazione.esenzione.disabili.nota_protocollo')"
                    />
                  </v-col>
                </v-row>
              </v-alert>
              <!--esenzione impianto-->
              <v-radio
                value="esentatoImpianto">
                <template v-slot:label>
                  <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.esentato_impianto') }}
                </strong>
                </template>
              </v-radio>
              <div class="validation-cont">
                <v-menu
                  v-model="dataInstallImpPicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dataInstallImpFormatted"
                      id="dataInstallImp"
                      append-icon="event"
                      readonly
                      v-on="on"
                      :error-messages="dataInstallImpErrors"
                      :error-count="2"
                      :disabled="ossAvvAccForm.tipoEsenzione !== 'esentatoImpianto'"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data" @input="dataInstallImpPicker = false" locale="it-IT"></v-date-picker>
                </v-menu>
              </div>
              <!--esenzione altro motivo-->
              <v-radio
                value="esentatoAltroMotivo">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_altro_motivo') }}
                  </strong>
                </template>
              </v-radio>
                <v-textarea id="esentatoAltroMotivoTesto"
                  :error-count="1"
                  :error-messages="esentatoAltroMotivoTestoErrors"
                  type="text"
                  label="Specificare quale esenzione solleva dal pagamento della tassa."
                  v-model="grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.testo"
                  :disabled="ossAvvAccForm.tipoEsenzione != 'esentatoAltroMotivo'"
                />
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="trasferitoRegione">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.trasferito_regione') }}
                </strong>
                <div class="validation-cont">
                  <v-menu
                    v-model="dataTrasfRegionePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dataTrasfRegioneFormatted"
                        id="dataTrasfRegione"
                        append-icon="event"
                        readonly
                        v-on="on"
                        :error-messages="dataTrasfRegioneErrors"
                        :error-count="2"
                        :disabled="ossAvvAccForm.osservazRadio !== 'trasferitoRegione'"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.data" @input="dataTrasfRegionePicker = false" locale="it-IT"></v-date-picker>
                  </v-menu>
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
              value="radiatoDemolizione">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.radiato_demolizione') }}
                </strong>
              </template>
            </v-radio>
            <div class="validation-cont">
              <v-menu
                v-model="dataDemolizionePicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dataDemolizioneFormatted"
                    id="dataDemolizione"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataDemolizioneErrors"
                    :error-count="2"
                    :disabled="ossAvvAccForm.osservazRadio !== 'radiatoDemolizione'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.data" @input="dataDemolizionePicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="competevaAltroSoggetto">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.competeva_altro_soggetto') }}
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
              v-model="grigliaAccertamentoNonPagato.grigliaCompetevaAltroSoggetto.motivazione"
              :error-count="1"
              :error-messages="motivoCompetevaAltroSoggErrors"
              :disabled="ossAvvAccForm.osservazRadio != 'competevaAltroSoggetto'"
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
import { OSS_AVV_ACC_SALVA_GRIGLIA_NON_PAG } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'

export default {
  name: 'OssAvvAccFormRadio',
  data () {
    return {
      ossAvvAccForm: {
        osservazRadio: '',
        tipoEsenzione: ''
      },
      date: null,
      dataVenditaPicker: false,
      dataEsportazionePicker: false,
      nonDisponibileDalPicker: false,
      nonDisponibileAlPicker: false,
      dataProtocolloDisabiliPicker: false,
      dataInstallImpPicker: false,
      dataTrasfRegionePicker: false,
      dataDemolizionePicker: false
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
    grigliaAccertamentoNonPagato: {
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
          required: requiredIf(function () { return this.ossAvvAccForm.osservazRadio === 'nonDisponibile' }),
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
      'grigliaAccertamentoNonPagato'
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
      if (this.ossAvvAccForm.osservazRadio !== 'venduto' && !this.$v.grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.data.required && errors.push('La data di vendita è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.data.notFutureDate && errors.push('La data di vendita non può essere futura.')
      return errors
    },
    dataEsportazioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'esportato' && !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.data.required && errors.push('La data di esportazione è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.data.notFutureDate && errors.push('La data di esportazione non può essere futura.')
      return errors
    },
    nonDisponibileDalErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal.$dirty) return errors
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal.required) {
        errors.push('La data di esportazione è obbligatoria.')
        return errors
      }
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal.notFutureDate) errors.push('La data di esportazione non può essere futura.')
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal.previousAlFailed) errors.push('La data di inizio indisponibilità non può essere successiva a quella di fine indisponibilità.')
      return errors
    },
    nonDisponibileAlErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio !== 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl.required && errors.push('La data di esportazione è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl.notFutureDate && errors.push('La data di esportazione non può essere futura.')
      return errors
    },
    motivoPrivazioneDisponibilitaErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'nonDisponibile' && !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.motivazione.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.motivazione.required && errors.push('Il motivo della privazione della disponibilità è obbligatorio.')
      return errors
    },
    numProtocolloDisabiliErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili' && !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.numeroProtocolloProvvedimento.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.numeroProtocolloProvvedimento.required && errors.push('Il numero di protocollo è obbligatorio.')
      return errors
    },
    dataProtocolloDisabiliErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoDisabili' && !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.required && errors.push('La data del protocollo è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data.notFutureDate && errors.push('La data del protocollo non può essere futura.')
      return errors
    },
    esentatoAltroMotivoTestoErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'esentatoAltroMotivo' && !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.testo.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.testo.required && errors.push('Il motivo dell\'esenzione è obbligatorio.')
      return errors
    },
    motivoCompetevaAltroSoggErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'competevaAltroSoggetto' && !this.$v.grigliaAccertamentoNonPagato.grigliaCompetevaAltroSoggetto.motivazione.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaCompetevaAltroSoggetto.motivazione.required && errors.push('Il motivo del perché il pagamento competeva ad un altro soggetto è obbligatorio.')
      return errors
    },
    dataInstallImpErrors () {
      const errors = []
      if (this.ossAvvAccForm.tipoEsenzione === 'esentatoImpianto' && !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.required && errors.push('La data di collaudo dell\'impianto GPL/Metano è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data.notFutureDate && errors.push('La data di collaudo dell\'impianto GPL/Metano non può essere futura.')
      return errors
    },
    dataTrasfRegioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'trasferitoRegione' && !this.$v.grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.data.required && errors.push('La data di trasferimento in altra regione è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.data.notFutureDate && errors.push('La data di trasferimento in altra regione non può essere futura.')
      return errors
    },
    dataDemolizioneErrors () {
      const errors = []
      if (this.ossAvvAccForm.osservazRadio === 'radiatoDemolizione' && !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.data.$dirty) return errors
      !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.data.required && errors.push('La data di demolizione è obbligatoria.')
      !this.$v.grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.data.notFutureDate && errors.push('La data di demolizione non può essere futura.')
      return errors
    },
    grigliaVenditaVeicoloDateFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.data)
    },
    dataEsportazioneFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.data)
    },
    nonDisponibileDalFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal)
    },
    nonDisponibileAlFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl)
    },
    dataProtocolloDisabiliFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data)
    },
    dataInstallImpFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data)
    },
    dataTrasfRegioneFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.data)
    },
    dataDemolizioneFormatted () {
      return this.formatDate(this.grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.data)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    checkDateDisponibilitaPrivata () {
      const dateDal = new Date(this.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataDal.toString()).getTime()
      const dateAl = new Date(this.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.dataAl.toString()).getTime()
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
      this.grigliaAccertamentoNonPagato.grigliaVenditaVeicolo.value = (radioValue === 'venduto')
      this.grigliaAccertamentoNonPagato.grigliaRadiatoDemolizione.value = (radioValue === 'radiatoDemolizione')
      this.grigliaAccertamentoNonPagato.grigliaRadiatoEsportazione.value = (radioValue === 'esportato')
      this.grigliaAccertamentoNonPagato.grigliaPrivazioneDisponibilita.value = (radioValue === 'nonDisponibile')
      this.grigliaAccertamentoNonPagato.grigliaVeicoloMaiPosseduto.value = (radioValue === 'maiPosseduto')
      this.grigliaAccertamentoNonPagato.grigliaTrasferimentoRegione.value = (radioValue === 'trasferitoRegione')
      this.grigliaAccertamentoNonPagato.grigliaCompetevaAltroSoggetto.value = (radioValue === 'competevaAltroSoggetto')
      this.grigliaAccertamentoNonPagato.grigliaEsenzioni.value = (radioValue === 'esentato')
      this.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoDisabili')
      this.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoImpianto')
      this.grigliaAccertamentoNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoAltroMotivo')
      store.dispatch(OSS_AVV_ACC_SALVA_GRIGLIA_NON_PAG, this.grigliaAccertamentoNonPagato)
    }
  },
  async created () {
    this.ossAvvAccForm.osservazRadio = await OsservazioneService.motivoOssAvvAccNonPagato(this.grigliaAccertamentoNonPagato)
    if (this.ossAvvAccForm.osservazRadio === 'esentato') {
      this.ossAvvAccForm.tipoEsenzione = await OsservazioneService.tipoEsenzioneAcc(this.grigliaAccertamentoNonPagato.grigliaEsenzioni)
    }
  }
}
</script>
