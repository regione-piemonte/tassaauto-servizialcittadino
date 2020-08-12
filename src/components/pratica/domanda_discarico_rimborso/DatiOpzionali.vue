<template>
  <div>
    <div class="row">
      <div class="col-12">
        <strong class="fix-align">Data di notificazione</strong>
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
              <p v-html="descrDataNotificazione" />
            </v-col>
          </v-row>
        </v-alert>
        <v-menu
          v-model="dataNotificaPicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="computedDateFormatted"
              id="dataNotifica"
              append-icon="event"
              readonly
              v-on="on"
              :error-messages="dataNotificaErrors"
              :error-count="1"
            ></v-text-field>
          </template>
          <v-date-picker v-model="datOpzForm.dataNotifica" no-title @input="dataNotificaPicker = false" locale="it-IT"></v-date-picker>
        </v-menu>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <strong class="fix-align">Importo totale in riscossione</strong>
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
              <p v-html="descrImportoRiscossione" />
            </v-col>
          </v-row>
        </v-alert>
        <v-text-field
          clearable
          clear-icon="mdi-close-circle"
          id="totaleRiscossione"
          type="text"
          v-model="datOpzForm.importoTotaleRiscossione"
          :maxLength="$v.datOpzForm.importoTotaleRiscossione.$params.maxValue.max"
          :error-messages="totaleRiscossioneErrors"
          autocomplete="off"
          :error-count="2"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { decimal, minValue, maxValue } from 'vuelidate/lib/validators'
import { notFutureDate } from '@/validators/bolloweb.validator'

export default {
  name: 'DatiOpzionali',
  props: {
    pDataNotif: { type: String, required: false },
    pImportoTotRiscos: { type: Number, required: false },
    pIngiunzFiscaleTab: { type: Boolean, required: true }
  },
  data () {
    return {
      datOpzForm: {
        dataNotifica: this.pDataNotif,
        importoTotaleRiscossione: this.pImportoTotRiscos
      },
      date: null,
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      dataNotificaPicker: false
    }
  },
  computed: {
    descrDataNotificazione: function () {
      const warnLabel = '<strong>Attenzione</strong>:  Dato opzionale.<br>'
      if (this.pIngiunzFiscaleTab) return warnLabel + 'La data di notificazione dell\'ingiunzione è nell\'ultima pagina, in alto a sinistra nello spazio apposito.'
      return warnLabel + 'La data di notificazione della cartella è nella pagina specifica, in alto a sinistra nello spazio apposito.'
    },
    descrImportoRiscossione: function () {
      const warnLabel = '<strong>Attenzione</strong>:  Dato opzionale.<br>'
      if (this.pIngiunzFiscaleTab) return warnLabel + 'L\'importo totale in riscossione è sotto la voce <strong>DETTAGLIO DEGLI ADDEBITI</strong>, alla riga TOTALE DA PAGARE per l\'ingiunzione.'
      return warnLabel + 'L\'importo totale in riscossione è sotto la voce <strong>DETTAGLIO DEGLI ADDEBITI</strong>, alla riga TOTALE, prima colonna, per la cartella.'
    },
    totaleRiscossioneErrors () {
      const errors = []
      if (!this.$v.datOpzForm.importoTotaleRiscossione.$dirty) return errors
      !this.$v.datOpzForm.importoTotaleRiscossione.decimal && errors.push('L\'importo totale in riscossione deve essere un numero decimale (ad es. 10.50).')
      !this.$v.datOpzForm.importoTotaleRiscossione.maxValue && errors.push('L\'importo totale in riscossione deve essere un numero decimale compreso fra ' + this.$v.datOpzForm.importoTotaleRiscossione.$params.minValue.min + ' e ' + this.$v.datOpzForm.importoTotaleRiscossione.$params.maxValue.max)
      return errors
    },
    dataNotificaErrors () {
      const errors = []
      if (!this.$v.datOpzForm.dataNotifica.$dirty) return errors
      !this.$v.datOpzForm.dataNotifica.notFutureDate && errors.push('La data di notificazione non può essere futura.')
      return errors
    },
    computedDateFormatted () {
      return this.formatDate(this.datOpzForm.dataNotifica)
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    datOpzForm: {
      dataNotifica: {
        notFutureDate
      },
      importoTotaleRiscossione: {
        decimal,
        minValue: minValue(0),
        maxValue: maxValue(1000000.00)
      }
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    getDataImportoTot () {
      const datiOpz = { }
      if (this.datOpzForm.dataNotifica !== null && this.datOpzForm.dataNotifica !== '') {
        datiOpz.dataNotifica = this.datOpzForm.dataNotifica
      }
      if (this.datOpzForm.importoTotaleRiscossione !== null && this.datOpzForm.importoTotaleRiscossione !== '' && this.datOpzForm.importoTotaleRiscossione > 0) {
        datiOpz.importoTotaleRiscossione = this.datOpzForm.importoTotaleRiscossione
      }
      return datiOpz
    }
  }
}
</script>
