<template>
  <div class="space-section">
    <h2>Inserisci versamento</h2>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6">
        <v-select
          id="mesiValidità"
          :items="listaMesiValidita"
          label="Validità"
          v-model="inserisciVersamentoForm.mesiValidita"
          :error-messages="mesiValiditaErrors"
          :error-count="1"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="inserisciVersamentoForm.importo"
          :error-messages="importoErrors"
          :error-count="1"
          type="number"
          id="importo"
          label="Importo"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-menu
          v-model="scadenzaPicker"
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="scadenza"
              :error-messages="scadenzaErrors"
              :error-count="1"
              label="Scadenza"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="inserisciVersamentoForm.scadenza"
            @input="scadenzaPicker = false"
            :show-current="false"
            type="month"
            scrollable
            locale="it-IT"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6">
        <v-menu
          v-model="dataPagamentoPicker"
          :close-on-content-click="false"
          offset-y
          transition="scale-transition"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dataPagamento"
              :error-messages="dataPagamentoErrors"
              :error-count="1"
              label="Data pagamento "
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="inserisciVersamentoForm.dataPagamento"
            @input="dataPagamentoPicker = false"
            :show-current="false"
            scrollable
            locale="it-IT"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-btn id="inserisciVersamento" color="primary" @click="inserisciVersamentoLista()" depressed>Inserisci</v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { BOLLO_PAGO_LIST_VAL_SCADENZA } from '@/store/actions.type'
import {
  SET_ADD_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO
} from '@/store/mutations.type'
export default {
  name: 'InserisciVersamentoForm',
  props: {
    veicolo: { type: Object, required: true },
    selectedItems: { type: Array, required: true }
  },
  data () {
    return {
      inserisciVersamentoForm: {
        mesiValidita: null,
        importo: null,
        scadenza: '',
        dataPagamento: ''
      },
      listaMesiValidita: [],
      scadenzaPicker: false,
      dataPagamentoPicker: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    inserisciVersamentoForm: {
      mesiValidita: {
        required
      },
      importo: {
        required
      },
      scadenza: {
        required
      },
      dataPagamento: {
        required
      }
    }
  },
  computed: {
    ...mapGetters([
      'elencoVeicoliVersamenti'
    ]),
    scadenza () {
      return this.formatDateMonth(this.inserisciVersamentoForm.scadenza)
    },
    dataPagamento () {
      return this.formatDate(this.inserisciVersamentoForm.dataPagamento)
    },
    scadenzaErrors () {
      const errors = []
      if (!this.$v.inserisciVersamentoForm.scadenza.$dirty) return errors
      !this.$v.inserisciVersamentoForm.scadenza.required && errors.push('La scadenza è obbligatoria')
      return errors
    },
    dataPagamentoErrors () {
      const errors = []
      if (!this.$v.inserisciVersamentoForm.dataPagamento.$dirty) return errors
      !this.$v.inserisciVersamentoForm.dataPagamento.required && errors.push('La data del pagamento è obbligatoria')
      return errors
    },
    importoErrors () {
      const errors = []
      if (!this.$v.inserisciVersamentoForm.importo.$dirty) return errors
      !this.$v.inserisciVersamentoForm.importo.required && errors.push('L\'importo è obbligatorio')
      return errors
    },
    mesiValiditaErrors () {
      const errors = []
      if (!this.$v.inserisciVersamentoForm.mesiValidita.$dirty) return errors
      !this.$v.inserisciVersamentoForm.mesiValidita.required && errors.push('Specificare mesi validità')
      return errors
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    formatDateMonth (date) {
      if (!date) return null
      const [year, month] = date.split('-')
      return `${month}/${year}`
    },
    inserisciVersamentoLista () {
      this.$v.inserisciVersamentoForm.$touch()
      if (this.$v.inserisciVersamentoForm.$invalid) return
      const nuovoVersamento = {
        veicolo: this.veicolo,
        dataPagamento: this.inserisciVersamentoForm.dataPagamento,
        importo: this.inserisciVersamentoForm.importo,
        scadenza: this.inserisciVersamentoForm.scadenza,
        validita: this.inserisciVersamentoForm.mesiValidita,
        stato: null
      }
      store.commit(SET_ADD_RESTITUZIONI_TASSA_VEICOLI_VERSAMENTI_ELENCO, nuovoVersamento)
      this.$v.$reset()
      this.inserisciVersamentoForm.mesiValidita = null
      this.inserisciVersamentoForm.dataPagamento = ''
      this.inserisciVersamentoForm.scadenza = ''
      this.inserisciVersamentoForm.importo = null
    }
  },
  async created () {
    store
      .dispatch(BOLLO_PAGO_LIST_VAL_SCADENZA)
      .then(({ data }) => {
        this.listaMesiValidita.push({ text: 'Seleziona', value: null })
        for (let i = 0; i < data.length; i++) {
          this.listaMesiValidita.push({ text: data[i].nome, value: data[i].valore })
        }
      })
      .catch((error) => {
        if (error == null) return
        this.$emit('updateboxerr', {
          title: this.$i18n.t('general.error'),
          message: this.$i18n.t('general.api.errors.service_unavailable')
        })
      })
  }
}
</script>
