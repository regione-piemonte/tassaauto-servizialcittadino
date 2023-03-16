<template>
  <div>
    <div class="space-section" id="dichiarazioneDisabili">
      <h2>
        {{ $t("pratica.esenzioni_disabili.dichiarazione.dichiarazione") }}
      </h2>
      <v-alert show aria-live="off" type="info" border="left" :icon="false">
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p
              v-html="
                $t('pratica.esenzioni_disabili.dichiarazione.il_sottoscritto')
              "
            />
          </v-col>
        </v-row>
      </v-alert>
      <div v-if="dichR == 'proprietarioDisabile'">
        <h6
          v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_a')"
        ></h6>
        <div
          v-if="dichiarazioneRadio == 'riconosciutoPersonaDisabile'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_aa')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'personaDisabilitaPsichicaMentale'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_ab')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'personaVedenteIpovedente'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_ac')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'invalidoRidotteImpediteCapacitaMotorie'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_ad')"
          ></div>
        </div>
      </div>
      <div v-if="dichR == 'disabileComproprietario'">
        <h6
          v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_b1')"
        ></h6>
        <div v-if="dichiarazioneRadio == 'disabilitaGrave'" class="container">
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_ba')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'disabilitaPsichicaMentale'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_bb')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'disabilitaNonVedenteIpovedente'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_bc')"
          ></div>
        </div>
        <div v-if="dichiarazioneRadio == 'comproprietario'" class="container">
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_bd')"
          ></div>
        </div>
        <strong class="fix-align">
          <div
            v-html="
              $t('pratica.esenzioni_disabili.dichiarazione.CF_familiare_ind')
            "
          ></div>
        </strong>
        <div
          class="text-uppercase"
          v-if="attributi.disabileComproprietario.parentela"
        >
          <div v-for="(item, i) of gradiParentela" :key="i">
            <div
              v-if="
                item.value &&
                item.value.codice ===
                  attributi.disabileComproprietario.parentela
              "
            >
              {{ item.value.descrizione }}
            </div>
          </div>
        </div>
        <div class="text-uppercase">
          {{ attributi.disabileComproprietario.cfFamiliare }}
        </div>
      </div>
      <div v-if="dichR == 'disabileFamiliare'">
        <h6
          v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_b')"
        ></h6>
        <div v-if="dichiarazioneRadio == 'disabilitaGrave'" class="container">
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_ba')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'disabilitaPsichicaMentale'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_bb')"
          ></div>
        </div>
        <div
          v-if="dichiarazioneRadio == 'disabilitaNonVedenteIpovedente'"
          class="container"
        >
          <div
            v-html="$t('pratica.esenzioni_disabili.dichiarazione.select_bc')"
          ></div>
        </div>
        <strong class="fix-align">
          <div
            v-html="
              $t('pratica.esenzioni_disabili.dichiarazione.CF_familiare_ind')
            "
          ></div>
        </strong>
        <div
          class="text-uppercase"
          v-if="attributi.disabileFamiliare.parentela"
        ></div>
        <div v-for="(item, i) of gradiParentela" :key="i">
          <div
            v-if="
              item.value &&
              item.value.codice === attributi.disabileFamiliare.parentela
            "
          >
            {{ item.value.descrizione }}
          </div>
        </div>
        <div class="text-uppercase">
          {{ attributi.disabileFamiliare.cfFamiliare }}
        </div>
      </div>
      <v-alert
        class="mt-5"
        show
        aria-live="off"
        type="info"
        border="left"
        :icon="false"
      >
        <v-row class="pl-6 pl-md-12">
          <v-col cols="12" md="1">
            <v-img
              width="40"
              :src="require(`@/assets/images/icone/alert/info.svg`)"
              :lazy-src="require(`@/assets/images/icone/alert/info.svg`)"
            />
          </v-col>
          <v-col cols="12" md="10" class="bodyAlertDark">
            <p>
              {{ $t("pratica.esenzioni_disabili.dichiarazione.regione_alert") }}
            </p>
          </v-col>
        </v-row>
      </v-alert>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { COMMON_GRADI_PARENTELA } from '@/store/actions.type'
import EsenzioneService from '@/common/esenzioni.service'

export default {
  name: 'DichiarazioneDisabili',
  props: {
    attributi: { type: Object, required: true }
  },
  data () {
    return {
      dichiarazioneRadio: '',
      dichR: ''
    }
  },
  computed: {
    ...mapGetters([
      'gradiParentela'
    ])
  },
  async created () {
    store.dispatch(COMMON_GRADI_PARENTELA)
    const attr = this.attributi
    this.dichR = await EsenzioneService.dichiarazioneDomandaDisabili(attr)
    if (this.dichR === 'proprietarioDisabile') {
      this.dichiarazioneRadio = await EsenzioneService.dichiarazioneProprietarioDomandaDisabili(attr.proprietarioDisabile)
      return this.dichiarazioneRadio
    }
    if (this.dichR === 'disabileFamiliare') {
      this.dichiarazioneRadio = await EsenzioneService.dichiarazioneDisabileFamiliareDomandaDisabili(attr.disabileFamiliare)
      return this.dichiarazioneRadio
    }
    if (this.dichR === 'disabileComproprietario') {
      this.dichiarazioneRadio = await EsenzioneService.dichiarazioneDisabileComproprietarioDomandaDisabili(attr.disabileComproprietario)
      return this.dichiarazioneRadio
    }
  }
}
</script>
