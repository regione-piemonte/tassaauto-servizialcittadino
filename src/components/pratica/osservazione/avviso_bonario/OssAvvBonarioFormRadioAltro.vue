<template>
  <div class="space-section mt-2 mx-2">
    <v-radio-group
      id="formRadio-altroMotivo"
      v-model="ossAvvAccForm.osservazRadio"
      :error-messages="osservazAltroRadioErrors"
      :error-count="1"
      column
      name="osservazRadio">
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="dirittoRiduzione">
              <template v-slot:label>
                <strong class="fix-align">
                  {{ $t('pratica.osservazione.avviso_accertamento.motivazione.avevo_diritto_riduzione') }}
                </strong>
                  <!-- TODO aumentare dimensione textarea -->
              </template>
            </v-radio>
            <v-textarea
              outlined
              auto-grow
              clearable
              rows="3"
              label="Puoi specificare dati aggiuntivi."
              clear-icon="mdi-close-circle"
              id="datidirittoRiduzione"
              type="text"
              v-model="grigliaAvvisoBonarioAltro.grigliaDirittoRiduzione.testo"
              :disabled="ossAvvAccForm.osservazRadio != 'dirittoRiduzione'"
            />
          </div>
        </div>
      </div>
      <div class="multiple-inline-form-container">
        <div class="row">
          <div class="col-12">
            <v-radio
              value="datiVeicoloRettifica"
              class="datiVeicoloRettifica">
              <template v-slot:label>
                <dati-tecnici-rettifica-form
                  ref="datiTecn"
                  :pDatiTecnici="grigliaAvvisoBonarioAltro.grigliaDatiTecniciErrati"
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
import DatiTecniciRettificaForm from '@/components/pratica/osservazione/DatiTecniciRettificaForm'
import OsservazioneService from '@/common/osservazione.service'
import {
  OSS_AVV_BONARIO_SALVA_GRIGLIA_ALTRO,
  VEICOLO_LISTA,
  CATEGORIE_EURO_LISTA,
  COMBUSTIBILI_LISTA
} from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { TARGA_MAX_LENGTH } from '@/common/config'

export default {
  name: 'OssAvvBonarioAltroMotivo',
  components: { DatiTecniciRettificaForm },
  data () {
    return {
      veicoli: [],
      categorieEuro: [],
      combustibili: [],
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
    grigliaAvvisoBonarioAltro: {
      grigliaDatiTecniciErrati: {
        targa: {
          maxLength: maxLength(TARGA_MAX_LENGTH)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'grigliaAvvisoBonarioAltro'
    ]),
    datiVeicRettdisabled: function () {
      return this.ossAvvAccForm.osservazRadio !== 'datiVeicoloRettifica'
    },
    osservazAltroRadioErrors () {
      const errors = []
      if (!this.$v.ossAvvAccForm.osservazRadio.$dirty) return errors
      !this.$v.ossAvvAccForm.osservazRadio.required && errors.push('Specificare il motivo dell\'osservazione.')
      return errors
    }
  },
  methods: {
    updMotivOssAltroMotivo () {
      const radioValue = this.ossAvvAccForm.osservazRadio
      this.grigliaAvvisoBonarioAltro.grigliaDirittoRiduzione.value = (radioValue === 'dirittoRiduzione')
      this.grigliaAvvisoBonarioAltro.grigliaDatiTecniciErrati.value = (radioValue === 'datiVeicoloRettifica')
      if (radioValue === 'datiVeicoloRettifica') {
        this.grigliaAvvisoBonarioAltro.grigliaDatiTecniciErrati = this.$refs.datiTecn.getDatiTecniciRettificati()
      }
      store.dispatch(OSS_AVV_BONARIO_SALVA_GRIGLIA_ALTRO, this.grigliaAvvisoBonarioAltro)
    }
  },
  async created () {
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // oss. avviso accertamento solo per un sottoinsieme di veicoli
      .then((data) => {
        this.veicoli = data
      })
      .catch((error) => {
        if (error == null) return
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
      })

    store
      .dispatch(CATEGORIE_EURO_LISTA)
      .then((data) => {
        this.categorieEuro = data
      })
      .catch((error) => {
        if (error == null) return
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
      })

    store
      .dispatch(COMBUSTIBILI_LISTA)
      .then((data) => {
        this.combustibili = data
      })
      .catch((error) => {
        if (error == null) return
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
      })
    this.ossAvvAccForm.osservazRadio = await OsservazioneService.motivoOssAvvBonarioAltroMotivo(this.grigliaAvvisoBonarioAltro)
  }
}
</script>
