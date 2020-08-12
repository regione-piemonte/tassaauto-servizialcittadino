<template>
  <div class="space-section">
    <h2>Osservazioni</h2>
    <v-radio-group
    v-model="ossAvvScadForm.osservazRadio"
    :error-count="1"
    :error-messages="osservazRadioErrors"
    name="osservazRadio"
    id="osservazioneScadenzaForm">
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
          <v-radio
            value="maiPosseduto"
            >
            <template v-slot:label>
              <strong class="fix-align">
                {{ $t('pratica.osservazione.avviso_scadenza.motivazione.mai_posseduto') }}
              </strong>
            </template>
          </v-radio>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-7">
            <v-radio
              value="venduto"
              >
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_scadenza.motivazione.venduto') }}
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
                    v-model="dataVenditaFormatted"
                    id="dataVendita"
                    label="Data di vendita"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataVenditaErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'venduto'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.venduto.data" @input="dataVenditaPicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
          <div class="col-5">
            <v-checkbox
              id="vendutoConcessionario"
              v-model="attributiOssAvvScad.venduto.concessionario"
              :disabled="ossAvvScadForm.osservazRadio != 'venduto'"
              :label="this.$i18n.t('pratica.osservazione.avviso_scadenza.motivazione.venduto_concessionario')">
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
              value="esportato"
              >
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esportato') }}
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
                    v-model="dataEsportazioneFormatted"
                    id="dataEsportazione"
                    label="Data di esportazione"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataEsportazioneErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'esportato'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.radiato.data" @input="dataEsportazionePicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="nonDisponibile"
              >
              <template v-slot:label>
                <div class="row">
                  <strong class="col-12 fix-align">
                    {{ $t('pratica.osservazione.avviso_scadenza.motivazione.non_disponibile') }}
                  </strong>
                </div>
              </template>
            </v-radio>
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
                    v-model="nonDisponibileDalFormatted"
                    label="Dal"
                    id="nonDisponibileDal"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="nonDisponibileDalErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'nonDisponibile'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.disponibilitaPrivata.dal" @input="nonDisponibileDalPicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
            <div class="col-md-6">
              <v-menu
                v-model="nonDisponibileAlPicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="nonDisponibileAlFormatted"
                    label="Al"
                    id="nonDisponibileAl"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="nonDisponibileAlErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'nonDisponibile'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.disponibilitaPrivata.al" @input="nonDisponibileAlPicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="esentato"
              >
              <template v-slot:label>
                <strong class="fix-align">{{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato') }}</strong>
              </template>
            </v-radio>
            <v-radio-group
              v-model="ossAvvScadForm.tipoEsenzione"
              :error-count="1"
              :error-messages="tipoEsenzioneErrors"
              name="tipoEsenzione"
              id="tipoEsenzioneForm"
              :disabled="ossAvvScadForm.osservazRadio != 'esentato'">
              <v-radio
                value="esentatoDisabili">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_disabili') }}
                  </strong>
                </template>
              </v-radio>
              <div class="row">
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
                <div class="col-7">
                  <v-text-field
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Numero protocollo provvedimento"
                    id="numProtocolloDisabili"
                    type="text"
                    v-model="attributiOssAvvScad.esenzioni.disabili.protocollo"
                    :error-messages="numProtocolloDisabiliErrors"
                    autocomplete="off"
                    :error-count="1"
                    :disabled="ossAvvScadForm.tipoEsenzione != 'esentatoDisabili'"
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
                        v-model="dataProtocolloDisabiliFormatted"
                        label="Data"
                        id="dataProtocolloDisabili"
                        append-icon="event"
                        readonly
                        v-on="on"
                        :error-messages="dataProtocolloDisabiliErrors"
                        :error-count="2"
                        :disabled="ossAvvScadForm.tipoEsenzione != 'esentatoDisabili'"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="attributiOssAvvScad.esenzioni.disabili.del" @input="dataProtocolloDisabiliPicker = false" locale="it-IT"></v-date-picker>
                  </v-menu>
                </div>
              </div>
              <v-radio
                value="esentatoImpianto">
                <template v-slot:label>
                  <strong class="fix-align">
                    {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_impianto') }}
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
                      label="Data di installazione"
                      append-icon="event"
                      readonly
                      v-on="on"
                      :error-messages="dataInstallImpErrors"
                      :error-count="2"
                      :disabled="ossAvvScadForm.osservazRadio != 'esentatoImpianto'"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="attributiOssAvvScad.esenzioni.impiantoGplMetano.data" @input="dataInstallImpPicker = false" locale="it-IT"></v-date-picker>
                </v-menu>
              </div>
              <v-radio
                value="esentatoAltroMotivo">
                <template v-slot:label>
                    <strong class="fix-align col-12">
                      {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_altro_motivo') }}
                    </strong>
                </template>
              </v-radio>
              <div class="row">
                <div class="col-12">
                  <v-textarea
                    outlined
                    auto-grow
                    clearable
                    clear-icon="mdi-close-circle"
                    rows="3"
                    id="esentatoAltroMotivoTesto"
                    label="Specificare quale esenzione solleva dal pagamento della tassa."
                    type="text"
                    :error-count="1"
                    :error-messages="esentatoAltroMotivoTestoErrors"
                    v-model="attributiOssAvvScad.esenzioni.altroMotivo.testo"
                    @input="$v.attributiOssAvvScad.esenzioni.altroMotivo.testo.$touch()"
                    :state="(ossAvvScadForm.tipoEsenzione === 'esentatoAltroMotivo' && $v.attributiOssAvvScad.esenzioni.altroMotivo.testo.$dirty) ? !$v.attributiOssAvvScad.esenzioni.altroMotivo.testo.$error : null"
                    :disabled="ossAvvScadForm.tipoEsenzione != 'esentatoAltroMotivo'"
                  />
                </div>
              </div>
            </v-radio-group>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="trasferitoRegione"
              >
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_scadenza.motivazione.trasferito_regione') }}
                </strong>
              </template>
            </v-radio>
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
                    label="Data di trasferimento"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataTrasfRegioneErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'trasferitoRegione'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.trasferimentoRegione.data" @input="dataTrasfRegionePicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="radiatoDemolizione"
              >
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_scadenza.motivazione.radiato_demolizione') }}
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
                    label="Data di demolizione"
                    append-icon="event"
                    readonly
                    v-on="on"
                    :error-messages="dataDemolizioneErrors"
                    :error-count="2"
                    :disabled="ossAvvScadForm.osservazRadio != 'radiatoDemolizione'"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="attributiOssAvvScad.radiatoDemolizione.data" @input="dataDemolizionePicker = false" locale="it-IT"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="datiVeicoloRettifica"
              class="datiVeicoloRettifica"
              >
              <template v-slot:label>
                <dati-tecnici-rettifica-form
                  ref="datiTecn"
                  :pDatiTecnici="attributiOssAvvScad.datiVeicoloRettifica"
                  :pDatiTecniciDisabled="datiVeicRettdisabled"
                />
              </template>
            </v-radio>
          </div>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OsservazioneService from '@/common/osservazione.service'
import DatiTecniciRettificaForm from '@/components/pratica/osservazione/DatiTecniciRettificaForm'
import { OSS_AVV_SCADENZA_SALVA_ATTRIBUTI } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'

export default {
  name: 'OssAvvScadenzaFormRadio',
  components: { DatiTecniciRettificaForm },
  data () {
    return {
      ossAvvScadForm: {
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
    attributiOssAvvScad: {
      venduto: {
        data: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'venduto' }),
          notFutureDate
        }
      },
      radiatoDemolizione: {
        data: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'radiatoDemolizione' }),
          notFutureDate
        }
      },
      radiato: {
        data: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'esportato' }),
          notFutureDate
        }
      },
      esenzioni: {
        disabili: {
          del: {
            required: requiredIf(function () { return (this.ossAvvScadForm.osservazRadio === 'esentato' && this.ossAvvScadForm.tipoEsenzione === 'esentatoDisabili') }),
            notFutureDate
          },
          protocollo: {
            required: requiredIf(function () { return (this.ossAvvScadForm.osservazRadio === 'esentato' && this.ossAvvScadForm.tipoEsenzione === 'esentatoDisabili') })
          }
        },
        altroMotivo: {
          testo: {
            required: requiredIf(function () { return (this.ossAvvScadForm.osservazRadio === 'esentato' && this.ossAvvScadForm.tipoEsenzione === 'esentatoAltroMotivo') })
          }
        },
        impiantoGplMetano: {
          data: {
            required: requiredIf(function () { return (this.ossAvvScadForm.osservazRadio === 'esentato' && this.ossAvvScadForm.tipoEsenzione === 'esentatoImpianto') }),
            notFutureDate
          }
        }
      },
      disponibilitaPrivata: {
        dal: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'nonDisponibile' }),
          notFutureDate,
          previousAlFailed: function () {
            return this.checkDateDisponibilitaPrivata()
          }
        },
        al: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'nonDisponibile' }),
          notFutureDate
        }
      },
      trasferimentoRegione: {
        data: {
          required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'trasferitoRegione' }),
          notFutureDate
        }
      }
    },
    ossAvvScadForm: {
      osservazRadio: { required },
      tipoEsenzione: {
        required: requiredIf(function () { return this.ossAvvScadForm.osservazRadio === 'esentato' })
      }
    }
  },
  computed: {
    ...mapGetters([
      'attributiOssAvvScad'
    ]),
    datiVeicRettdisabled: function () {
      return this.ossAvvScadForm.osservazRadio !== 'datiVeicoloRettifica'
    },
    osservazRadioErrors () {
      const errors = []
      if (!this.$v.ossAvvScadForm.osservazRadio.$dirty) return errors
      !this.$v.ossAvvScadForm.osservazRadio.required && errors.push('Specificare il motivo dell\'osservazione.')
      return errors
    },
    tipoEsenzioneErrors () {
      const errors = []
      if (!this.$v.ossAvvScadForm.tipoEsenzione.$dirty) return errors
      !this.$v.ossAvvScadForm.tipoEsenzione.required && errors.push('Devi specificare la tipologia di esenzione.')
      return errors
    },
    esentatoAltroMotivoTestoErrors () {
      const errors = []
      if (!this.$v.ossAvvScadForm.tipoEsenzione.$dirty) return errors
      this.ossAvvScadForm.tipoEsenzione === 'esentatoAltroMotivo' && !this.$v.attributiOssAvvScad.esenzioni.altroMotivo.testo.required && errors.push('Il motivo dell\'esenzione è obbligatorio.')
      return errors
    },
    dataVenditaErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.venduto.data.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'venduto' && !this.$v.attributiOssAvvScad.venduto.data.required && errors.push('La data di vendita è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'venduto' && !this.$v.attributiOssAvvScad.venduto.data.notFutureDate && errors.push('La data di vendita non può essere futura.')
      return errors
    },
    dataEsportazioneErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.radiato.data.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'esportato' && !this.$v.attributiOssAvvScad.radiato.data.required && errors.push('La data di esportazione è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'esportato' && !this.$v.attributiOssAvvScad.radiato.data.notFutureDate && errors.push('La data di esportazione non può essere futura.')
      return errors
    },
    dataInstallImpErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.esenzioni.impiantoGplMetano.data.$dirty) return errors
      this.ossAvvScadForm.tipoEsenzione === 'esentatoImpianto' && !this.$v.attributiOssAvvScad.esenzioni.impiantoGplMetano.data.required && errors.push('La data di collaudo dell\'impianto GPL/Metano è obbligatoria.')
      this.ossAvvScadForm.tipoEsenzione === 'esentatoImpianto' && !this.$v.attributiOssAvvScad.esenzioni.impiantoGplMetano.data.notFutureDate && errors.push('La data di collaudo dell\'impianto GPL/Metano non può essere futura.')
      return errors
    },
    dataTrasfRegioneErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.trasferimentoRegione.data.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'trasferitoRegione' && !this.$v.attributiOssAvvScad.trasferimentoRegione.data.required && errors.push('La data di trasferimento è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'trasferitoRegione' && !this.$v.attributiOssAvvScad.trasferimentoRegione.data.notFutureDate && errors.push('La data di trasferimento non può essere futura.')
      return errors
    },
    dataDemolizioneErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.radiato.data.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'radiatoDemolizione' && !this.$v.attributiOssAvvScad.radiatoDemolizione.data.required && errors.push('La data di demolizione è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'radiatoDemolizione' && !this.$v.attributiOssAvvScad.radiatoDemolizione.data.notFutureDate && errors.push('La data di demolizione non può essere futura.')
      return errors
    },
    nonDisponibileDalErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.disponibilitaPrivata.dal.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'nonDisponibile' && !this.$v.attributiOssAvvScad.disponibilitaPrivata.dal.required && errors.push('La data di inizio indisponibilità è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'nonDisponibile' && !this.$v.attributiOssAvvScad.disponibilitaPrivata.dal.notFutureDate && errors.push('La data di inizio indisponibilità non può essere futura.')
      this.ossAvvScadForm.osservazRadio === 'nonDisponibile' && !this.$v.attributiOssAvvScad.disponibilitaPrivata.dal.previousAlFailed && errors.push('La data di inizio indisponibilità non può essere successiva a quella di fine indisponibilità.')
      return errors
    },
    nonDisponibileAlErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.disponibilitaPrivata.al.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'nonDisponibile' && !this.$v.attributiOssAvvScad.disponibilitaPrivata.al.required && errors.push('La data di fine indisponibilità è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'nonDisponibile' && !this.$v.attributiOssAvvScad.disponibilitaPrivata.al.notFutureDate && errors.push('La data di fine indisponibilità non può essere futura.')
      return errors
    },
    dataProtocolloDisabiliErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.esenzioni.disabili.del.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'esentatoDisabili' && !this.$v.attributiOssAvvScad.esenzioni.disabili.del.required && errors.push('La data del protocollo è obbligatoria.')
      this.ossAvvScadForm.osservazRadio === 'esentatoDisabili' && !this.$v.attributiOssAvvScad.esenzioni.disabili.del.notFutureDate && errors.push('La data del protocollo non può essere futura.')
      return errors
    },
    numProtocolloDisabiliErrors () {
      const errors = []
      if (!this.$v.attributiOssAvvScad.esenzioni.disabili.protocollo.$dirty) return errors
      this.ossAvvScadForm.osservazRadio === 'esentatoDisabili' && !this.$v.attributiOssAvvScad.esenzioni.disabili.protocollo.required && errors.push('Il numero di protocollo è obbligatorio.')
      return errors
    },
    dataVenditaFormatted () {
      return this.formatDate(this.attributiOssAvvScad.venduto.data)
    },
    dataEsportazioneFormatted () {
      return this.formatDate(this.attributiOssAvvScad.radiato.data)
    },
    dataInstallImpFormatted () {
      return this.formatDate(this.attributiOssAvvScad.esenzioni.impiantoGplMetano.data)
    },
    dataTrasfRegioneFormatted () {
      return this.formatDate(this.attributiOssAvvScad.trasferimentoRegione.data)
    },
    dataProtocolloDisabiliFormatted () {
      return this.formatDate(this.attributiOssAvvScad.esenzioni.disabili.del)
    },
    dataDemolizioneFormatted () {
      return this.formatDate(this.attributiOssAvvScad.radiatoDemolizione.data)
    },
    nonDisponibileDalFormatted () {
      return this.formatDate(this.attributiOssAvvScad.disponibilitaPrivata.dal)
    },
    nonDisponibileAlFormatted () {
      return this.formatDate(this.attributiOssAvvScad.disponibilitaPrivata.al)
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
    checkDateDisponibilitaPrivata () {
      const dateDal = new Date(this.attributiOssAvvScad.disponibilitaPrivata.dal.toString()).getTime()
      const dateAl = new Date(this.attributiOssAvvScad.disponibilitaPrivata.al.toString()).getTime()
      if (isNaN(dateDal) || isNaN(dateAl)) {
        return true
      }
      if (dateDal - dateAl > 0) {
        return false
      }
      return true
    },

    updMotivazioneOss () {
      const radioValue = this.ossAvvScadForm.osservazRadio
      const tipoEsenzRadio = this.ossAvvScadForm.tipoEsenzione

      this.attributiOssAvvScad.venduto.value = (radioValue === 'venduto')
      this.attributiOssAvvScad.radiatoDemolizione.value = (radioValue === 'radiatoDemolizione')
      this.attributiOssAvvScad.radiato.value = (radioValue === 'esportato')

      this.attributiOssAvvScad.esenzioni.value = (radioValue === 'esentato')
      this.attributiOssAvvScad.esenzioni.disabili.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoDisabili')
      this.attributiOssAvvScad.esenzioni.altroMotivo.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoAltroMotivo')
      this.attributiOssAvvScad.esenzioni.impiantoGplMetano.value = (radioValue === 'esentato' && tipoEsenzRadio === 'esentatoImpianto')

      this.attributiOssAvvScad.disponibilitaPrivata.value = (radioValue === 'nonDisponibile')
      this.attributiOssAvvScad.isNotIntestatario.value = (radioValue === 'maiPosseduto')
      this.attributiOssAvvScad.trasferimentoRegione.value = (radioValue === 'trasferitoRegione')
      this.attributiOssAvvScad.datiVeicoloRettifica.value = (radioValue === 'datiVeicoloRettifica')

      if (radioValue === 'datiVeicoloRettifica') {
        this.attributiOssAvvScad.datiVeicoloRettifica = this.$refs.datiTecn.getDatiTecniciRettificati()
      }
      store.dispatch(OSS_AVV_SCADENZA_SALVA_ATTRIBUTI, this.attributiOssAvvScad)
    }
  },
  async created () {
    this.ossAvvScadForm.osservazRadio = await OsservazioneService.motivoOssAvvScadenza(this.attributiOssAvvScad)
    if (this.ossAvvScadForm.osservazRadio === 'esentato') {
      this.ossAvvScadForm.tipoEsenzione = await OsservazioneService.tipoEsenzione(this.attributiOssAvvScad.esenzioni)
    }
  }
}
</script>
