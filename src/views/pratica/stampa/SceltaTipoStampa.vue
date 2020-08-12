<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <div class="app-container" ref="formContainer">
      <v-card class="card-view-page">
      <div class="app-row inner-cont-bollo">
        <div class="calcolo-sicuro col-xxl-3 col-md-6 offset-xxl-2 mt-8 mt-sm-0">
          <div class="border-cont">
            <v-img
              class="imgHomeServizio"
              width="177"
              :src="require('@/assets/images/ritagli/servizi/stampa_avviso.svg')"
              alt="Scelta pagamenti online"
              fluid
            />
          </div>
        </div>
        <div class="form-cerca-veicolo form-scelta-tipo col-xxl-4 col-md-6 offset-xxl-1">
          <div class="space-section">
            <h2>
              Avviso di scadenza
            </h2>
            <p>
              La stampa della sintesi dell'avviso di scadenza può esssere richiesta nel caso in cui il contribuente riceva l'avviso tramite SMS, e-mail o nel caso in cui l'abbia smarrito.
            </p>
            <p>
              Il servizio riproduce la <strong>sintesi cartacea</strong> dell'avviso con allegato il <strong>bollettino pagoPa</strong>.
            </p>
            <v-btn
              class="rfs-16"
              type="button"
              :to="{ name: 'cerca_stampa_avv_scadenza' }"
              color="primary">
              Stampa avviso di scadenza
            </v-btn>
          </div>
          <div>
            <h2>
              Avviso di accertamento</h2>
            <p>
              La stampa dell'avviso di accertamento può essere richiesta nel caso in cui il contribuente abbia smarrito l'avviso.
            </p>
            <p>
              Il servizo <strong>riproduce l'avviso di accertamento con allegato il bollettino pagoPa.</strong>
            </p>
            <v-btn
              class="rfs-16"
              type="button"
              color="primary"
              :to="{ name: 'cerca_stampa_avv_accertamento' }">
              Stampa avviso di accertamento
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
      servizio: 'scelta_tipo_stampa'
    }
  }
}
</script>
