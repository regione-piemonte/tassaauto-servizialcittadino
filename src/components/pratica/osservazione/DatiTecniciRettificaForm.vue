<template>
  <div class="row">
    <strong class="fix-align col-12">
      {{ $t('pratica.osservazione.motivazione.dati_veicolo_rettifica') }}
    </strong>
    <div class="col-md-6">
      <v-select
        id="tipoVeicolo"
        :items="veicoloListaFiltrata"
        :label="$t('pratica.osservazione.dati_veicolo.tipo')"
        v-model="pDatiTecnici.tipoVeicolo.codice"
        :disabled="pDatiTecniciDisabled">
      </v-select>
    </div>
    <div class="col-md-3">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.targa')"
        id="targa"
        type="text"
        v-model="pDatiTecnici.targa"
        autocomplete="off"
        :maxlength="targaMaxLength"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-3">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.kw')"
        id="kw"
        type="text"
        v-model="pDatiTecnici.kw"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-6">
      <v-select
        :label="$t('pratica.osservazione.dati_veicolo.catEuro')"
        id="catEuro"
        :items="veicoloCategoriaEuro"
        v-model="pDatiTecnici.catEuro.codice"
        :disabled="pDatiTecniciDisabled">
      </v-select>
    </div>
    <div class="col-md-6">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.emissCo2')"
        id="emissCo2"
        type="text"
        v-model="pDatiTecnici.emissCo2"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-6">
      <v-select
        id="alimentazione"
        :items="veicoloCombustibili"
        :label="$t('pratica.osservazione.dati_veicolo.alimentazione')"
        v-model="pDatiTecnici.alimentazione.codice"
        :disabled="pDatiTecniciDisabled">
      </v-select>
    </div>
    <div class="col-md-6">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.peso')"
        id="peso"
        type="text"
        v-model="pDatiTecnici.peso"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-3">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.assi')"
        id="assi"
        type="text"
        v-model="pDatiTecnici.assi"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-3">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.portata')"
        id="portata"
        type="text"
        v-model="pDatiTecnici.portata"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <div class="col-md-3">
      <v-text-field
        clearable
        clear-icon="mdi-close-circle"
        :label="$t('pratica.osservazione.dati_veicolo.numPosti')"
        id="numPosti"
        type="text"
        v-model="pDatiTecnici.numPosti"
        autocomplete="off"
        :disabled="pDatiTecniciDisabled"
      ></v-text-field>
    </div>
    <v-row>
      <v-col cols="auto">
        <v-checkbox
          id="rimorchio"
          v-model="pDatiTecnici.rimorchio"
          :disabled="pDatiTecniciDisabled"
          :label="this.$i18n.t('pratica.osservazione.dati_veicolo.rim')">
        </v-checkbox>
      </v-col>
      <v-col cols="auto">
        <v-checkbox
          id="sp"
          v-model="pDatiTecnici.sp"
          :disabled="pDatiTecniciDisabled"
          :label="this.$i18n.t('pratica.osservazione.dati_veicolo.sp')">
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TARGA_MAX_LENGTH } from '@/common/config'

export default {
  name: 'DatiTecniciRettificaForm',
  props: {
    pDatiTecnici: { type: Object, required: true },
    pDatiTecniciDisabled: { type: Boolean, required: true }
  },
  data () {
    return {
      targaMaxLength: TARGA_MAX_LENGTH
    }
  },
  computed: {
    ...mapGetters([
      'veicoloCategoriaEuro',
      'veicoloCombustibili',
      'veicoloListaFiltrata'
    ])
  },
  methods: {
    getDatiTecniciRettificati () {
      if (this.pDatiTecnici.tipoVeicolo.codice !== null) {
        this.pDatiTecnici.tipoVeicolo.descrizione =
          this.veicoloListaFiltrata.find(
            p => (p.value === this.pDatiTecnici.tipoVeicolo.codice)).text
      }

      if (this.pDatiTecnici.catEuro.codice !== null) {
        this.pDatiTecnici.catEuro.descrizione =
          this.veicoloCategoriaEuro.find(
            p => (p.value === this.pDatiTecnici.catEuro.codice)).text
      }

      if (this.pDatiTecnici.alimentazione.codice !== null) {
        this.pDatiTecnici.alimentazione.descrizione =
          this.veicoloCombustibili.find(
            p => (p.value === this.pDatiTecnici.alimentazione.codice)).text
      }
      return this.pDatiTecnici
    }
  }
}
</script>
