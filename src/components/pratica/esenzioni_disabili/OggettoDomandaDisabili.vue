<template>
  <div>
    <div class="space-section" id="oggetto-domanda-disabili">
      <h2>
        {{
          $t("pratica.esenzioni_disabili.oggetto_della_domanda.oggettoDomanda")
        }}
      </h2>
      <div v-if="oggettoDomandaDisabiliRadio == 'primaRichiestaEsenzione'">
        <h6
          v-html="
            $t('pratica.esenzioni_disabili.oggetto_della_domanda.select_a')
          "
        ></h6>
      </div>
      <div v-if="oggettoDomandaDisabiliRadio == 'trasferimentoEsenzione'">
        <h6
          v-html="
            $t('pratica.esenzioni_disabili.oggetto_della_domanda.select_b')
          "
        ></h6>
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
                  $t('pratica.esenzioni_disabili.oggetto_della_domanda.intro')
                "
              />
            </v-col>
          </v-row>
        </v-alert>
        <h6
          v-html="
            $t(
              'pratica.esenzioni_disabili.oggetto_della_domanda.targa_esentato'
            )
          "
        ></h6>
        <p>{{ attributi.trasferimentoEsenzione.targa }}</p>
        <h6
          v-html="
            $t(
              'pratica.esenzioni_disabili.oggetto_della_domanda.targa_esentare'
            )
          "
        ></h6>
        <div
          :class="
            'mt-4 row dl-inline-header text-center bg-ico bg-ico-' +
            attributi.trasferimentoEsenzione.veicolo.tipoVeicolo.codice
          "
        >
          <dl class="col-12 col-md-3">
            <dt>tipo</dt>
            <dd>
              {{
                attributi.trasferimentoEsenzione.veicolo.tipoVeicolo.descrizione
              }}
            </dd>
          </dl>
          <dl class="col-12 col-md-3">
            <dt>targa</dt>
            <dd>
              {{ attributi.trasferimentoEsenzione.veicolo.targa }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OsservazioneService from '@/common/esenzioni.service'
export default {
  name: 'OggettoDomandaDisabili',
  props: {
    attributi: { type: Object, required: true }
  },
  computed: {
    oggettoDomandaDisabiliRadio: function () {
      const oggetto = OsservazioneService.oggettoDomandaDisabili(this.attributi)
      if (oggetto !== '') return oggetto
    }
  }
}
</script>
