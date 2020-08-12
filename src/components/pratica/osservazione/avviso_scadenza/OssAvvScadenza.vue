<template>
  <div>
    <div class="space-section" id="osservazioni-avv-scadenza">
      <h2>Osservazioni</h2>
      <div v-if="osservazRadio == 'venduto'">
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.venduto') }} {{ new Date(attributi.venduto.data) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false"
              v-if="attributi.venduto.concessionario">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.venduto_concessionario') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'radiatoDemolizione'">
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.radiato_demolizione') }} {{ new Date(attributi.radiatoDemolizione.data) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'esportato'">
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esportato') }} {{ new Date(attributi.radiato.data) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'esentatoDisabili'">
        <strong>
          {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_disabili') }}
        </strong>
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              Numero protocollo provvedimento: {{ attributi.esenzioni.disabili.protocollo }}
            </v-list-item>
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              Data: {{ new Date(attributi.esenzioni.disabili.del) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'esentatoAltroMotivo'">
        <strong>
          {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_altro_motivo') }}
        </strong>
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              <p v-html="attributi.esenzioni.altroMotivo.testo.replace(/\r?\n/g, '<br />')" />
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'nonDisponibile'">
        <strong>
          {{ $t('pratica.osservazione.avviso_scadenza.motivazione.non_disponibile') }}
        </strong><br>
        {{ $t('pratica.osservazione.avviso_scadenza.motivazione.non_disponibile_desc') }}<br>
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              Dal {{ new Date(attributi.disponibilitaPrivata.dal) | dateFormat('DD/MM/YYYY') }} Al {{ new Date(attributi.disponibilitaPrivata.al) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'maiPosseduto'">
        <strong>
          {{ $t('pratica.osservazione.avviso_scadenza.motivazione.mai_posseduto') }}
        </strong>
      </div>
      <div v-if="osservazRadio == 'trasferitoRegione'">
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.trasferito_regione') }} {{ new Date(attributi.trasferimentoRegione.data) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="osservazRadio == 'esentatoImpianto'">
        <v-list
          class="text-uppercase"
          flat>
          <v-list-item-group
            :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false">
              {{ $t('pratica.osservazione.avviso_scadenza.motivazione.esentato_impianto') }} {{ new Date(attributi.esenzioni.impiantoGplMetano.data) | dateFormat('DD/MM/YYYY') }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <dati-tecnici-rettifica
        v-if="osservazRadio == 'datiVeicoloRettifica'"
        :datiRettifica="attributi.datiVeicoloRettifica"
      />
    </div>
  </div>
</template>

<script>
import OsservazioneService from '@/common/osservazione.service'
import DatiTecniciRettifica from '@/components/pratica/osservazione/DatiTecniciRettifica'

export default {
  name: 'OssAvvScadenza',
  components: { DatiTecniciRettifica },
  props: {
    attributi: { type: Object, required: true }
  },
  data () {
    return {
      osservazRadio: ''
    }
  },
  async created () {
    const attr = this.attributi
    const ossR = await OsservazioneService.motivoOssAvvScadenza(attr)
    this.osservazRadio = (ossR !== 'esentato') ? ossR : await OsservazioneService.tipoEsenzione(attr.esenzioni)
  }
}
</script>
