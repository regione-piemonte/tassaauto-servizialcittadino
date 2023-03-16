<template>
  <div class="space-section">
    <h2>Dati del veicolo e dei versamenti</h2>
    <v-radio-group
      v-model="
        datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio
      "
      :error-count="1"
      :error-messages="datiVeicoloVersamentiRestituzioneRadioErrors"
      name="datiVeicoloVersamentiRestituzioneRadio"
      id="datiVeicoloVersamentiRestituzioneRadio"
      @change="resetElencoVersamenti()"
    >
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="versamentoErrato">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.dati_veicolo_versamenti.seleziona_veicolo'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
            <v-select
              @change="elencoVersamenti($event)"
              v-model="datiVeicoloVersamentiRestituzioneForm.versamentoErrato"
              :error-messages="versamentoErratoErrors"
              id="versamentoErrato"
              :items="restituzioniVeicoli"
              label="Seleziona il veicolo"
              :error-count="1"
              :disabled="
                datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio !=
                  'versamentoErrato' || restituzioniVeicoli.length === 0
              "
            ></v-select>
            <div
              v-if="
                datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio ===
                  'versamentoErrato' && restituzioniVeicoli.length === 0
              "
            >
              <p class="error--text">
                Troppi risultati trovati. E' necessario inserire manualmente i
                dati del veicolo e del pagamento
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio value="veicoloNonPresente">
              <template v-slot:label>
                <strong>
                  <div
                    v-html="
                      $t(
                        'pratica.restituzione_tassa.dati_veicolo_versamenti.inserisci_veicolo'
                      )
                    "
                  ></div>
                </strong>
              </template>
            </v-radio>
          </div>
          <div class="col-12">
            <strong class="fix-align">
              <div
                v-html="
                  $t(
                    'pratica.restituzione_tassa.dati_veicolo_versamenti.tipo_veicolo'
                  )
                "
              ></div>
            </strong>
            <v-select
              v-model="datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente"
              :error-messages="veicoloNonPresenteErrors"
              id="veicoloNonPresente"
              :items="tipologieVeicoli"
              label="Seleziona il veicolo"
              :error-count="1"
              :disabled="
                datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio !=
                'veicoloNonPresente'
              "
            ></v-select>
            <strong class="fix-align">
              <div
                v-html="
                  $t('pratica.restituzione_tassa.dati_veicolo_versamenti.targa')
                "
              ></div>
            </strong>
            <v-text-field
              v-model="datiVeicoloVersamentiRestituzioneForm.targa"
              :error-messages="targaErrors"
              clearable
              clear-icon="mdi-close-circle"
              label="Inserisci targa"
              type="text"
              id="targa"
              autocomplete="off"
              :error-count="4"
              :disabled="
                datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio !=
                'veicoloNonPresente'
              "
            ></v-text-field>
          </div>
        </div>
        <div
          v-if="
            datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio ===
            'veicoloNonPresente'
          "
        >
          <v-btn
            depressed
            id="inserisciVeicolo"
            color="primary"
            @click="inserisciVeicolo()"
            >Inserisci veicolo</v-btn
          >
        </div>
      </div>
    </v-radio-group>
    <div
      v-if="datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato"
      :class="
        'row dl-inline-header text-center bg-ico bg-ico-' +
        datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato.tipoVeicolo
          .codice
      "
    >
      <dl class="col-12 col-md-3">
        <dt>tipo</dt>
        <dd>
          {{
            datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato.tipoVeicolo
              .descrizione
          }}
        </dd>
      </dl>
      <dl class="col-12 col-md-3">
        <dt>targa</dt>
        <dd>
          {{ datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato.targa }}
        </dd>
      </dl>
      <dl class="col-1 col-md-1 col-lg-1">
        <dd>
          <v-btn depressed icon fab color="primary" @click="resetElencoVersamenti()">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </dd>
      </dl>
    </div>
    <div v-if="elencoVeicoliVersamenti.length > 0 && datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato">
      <div class="space-section">
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
                è possibile selezionare al massimo 2 pagamenti per i quali
                richiedere la restituzione.
              </p>
            </v-col>
          </v-row>
        </v-alert>
        <div class="noAccordion" role="tablist">
          <v-card class="px-5" v-for="(item, index) in lista" :key="index">
            <v-row>
              <div class="col-md-1 align-self-center">
                <v-checkbox
                  :id="'versamenti' + index"
                  :value="item"
                  v-model="datiVeicoloVersamentiRestituzioneForm.selectedItems"
                  :disabled="
                    datiVeicoloVersamentiRestituzioneForm.selectedItems
                      .length >= max &&
                    datiVeicoloVersamentiRestituzioneForm.selectedItems.indexOf(
                      item
                    ) == -1
                  "
                ></v-checkbox>
              </div>
              <div class="col-md-2 align-self-center">
                <div class="data-up dl-inline-header">
                  <dl class="text-center w-100">
                    <dt>Scadenza</dt>
                    <dd>
                      {{ new Date(item.scadenza) | dateFormat("MM/YYYY") }}
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="col-md-2 align-self-center">
                <div class="data-up dl-inline-header">
                  <dl class="text-center w-100">
                    <dt>Validità</dt>
                    <dd>{{ item.validita }}</dd>
                  </dl>
                </div>
              </div>
              <div class="col-md-3 align-self-center">
                <div class="data-up dl-inline-header">
                  <dl class="text-center w-100">
                    <dt>Importo totale</dt>
                    <dd>{{ item.importo | formatCurrency }}</dd>
                  </dl>
                </div>
              </div>
              <div class="col-md-3 align-self-center">
                <div class="data-up dl-inline-header">
                  <dl class="text-center w-100">
                    <dt>Data pagamento</dt>
                    {{
                      new Date(item.dataPagamento) | dateFormat("DD/MM/YYYY")
                    }}
                  </dl>
                </div>
              </div>
            </v-row>
          </v-card>
        </div>
      </div>
    </div>
    <div v-if="datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato">
      <InserisciVersamentoForm
        ref="inserisciVersamento"
        v-on:updateboxerr="updateDetailError($event)"
        :veicolo="datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato"
        :selectedItems="datiVeicoloVersamentiRestituzioneForm.selectedItems"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { MAX_SIZE_CHECKBOX_VERSAMENTI } from '@/common/config'
