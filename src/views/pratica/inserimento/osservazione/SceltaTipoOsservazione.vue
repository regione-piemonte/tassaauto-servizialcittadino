<template>
  <div>
    <titolo-servizio
      :servizio="servizio"
    />
    <div class="container" ref="formContainer">
      <div class="row inner-cont-alert">
        <div class="text-intro col-lg-8 offset-lg-2" />
      </div>
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-bollo">
            <div class="calcolo-sicuro col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
              <div class="border-cont">
                <v-img
                  class="imgHomeServizio"
                  width="177"
                  :src="require('@/assets/images/ritagli/servizi/osservazioni.svg')"
                  alt="Scelta pagamenti online"
                  fluid
                />
              </div>
            </div>
            <div class="form-cerca-veicolo form-scelta-tipo col-lg-4 col-md-6 offset-lg-1">
              <div class="space-section">
                <h2>
                  Su avviso di scadenza
                </h2>
                <p>
                  Hai ricevuto un avviso di <strong>scadenza</strong> del bollo ma hai delle segnalazioni da inviare e <strong>vuoi opporti al pagamento</strong>?
                </p>
                <p>
                  Il bollo <strong>non è dovuto</strong>? I dati sono sbagliati?
                </p>
                <v-btn
                  depressed
                  :to="{ name: 'cerca_avviso_scadenza'}"
                  color="primary"
                  class="rfs-16">
                  Fai una osservazione
                </v-btn>
              </div>
              <div v-if="bonarioAttivo" class="space-section">
                <h2>
                  Su avviso bonario
                </h2>
                <p>
                  Hai ricevuto un avviso <strong>bonario</strong> del bollo ma hai delle segnalazioni da inviare e <strong>vuoi opporti al pagamento</strong>?
                </p>
                <p>
                  Hai già pagato? Il pagamento <strong>non è dovuto</strong>?
                </p>
                <v-btn
                  depressed
                  :to="{ name: 'cerca_avviso_bonario'}"
                  color="primary"
                  class="rfs-16">
                  Fai una osservazione
                </v-btn>
              </div>
              <div>
                <h2>
                  Su avviso di accertamento
                </h2>
                <p>
                  Hai ricevuto un avviso di <strong>accertamento</strong> del bollo ma hai delle segnalazioni da inviare e <strong>vuoi opporti al pagamento</strong>?
                </p>
                <p>
                  Hai già pagato? Il pagamento <strong>non è dovuto</strong>?
                </p>
                <v-btn
                  depressed
                  :to="{ name: 'cerca_avviso_accertamento'}"
                  color="primary"
                  class="rfs-16">
                  Fai una osservazione
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
import { servizioAttivo } from '@/common/config'

export default {
  components: { TitoloServizio },
  data () {
    return {
      servizio: 'scelta_tipo_osservazione',
      bonarioAttivo: servizioAttivo('osservazione_avviso_bonario')
    }
  }
}
</script>
