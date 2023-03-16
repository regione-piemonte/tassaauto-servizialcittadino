<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <div class="container" ref="formContainer">
      <div class="col-lg-10 mx-lg-auto">
        <v-card class="card-view-page">
          <div class="row inner-cont-alert">
            <div class="text-intro col-lg-8 offset-lg-2 col-12">
              <v-alert
                class="w-100"
                border="left"
                type="error"
                aria-relevant="all"
                :icon="false"
                show>
                <v-row class="pl-6 pl-md-12">
                  <v-col cols="12" md="1">
                    <v-img
                      width="40"
                      :src="require(`@/assets/images/icone/alert/alert.svg`)"
                      :lazy-src="require(`@/assets/images/icone/alert/alert.svg`)"/>
                  </v-col>
                  <v-col cols="12" md="10">
                    <strong>Questo può dipendere:</strong>
                    <ul class="pl-0">
                      <li>da un link esterno non aggiornato</li>
                      <li>da un cambio d'indirizzo della pagina</li>
                      <li>da un indirizzo scritto in maniera errata </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-alert>
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
      servizio: 'not_found'
    }
  }
}
</script>
