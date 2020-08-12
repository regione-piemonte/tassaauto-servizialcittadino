<template>
  <div class="space-section mt-2">
    <h2>
      Motivo
    </h2>
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
            <strong>Attenzione</strong>: Dato <strong>obbligatorio</strong><br/>
            è necessario specificare il motivo della domanda scegliendo una delle opzioni.
          </p>
        </v-col>
      </v-row>
    </v-alert>
    <v-radio-group
      v-model="motivoForm.motDomRadio"
      :error-messages="domandaMotivoFormErrors"
      :error-count="1"
      column
      name="domandaMotivoForm">
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="pagamentoEseguito">
              <template v-slot:label>
                <strong class="fix-align">
                  Pagamento eseguito (allegare fotocopia nella sezione Allegati)
                </strong>
              </template>
            </v-radio>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <v-radio
              value="mancanzaPresupposto">
              <template v-slot:label>
                <div class="row">
                  <strong
                    class="col-12 fix-align"
                    id="mancanzaPresupposto">
                    Mancanza del presupposto
                  </strong>
                </div>
              </template>
           </v-radio>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <v-radio
              value="altro">
              <template v-slot:label>
                <div class="row">
                  <strong
                    class="col-12 fix-align"
                    id="altro">
                    Altro
                  </strong>
                  <v-textarea
                    class="col-12 fix-align"
                    clear-icon="mdi-close-circle"
                    label="Inserire motivazione"
                    id="altro-note"
                    outlined
                    auto-grow
                    clearable
                    rows="3"
                    autocomplete="off"
                    :disabled="motivoForm.motDomRadio !== 'altro'"
                    :error-messages="altroNoteErrors"
                    v-model="motivoForm.altroNote">
                  </v-textarea>
                </div>
              </template>
           </v-radio>
          </div>
        </div>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
import DomDiscRimbService from '@/common/domanda_discarico_rimborso.service'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'MotivoDomandaForm',
  props: {
    pMotivoDomanda: { required: true }
  },
  data () {
    return {
      motivoDomanda: this.pMotivoDomanda,
      motivoForm: {
        motDomRadio: null,
        altroNote: this.pMotivoDomanda.altro.note
      }
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    motivoForm: {
      motDomRadio: {
        required
      },
      altroNote: {
        required: requiredIf(function () {
          return this.motivoForm.motDomRadio === 'altro'
        })
      }
    }
  },
  computed: {
    domandaMotivoFormErrors () {
      const errors = []
      if (!this.$v.motivoForm.motDomRadio.$dirty) return errors
      !this.$v.motivoForm.motDomRadio.required && errors.push('Il motivo della domanda è obbligatorio.')
      return errors
    },
    altroNoteErrors () {
      const errors = []
      if (!this.$v.motivoForm.altroNote.$dirty) return errors
      !this.$v.motivoForm.altroNote.required && errors.push('Se selezionato ALTRO è necessario specificare il motivo.')
      return errors
    }
  },
  methods: {
    updDatiMotDomanda () {
      const newMotDomanda = {
        pagamentoEseguito: (this.motivoForm.motDomRadio === 'pagamentoEseguito'),
        mancanzaPresupposto: (this.motivoForm.motDomRadio === 'mancanzaPresupposto'),
        altro: {
          value: (this.motivoForm.motDomRadio === 'altro')
        }
      }

      newMotDomanda.altro.note =
        (this.motivoForm.motDomRadio === 'altro') ? this.motivoForm.altroNote : null
      return newMotDomanda
    }
  },
  async created () {
    this.motivoForm.motDomRadio = await DomDiscRimbService.motivoDomanda(this.pMotivoDomanda)
  }
}
</script>
