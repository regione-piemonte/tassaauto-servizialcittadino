<template>
  <div class="space-section mt-2 mx-2">
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
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.pagamentiCorretti') }}
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
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.targaErrataIndicata') }}
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
                    {{ $t('pratica.osservazione.avviso_accertamento.motivazione.scadenzaErrata') }}
                  </strong>
                  <br/>
                  <small>
                   {{ $t('pratica.osservazione.avviso_accertamento.motivazione.info') }}
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
                    {{ $t('pratica.osservazione.avviso_accertamento.motivazione.veicoloRitargato') }}
                  </strong>
                  <small>
                    {{ $t('pratica.osservazione.avviso_accertamento.motivazione.copiaCircolazione') }}
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
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.pagamentoAltraRegioneProvinciaForm') }}
                </strong>
              </template>
            </v-radio>
          </div>
        </div>
      </div>
    </v-radio-group>
    <h2 class="mt-9">
      {{ $t('pratica.osservazione.avviso_accertamento.estremi_pagamento') }}
    </h2>
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <fieldset :disabled="ossAvvAccForm.osservazRadio !== '' ? false : true">
            <v-text-field
            clearable
            clear-icon="mdi-close-circle"
            label="N° Quietanza (Ricevuta)"
            id="numeroQuietanza"
            v-model="grigliaAvvisoBonarioPagato.numeroQuietanza"
            type="text"
            :error-messages="numeroQuietanzaErrors"
            autocomplete="off"
            :error-count="1"
            ></v-text-field>
            <div
              id="dataPagamentoGroup">
              <v-text-field
                v-model="grigliaAvvisoBonarioPagato.dataPagamento"
                id="dataPagamento"
                label="Data del pagamento"
                aria-label="inserire la data di pagamento"
                :readonly="false"
                type="date"
                :error-messages="dataPagamentoErrors"
                :error-count="2"
              ></v-text-field>
            </div>
            <v-text-field
              clearable
              clear-icon="mdi-close-circle"
              label="Ufficio Accettante"
              id="ufficioAccettante"
              v-model="grigliaAvvisoBonarioPagato.ufficioAccettante"
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
import { OSS_AVV_BONARIO_SALVA_GRIGLIA_PAG } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'

export default {
  name: 'OssAvvBonarioFormRadioP',
  data () {
    return {
      ossAvvAccForm: {
        osservazRadio: {}
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    ossAvvAccForm: {
      osservazRadio: { required }
    },
    grigliaAvvisoBonarioPagato: {
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
      'grigliaAvvisoBonarioPagato'
    ]),
    osservazRadioErrors () {
      const errors = []
      if (!this.$v.ossAvvAccForm.osservazRadio.$dirty) return errors
      !this.$v.ossAvvAccForm.osservazRadio.required && errors.push('Devi specificare il motivo dell\'osservazione.')
      return errors
    },
    numeroQuietanzaErrors () {
      const errors = []
      if (!this.$v.grigliaAvvisoBonarioPagato.numeroQuietanza.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioPagato.numeroQuietanza.required && errors.push('Il N° Quietanza (Ricevuta) è obbligatorio.')
      return errors
    },
    ufficioAccettanteErrors () {
      const errors = []
      if (!this.$v.grigliaAvvisoBonarioPagato.ufficioAccettante.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioPagato.ufficioAccettante.required && errors.push('L\'Ufficio Accettante è obbligatorio.')
      return errors
    },
    dataPagamentoErrors () {
      const errors = []
      if (!this.$v.grigliaAvvisoBonarioPagato.dataPagamento.$dirty) return errors
      !this.$v.grigliaAvvisoBonarioPagato.dataPagamento.required && errors.push('La data del pagamento è obbligatoria.')
      !this.$v.grigliaAvvisoBonarioPagato.dataPagamento.notFutureDate && errors.push('La data del pagamento non può essere futura.')
      return errors
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.grigliaAvvisoBonarioPagato[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    updMotivOssPagato () {
      const radioValue = this.ossAvvAccForm.osservazRadio
      this.grigliaAvvisoBonarioPagato.pagamentiCorretti = (radioValue === 'pagamentiCorretti')
      this.grigliaAvvisoBonarioPagato.targaErrata = (radioValue === 'targaErrata')
      this.grigliaAvvisoBonarioPagato.scadenzaErrata = (radioValue === 'scadenzaErrata')
      this.grigliaAvvisoBonarioPagato.veicoloRitargato = (radioValue === 'veicoloRitargato')
      this.grigliaAvvisoBonarioPagato.pagamentoAltraRegioneProvincia = (radioValue === 'pagamentoAltraRegioneProvincia')
      store.dispatch(OSS_AVV_BONARIO_SALVA_GRIGLIA_PAG, this.grigliaAvvisoBonarioPagato)
    }
  },
  async created () {
    this.ossAvvAccForm.osservazRadio = await OsservazioneService.motivoOssAvvBonarioPagato(this.grigliaAvvisoBonarioPagato)
  }
}
</script>
