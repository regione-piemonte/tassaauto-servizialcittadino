<template>
  <div>
    <div class="space-section">
      <h2>Osservazioni</h2>
      <!-- pagato -->
      <div id="pagamentiCorretti" v-if="osservazRadio == 'pagamentiCorretti'">
        {{
          $t(
            "pratica.osservazione.avviso_accertamento.motivazione.pagamentiCorretti"
          )
        }}
      </div>
      <div id="targaErrata" v-if="osservazRadio == 'targaErrata'">
        {{
          $t("pratica.osservazione.avviso_accertamento.motivazione.targaErrata")
        }}
      </div>
      <div id="scadenzaErrata" v-if="osservazRadio == 'scadenzaErrata'">
        {{
          $t(
            "pratica.osservazione.avviso_accertamento.motivazione.scadenzaErrata"
          )
        }}
      </div>
      <div id="veicoloRitargato" v-if="osservazRadio == 'veicoloRitargato'">
        {{
          $t(
            "pratica.osservazione.avviso_accertamento.motivazione.veicoloRitargato"
          )
        }}
      </div>
      <div
        id="pagamentoAltraRegioneProvincia"
        v-if="osservazRadio == 'pagamentoAltraRegioneProvincia'"
      >
        {{
          $t(
            "pratica.osservazione.avviso_accertamento.motivazione.pagamentoAltraRegioneProvincia"
          )
        }}
      </div>
      <div
        id="scadenzaErrata"
        v-if="grigliaAccPagato !== null && grigliaAccPagato !== undefined"
      >
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false"
              v-if="grigliaAccPagato.numeroQuietanza !== null"
            >
              N° Quietanza (Ricevuta): {{ grigliaAccPagato.numeroQuietanza }}
            </v-list-item>
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false"
              v-if="grigliaAccPagato.dataPagamento !== null"
            >
              Data del Pagamento:
              {{
                new Date(grigliaAccPagato.dataPagamento)
                  | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false"
              v-if="grigliaAccPagato.ufficioAccettante !== null"
            >
              Ufficio accettante: {{ grigliaAccPagato.ufficioAccettante }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <!-- fine pagato -->
      <!-- inizio non pagato -->
      <div id="venduto" v-if="osservazRadio == 'venduto'">
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                $t(
                  "pratica.osservazione.avviso_accertamento.motivazione.venduto"
                )
              }}
              {{
                new Date(grigliaAccNonPagato.grigliaVenditaVeicolo.data)
                  | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
            <v-list-item
              id=""
              :inactive="true"
              :ripple="false"
              v-if="grigliaAccNonPagato.grigliaVenditaVeicolo.concessionario"
            >
              {{
                $t(
                  "pratica.osservazione.avviso_accertamento.motivazione.venduto_concessionario"
                )
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div id="radiatoDemolizione" v-if="osservazRadio == 'radiatoDemolizione'">
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                $t(
                  "pratica.osservazione.avviso_accertamento.motivazione.radiato_demolizione"
                )
              }}
              {{
                new Date(grigliaAccNonPagato.grigliaRadiatoDemolizione.data)
                  | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div id="esportato" v-if="osservazRadio == 'esportato'">
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                $t(
                  "pratica.osservazione.avviso_accertamento.motivazione.esportato"
                )
              }}
              {{
                new Date(grigliaAccNonPagato.grigliaRadiatoEsportazione.data)
                  | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div
        id="esentatoDisabili"
        v-if="osservazRadioEsent == 'esentatoDisabili'"
      >
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.esentato_disabili"
            )
          }}
        </strong>
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              Numero protocollo provvedimento:
              {{
                grigliaAccNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili
                  .numeroProtocolloProvvedimento
              }}
            </v-list-item>
            <v-list-item id="" :inactive="true" :ripple="false">
              Data:
              {{
                new Date(
                  grigliaAccNonPagato.grigliaEsenzioni.grigliaEsenzioniDisabili.data
                ) | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div
        id="esentatoAltroMotivo"
        v-if="osservazRadioEsent == 'esentatoAltroMotivo'"
      >
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.motivo_generico"
            )
          }}
        </strong>
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              Motivazione:
              {{
                grigliaAccNonPagato.grigliaEsenzioni.grigliaEsenzioniAltroMotivo
                  .testo
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div id="nonDisponibile" v-if="osservazRadio == 'nonDisponibile'">
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.non_disponibile"
            )
          }} </strong
        ><br />
        {{
          $t(
            "pratica.osservazione.avviso_accertamento.motivazione.non_disponibile_desc"
          )
        }}<br />
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              Dal
              {{
                new Date(
                  grigliaAccNonPagato.grigliaPrivazioneDisponibilita.dataDal
                ) | dateFormat("DD/MM/YYYY")
              }}
              <div v-if="grigliaAccNonPagato.grigliaPrivazioneDisponibilita.dataAl!= null && grigliaAccNonPagato.grigliaPrivazioneDisponibilita.dataAl != ''">
                &ensp;Al
                {{
                  new Date(
                    grigliaAccNonPagato.grigliaPrivazioneDisponibilita.dataAl
                  ) | dateFormat("DD/MM/YYYY")
                }}
              </div>
            </v-list-item>
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                grigliaAccNonPagato.grigliaPrivazioneDisponibilita.motivazione
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div id="maiPosseduto" v-if="osservazRadio == 'maiPosseduto'">
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.mai_posseduto"
            )
          }}
        </strong>
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true">
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                grigliaAccNonPagato.grigliaVeicoloMaiPosseduto.datiAggiuntivi
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div id="trasferitoRegione" v-if="osservazRadio == 'trasferitoRegione'">
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.trasferito_regione"
            )
          }}
        </strong>
        {{
          new Date(grigliaAccNonPagato.grigliaTrasferimentoRegione.data)
            | dateFormat("DD/MM/YYYY")
        }}
      </div>
      <div
        id="esentatoImpianto"
        v-if="osservazRadioEsent == 'esentatoImpianto'"
      >
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true" aria-label="osservazioni scadenza esenzioni impianto">
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                $t(
                  "pratica.osservazione.avviso_accertamento.motivazione.esentato_impianto"
                )
              }}
              {{
                new Date(
                  grigliaAccNonPagato.grigliaEsenzioni.grigliaInstallazioneGplMetano.data
                ) | dateFormat("DD/MM/YYYY")
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div
        id="competevaAltroSoggetto"
        v-if="osservazRadio == 'competevaAltroSoggetto'"
      >
        <v-list class="text-uppercase" flat>
          <v-list-item-group :no-action="true" aria-label="osservazioni scadenza competeva ad altro soggetto">
            <v-list-item id="" :inactive="true" :ripple="false">
              <strong>
                {{
                  $t(
                    "pratica.osservazione.avviso_accertamento.motivazione.competeva_altro_soggetto"
                  )
                }}
              </strong>
            </v-list-item>
            <v-list-item id="" :inactive="true" :ripple="false">
              {{
                grigliaAccNonPagato.grigliaCompetevaAltroSoggetto.motivazione
              }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <!-- fine non pagato -->
      <!-- inizio altro -->
      <div id="dirittoRiduzione" v-if="osservazRadio == 'dirittoRiduzione'">
        <strong>
          {{
            $t(
              "pratica.osservazione.avviso_accertamento.motivazione.diritto_riduzione"
            )
          }}
        </strong>
        <p>{{ grigliaAccAltroMotivo.grigliaDirittoRiduzione.testo }}</p>
      </div>
      <dati-tecnici-rettifica
        v-if="osservazRadio == 'datiVeicoloRettifica'"
        :datiRettifica="grigliaAccAltroMotivo.grigliaDatiTecniciErrati"
      />
      <!-- fine altro -->
    </div>
  </div>
</template>

<script>
import OsservazioneService from '@/common/osservazione.service'
import DatiTecniciRettifica from '@/components/pratica/osservazione/DatiTecniciRettifica'
import { mapGetters } from 'vuex'
export default {
  name: 'OssAvvAccertamento',
  components: { DatiTecniciRettifica },
  props: {
    grigliaAccPagato: {
      type: Object,
      required: false
    },
    grigliaAccNonPagato: {
      type: Object,
      required: false
    },
    grigliaAccAltroMotivo: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      osservazRadioEsent: ''
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'listaAvvisiAccAuth',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    osservazRadio: function () {
      const pagato = OsservazioneService.motivoOssAvvAccPagato(this.grigliaAccPagato)
      if (pagato !== '') return pagato
      const nonPagato = OsservazioneService.motivoOssAvvAccNonPagato(this.grigliaAccNonPagato)
      if (nonPagato !== '') return nonPagato
      const altro = OsservazioneService.motivoOssAvvAccAltroMotivo(this.grigliaAccAltroMotivo)
      if (altro !== '') return altro
    },
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    }
  },
  async created () {
    if (this.osservazRadio === 'esentato') {
      this.osservazRadioEsent = await OsservazioneService.tipoEsenzioneAcc(this.grigliaAccNonPagato.grigliaEsenzioni)
      return this.osservazRadioEsent
    }
  }
}
</script>
