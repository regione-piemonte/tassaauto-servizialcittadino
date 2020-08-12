<template>
  <div id="datiVeicoloRettifica">
    <strong>
      {{ $t('pratica.osservazione.motivazione.dati_veicolo_rettifica') }}
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
          {{ $t('pratica.osservazione.dati_veicolo.tipo') }}: <span v-if="datiRettifica.tipoVeicolo !== null && datiRettifica.tipoVeicolo.descrizione !== ''">{{ datiRettifica.tipoVeicolo.descrizione }}</span><span v-else>Non specificata</span>
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.targa') }}: {{ datiRettifica.targa }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.kw') }}: {{ datiRettifica.kw }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.catEuro') }}: <span v-if="datiRettifica.catEuro !== null && datiRettifica.catEuro.descrizione !== ''">{{ datiRettifica.catEuro.descrizione }}</span><span v-else>Non specificata</span>
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.emissCo2') }}: {{ datiRettifica.emissCo2 }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.alimentazione') }}: <span v-if="datiRettifica.alimentazione !== null && datiRettifica.alimentazione.descrizione !== ''">{{ datiRettifica.alimentazione.descrizione }}</span><span v-else>Non specificata</span>
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.peso') }}: {{ datiRettifica.peso }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.peso') }}: {{ datiRettifica.peso }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.assi') }}: {{ datiRettifica.assi }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.portata') }}: {{ datiRettifica.portata }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.numPosti') }}: {{ datiRettifica.numPosti }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.rim') }}: {{ datiRettifica.rimorchio | convertBooleanToString }}
        </v-list-item>
        <v-list-item
          id=""
          :inactive="true"
          :ripple="false">
          {{ $t('pratica.osservazione.dati_veicolo.sp') }}: {{ datiRettifica.sp | convertBooleanToString }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'DatiTecniciRettifica',
  props: {
    datiRettifica: { type: Object, required: true }
  }
}
</script>
