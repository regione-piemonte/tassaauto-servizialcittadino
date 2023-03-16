<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <div class="container" ref="formContainer">
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-bollo">
            <div
              class="calcolo-sicuro col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0"
            >
              <div class="border-cont">
                <v-img
                  class="imgHomeServizio"
                  width="177"
                  :src="
                    require('@/assets/images/ritagli/servizi/stampa_avviso.svg')
                  "
                  alt="Scelta pagamenti online"
                  fluid
                />
              </div>
            </div>
            <div
              class="form-cerca-veicolo form-scelta-tipo col-lg-4 col-md-6 offset-lg-1"
            >
              <div class="space-section">
                <h2>Avviso di scadenza</h2>
                <p>
                  La stampa della sintesi dell'avviso di scadenza può essere
                  richiesta nel caso in cui il contribuente riceva l'avviso
                  tramite SMS, e-mail o nel caso in cui l'abbia smarrito.
                </p>
                <p>
                  Il servizio riproduce la
                  <strong>sintesi cartacea</strong> dell'avviso con allegato il
                  <strong>bollettino pagoPa</strong>.
                </p>
                <v-btn
                  depressed
                  class="rfs-16"
                  type="button"
                  aria-label="ricerca l'avviso di scadenza"
                  :to="{ name: 'cerca_stampa_avv_scadenza' }"
                  color="primary"
                >
                  Stampa avviso di scadenza
                </v-btn>
              </div>
              <div class="space-section">
                <h2>Avviso di accertamento</h2>
                <p>
                  La stampa dell'avviso di accertamento di un bollo auto <strong>con anno di pagamento fino al  2019 compreso</strong> può essere richiesta nel
                  caso in cui il contribuente abbia smarrito l'avviso.
                </p>
                <p>
                  Il servizio
                  <strong
                    >riproduce l'avviso di accertamento con allegato il
                    bollettino pagoPa.</strong
                  >
                </p>
                <v-btn
                  depressed
                  class="rfs-16"
                  type="button"
                  aria-label="ricerca l'avviso di accertamento"
                  color="primary"
                  :to="{ name: 'cerca_stampa_avv_accertamento' }"
                >
                  Stampa avviso di accertamento
                </v-btn>
              </div>
              <div>
                <h2>Piano di rateizzazione concesso dalla Regione (e non da Soris S.p.A.!)</h2>
                <p>I bollettini di pagamento dovranno essere stampati solo se non risultano pagati.</p>
                <p>
                  La stampa del piano di rateizzazione può essere richiesta nel
                  caso in cui il contribuente abbia smarrito il piano di
                  rateizzazione o i bollettini di pagamento.<br />La stampa può
                  essere richiesta specificando<br />
                  <strong>n.° riferimento del piano/anno e codice fiscale.</strong>
                </p>
                <v-btn
                  depressed
                  class="rfs-16"
                  aria-label="ricerca il piano di rateizzazione"
                  type="button"
                  color="primary"
                  :to="{ name: 'cerca_stampa_piano_rateizzazione' }"
                >
                  Stampa piano di rateizzazione
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
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