import { validationMixin } from 'vuelidate'
import { required, requiredIf, alphaNum } from 'vuelidate/lib/validators'
import {
  RESTITUZIONI_TASSA_VEICOLI,
  RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI,
  VEICOLO_LISTA
} from '@/store/actions.type'
import {
  SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO
} from '@/store/mutations.type'
import InserisciVersamentoForm from '@/components/pratica/restituzione_tassa/InserisciVersamentoForm'
const DVVR = store.getters.datiVeicoloVersamentiRestituzione
export default {
  name: 'DatiVeicoloVersamentiRestituzioneFormRadio',
  components: {
    InserisciVersamentoForm
  },
  data () {
    return {
      datiVeicoloVersamentiRestituzioneForm: {
        datiVeicoloVersamentiRestituzioneRadio: DVVR.valueName,
        // versamentoErrato: DVVR.versamentoErrato.veicolo,
        versamentoErrato: null,
        veicoloNonPresente: DVVR.veicoloNonPresente.tipoVeicolo,
        targa: DVVR.valueName === 'veicoloNonPresente' ? DVVR.veicoloNonPresente.targa : null,
        selectedItems: [],
        veicoloSelezionato: null
      },
      tipologieVeicoli: [],
      max: MAX_SIZE_CHECKBOX_VERSAMENTI
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    datiVeicoloVersamentiRestituzioneForm: {
      datiVeicoloVersamentiRestituzioneRadio: { required },
      versamentoErrato: {
        required: requiredIf(function () { return this.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio === 'versamentoErrato' })
      },
      veicoloNonPresente: {
        required: requiredIf(function () { return this.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio === 'veicoloNonPresente' })
      },
      targa: {
        required: requiredIf(function () { return this.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio === 'veicoloNonPresente' }),
        alphaNum
      }
    }
  },
  computed: {
    ...mapGetters([
      'datiVeicoloVersamentiRestituzione',
      'restituzioniVeicoli',
      'elencoVeicoliVersamenti',
      'userIdentity'
    ]),
    lista () {
      for (let i = 0; i < this.elencoVeicoliVersamenti.length; i++) {
        this.elencoVeicoliVersamenti[i].index = i
      }
      return this.elencoVeicoliVersamenti
    },
    datiVeicoloVersamentiRestituzioneRadioErrors () {
      const errors = []
      if (!this.$v.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio.$dirty) return errors
      !this.$v.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio.required && errors.push('Specificare dati veicolo')
      return errors
    },
    veicoloNonPresenteErrors () {
      const errors = []
      if (!this.$v.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente.$dirty) return errors
      !this.$v.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente.required && errors.push('Seleziona il veicolo.')
      return errors
    },
    versamentoErratoErrors () {
      const errors = []
      if (!this.$v.datiVeicoloVersamentiRestituzioneForm.versamentoErrato.$dirty && !this.$v.datiVeicoloVersamentiRestituzioneForm.versamentoErrato !== null) return errors
      !this.$v.datiVeicoloVersamentiRestituzioneForm.versamentoErrato.required && errors.push('Seleziona il veicolo.')
      return errors
    },
    targaErrors () {
      const errors = []
      if (this.datiVeicoloVersamentiRestituzioneForm.datiVeicoloVersamentiRestituzioneRadio === 'veicoloNonPresente' && !this.$v.datiVeicoloVersamentiRestituzioneForm.targa.$dirty) return errors
      !this.$v.datiVeicoloVersamentiRestituzioneForm.targa.required && errors.push('La Targa/Telaio è obbligatoria/o.')
      // !this.$v.datiVeicoloVersamentiRestituzioneForm.targa.maxLength && errors.push('La Targa/Telaio deve avere una lunghezza massima di ' + this.$v.datiVeicoloVersamentiRestituzioneForm.targa.$params.maxLength.max + ' caratteri.')
      !this.$v.datiVeicoloVersamentiRestituzioneForm.targa.alphaNum && errors.push('La Targa/Telaio deve contenere solo lettere e numeri.')
      return errors
    }
  },
  methods: {
    async elencoVersamenti (event) {
      this.datiVeicoloVersamentiRestituzioneForm.selectedItems = []
      store.commit(SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO)
      this.datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato = event
      return event != null
        ? await store.dispatch(RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI, event.idVeicolo)
        : store.commit(SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO)
    },
    resetElencoVersamenti () {
      this.datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato = null
      this.datiVeicoloVersamentiRestituzioneForm.versamentoErrato = {
      }
      this.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente = {
      }
      this.datiVeicoloVersamentiRestituzioneForm.selectedItems = []
      store.commit(SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO)
    },
    inserisciVeicolo () {
      this.$v.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente.$touch()
      this.$v.datiVeicoloVersamentiRestituzioneForm.targa.$touch()
      if (this.$v.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente.$invalid ||
        this.$v.datiVeicoloVersamentiRestituzioneForm.targa.$invalid) return
      const codiceVeicolo = this.datiVeicoloVersamentiRestituzioneForm.veicoloNonPresente
      const descrizioneVeicolo = this.tipologieVeicoli.find(p => (p.value === codiceVeicolo)).text
      this.datiVeicoloVersamentiRestituzioneForm.veicoloSelezionato = {
        targa: this.datiVeicoloVersamentiRestituzioneForm.targa,
        tipoVeicolo: {
          codice: codiceVeicolo,
          descrizione: descrizioneVeicolo
        },
        descrizione: '',
        idVeicolo: null
      }
      store.commit(SET_RESET_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO)
    }
  },
  async created () {
    store.dispatch(VEICOLO_LISTA)
      .then((data) => {
        this.tipologieVeicoli = data
      })
      .catch(error => console.log(error))
    await store.dispatch(RESTITUZIONI_TASSA_VEICOLI, this.userIdentity.cf)
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }
}
</script>
