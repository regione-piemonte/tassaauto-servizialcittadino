<template>
  <div class="space-section">
    <h2>
      {{ $t("pratica.osservazione.avviso_scadenza.dati_anagrafici") }}
    </h2>
    <div v-if="ossAvvScadDatiAnagRett.value" aria-live="polite" aria-atomic="false">
      <v-form @submit.prevent="confermaModifica">
        <v-text-field
          @mousedown="annullaValidazione()"
          clear-icon="mdi-close-circle"
          label="Codice fiscale"
          id="codiceFiscale"
          type="text"
          v-model="ossAvvScadDatiAnagRett.codiceFiscale"
          :maxlength="
            $v.ossAvvScadDatiAnagRett.codiceFiscale.$params.maxLength.max
          "
          :error-messages="cfErrors"
          autocomplete="off"
          :error-count="3"
        ></v-text-field>
        <v-text-field
          @mousedown="annullaValidazione()"
          clear-icon="mdi-close-circle"
          :label="(!personaGiuridica) ? 'Cognome' : 'Denominazione'"
          id="cognomeDenominazione"
          type="text"
          v-model="ossAvvScadDatiAnagRett.cognomeDenominazione"
          autocomplete="off"
          :error-count="1"
        ></v-text-field>
        <v-text-field
          @mousedown="annullaValidazione()"
          clear-icon="mdi-close-circle"
          label="Nome"
          id="nome"
          type="text"
          v-model="ossAvvScadDatiAnagRett.nome"
          autocomplete="off"
          :error-count="1"
          v-if="!personaGiuridica"
        ></v-text-field>
        <v-text-field
          @mousedown="annullaValidazione()"
          clear-icon="mdi-close-circle"
          label="Indirizzo di residenza"
          id="indirizzo"
          type="text"
          v-model="ossAvvScadDatiAnagRett.indirizzo"
          autocomplete="off"
          :error-count="1"
        ></v-text-field>
        <v-text-field
          @mousedown="annullaValidazione()"
          clear-icon="mdi-close-circle"
          label="Comune di residenza"
          id="domicilioFiscale"
          type="text"
          v-model="ossAvvScadDatiAnagRett.domicilioFiscale"
          autocomplete="off"
          :error-count="1"
        ></v-text-field>
        <div class="error--text" v-if="errorRettifica" aria-live="polite" aria-atomic="false" role="alert"><strong>Bisogna compilare almeno un campo o annullare la rettifica dei dati</strong></div>
        <div class="action-button-wide row mt-6">
          <div class="col-md-6">
            <v-btn @click="annullaModifica" depressed class="btn-secondary" aria-label="Annulla la rettifica dei dati anagrafici"
              >Annulla rettifica</v-btn
            >
          </div>
        </div>
      </v-form>
    </div>
    <div v-else aria-live="polite" aria-atomic="false">
      <v-alert color="success" show v-if="successMsg !== ''">
        <p>
          {{ successMsg }}
        </p>
      </v-alert>
      <v-alert
        v-if="successMsg === ''"
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
            <p v-html="$t('pratica.osservazione.avviso_scadenza.info')" />
          </v-col>
        </v-row>
      </v-alert>
      <v-list class="text-uppercase" flat>
        <v-list-item-group :no-action="true" aria-label="dati anagrafici osservazioni scadenza">
          <v-list-item id="" :inactive="true" :ripple="false">
            <span v-if="!personaGiuridica">{{ nome }}&nbsp;</span>{{ cognome }}
          </v-list-item>
          <v-list-item id="" :inactive="true" :ripple="false">
            {{ indirizzo }} {{ domicilioFiscale }}
          </v-list-item>
          <v-list-item id="" :inactive="true" :ripple="false">
            CF: {{ codiceFiscale }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-btn type="button" class="btn-secondary" depressed @click="modifica">
        Segnala variazione dati anagrafici
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COD_FISCALE_MAX_LENGTH } from '@/common/config'
import BoxSuccesso from '@/components/BoxSuccesso'
import { OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI, OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { alphaNum, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'DatiAnagOssAvvScadenza',
  components: { BoxSuccesso },
  data () {
    return {
      successMsg: ''
    }
  },
  computed: {
    ...mapGetters([
      'avvisoScadenza',
      'ossAvvScadDatiAnagRett',
      'errorRettifica'
    ]),
    nome: function () {
      return (this.ossAvvScadDatiAnagRett.nome !== '') ? this.ossAvvScadDatiAnagRett.nome : this.avvisoScadenza.intestatario.nome
    },
    cognome: function () {
      if (this.ossAvvScadDatiAnagRett.cognomeDenominazione !== '') return this.ossAvvScadDatiAnagRett.cognomeDenominazione
      if (this.avvisoScadenza.intestatario.denominazione !== null) return this.avvisoScadenza.intestatario.denominazione
      return this.avvisoScadenza.intestatario.cognome
    },
    personaGiuridica: function () {
      return (this.avvisoScadenza.intestatario.denominazione !== null)
    },
    indirizzo: function () {
      return (this.ossAvvScadDatiAnagRett.indirizzo !== '') ? this.ossAvvScadDatiAnagRett.indirizzo : this.avvisoScadenza.intestatario.indirizzo
    },
    domicilioFiscale: function () {
      return (this.ossAvvScadDatiAnagRett.domicilioFiscale !== '') ? this.ossAvvScadDatiAnagRett.domicilioFiscale : this.avvisoScadenza.intestatario.indirizzoCompleto
    },
    codiceFiscale: function () {
      return (this.ossAvvScadDatiAnagRett.codiceFiscale !== '') ? this.ossAvvScadDatiAnagRett.codiceFiscale : this.avvisoScadenza.intestatario.codiceFiscale
    },
    cfErrors () {
      const errors = []
      if (!this.$v.ossAvvScadDatiAnagRett.codiceFiscale.$dirty) return errors
      !this.$v.ossAvvScadDatiAnagRett.codiceFiscale.maxLength && errors.push('Il Codice fiscale deve avere una lunghezza massima di ' + this.$v.ossAvvScadDatiAnagRett.codiceFiscale.$params.maxLength.max + ' caratteri.')
      !this.$v.ossAvvScadDatiAnagRett.codiceFiscale.alphaNum && errors.push('Il Codice fiscale deve contenere solo lettere e numeri.')
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    ossAvvScadDatiAnagRett: {
      codiceFiscale: {
        alphaNum,
        maxLength: maxLength(COD_FISCALE_MAX_LENGTH)
      }
    }
  },
  methods: {
    verificaDatiFunction () {
      if (
        this.ossAvvScadDatiAnagRett.nome === '' &&
        this.ossAvvScadDatiAnagRett.cognomeDenominazione === '' &&
        this.ossAvvScadDatiAnagRett.indirizzo === '' &&
        this.ossAvvScadDatiAnagRett.domicilioFiscale === '' &&
        this.ossAvvScadDatiAnagRett.codiceFiscale === ''
      ) {
        store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, true)
      } else {
        store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, false)
      }
    },
    annullaValidazione () {
      store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, false)
    },
    annullaModifica () {
      this.ossAvvScadDatiAnagRett.value = false
      this.ossAvvScadDatiAnagRett.codiceFiscale = ''
      this.ossAvvScadDatiAnagRett.cognomeDenominazione = ''
      if (!this.personaGiuridica) this.ossAvvScadDatiAnagRett.nome = ''
      this.ossAvvScadDatiAnagRett.domicilioFiscale = ''
      this.ossAvvScadDatiAnagRett.indirizzo = ''
      store.dispatch(OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI, this.ossAvvScadDatiAnagRett)
      store.dispatch(OSS_AVV_SCADENZA_VERIFICA_DATI_RETTIFICA, false)
    },
    modifica () {
      this.ossAvvScadDatiAnagRett.value = true
      this.$parent.$parent.resetForm()
    },
    confermaModifica () {
      if (this.verificaDatiFunction()) return
      this.$v.ossAvvScadDatiAnagRett.$touch()
      if (this.$v.ossAvvScadDatiAnagRett.$invalid) return
      this.ossAvvScadDatiAnagRett.value = true
      store.dispatch(OSS_AVV_SCADENZA_SALVA_DATI_ANAGRAFICI, this.ossAvvScadDatiAnagRett)
    }
  }
}
</script>
