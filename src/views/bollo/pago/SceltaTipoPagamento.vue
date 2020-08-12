<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <div class="app-container"
      ref="formContainer">
      <v-card class="card-view-page">
      <div class="app-row inner-cont-alert" />
      <div class="app-row inner-cont-bollo">
        <div class="calcolo-sicuro col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
          <div class="border-cont">
            <v-img
              class="imgHomeServizio"
              width="177"
              :src="require('@/assets/images/ritagli/servizi/pagamenti_online.svg')"
              alt="Scelta pagamenti online"
              fluid
            />
          </div>
        </div>
        <div class="form-cerca-veicolo form-scelta-tipo col-xxl-4 col-md-6 offset-xxl-1">
          <div class="space-section">
            <h2>
              Paga il bollo
            </h2>
            <p>
              Hai ricevuto un avviso di <strong>scadenza</strong> e lo vuoi pagare online?
              Con questo servizio puoi pagare la scadenza dell'anno in corso o i bolli degli anni precedenti, se non li hai pagati.
            </p>
            <p>
              Il calcolo è fatto in tempo reale, se stai pagando in ritardo il bollo è già calcolato con sanzioni e interessi dovuti.
            </p>
            <v-btn
              class="rfs-16"
              type="submit"
              :to="{ name: 'inizia_pagamento'}"
              color="primary"> Paga il bollo
            </v-btn>
          </div>
          <div>
            <h2>
              Paga le rate
            </h2>
            <p>
              Se hai richiesto la <strong>rateizzazione</strong> a seguito di un avviso di <strong>accertamento</strong>, con questo servizio puoi pagare le rate.
            </p>
            <p>
              Gli importi proposti sono quelli del <strong>piano di rateizzazione</strong> inviato dalla Regione.
            </p>
            <v-btn
              class="rfs-16"
              color="primary"
              :to="{ name: 'inizia_pagamento_rate'}"> Paga le rate
            </v-btn>
          </div>
        </div>
      </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import TitoloServizio from '@/components/layout/TitoloServizio'

export default {
  components: { TitoloServizio },
  data () {
    return {
      servizio: 'scelta_tipo_pagamento'
    }
  }
}
</script>
