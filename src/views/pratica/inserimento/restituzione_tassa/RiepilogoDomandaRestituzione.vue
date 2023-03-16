<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2 justify-content-center">
            <Wizard :servizio="'restituzione_tassa'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <DatiAnagraficiIntestatario
              :denominazione="
                contribuenteRestituzione.nome +
                ' ' +
                contribuenteRestituzione.cognome
              "
              :codiceFiscale="contribuenteRestituzione.codiceFiscale"
              :provinciaNascita="contribuenteRestituzione.provinciaNascita"
              :comuneNascita="contribuenteRestituzione.comuneNascita"
              :email="contribuenteRestituzione.mail"
              :sesso="contribuenteRestituzione.sesso"
              :personaFisica="contribuenteRestituzione.personaFisica"
              tipoDatiAnagrafici="contribuente"
            />
            <DatiIndirizzoIntestatario
              :indirizzo="contribuenteRestituzione.indirizzo"
              :comune="contribuenteRestituzione.descComune"
              :provincia="contribuenteRestituzione.provincia"
              :cap="contribuenteRestituzione.cap"
              tipoDatiAnagrafici="contribuente"
            />
            <v-form
              @submit.prevent="inviaDomandaRestituzioneTassa"
              class="multiple-inline-form"
              enctype="multipart/form-data"
            >
              <OggettoDomandaRichiestaRestituzione
                :attributi="oggettoDomandaRestituzione"
              />
              <DatiVeicoloVersamentiRestituzione
                :veicolo="
                  datiVeicoloVersamentiRestituzione.versamentoErrato.checked
                    ? datiVeicoloVersamentiRestituzione.versamentoErrato.veicolo
                    : datiVeicoloVersamentiRestituzione.veicoloNonPresente
                "
                :riepilogo="true"
              />
              <ModalitaRestituzione :attributi="modalitaRestituzione" />
              <div class="space-section">
                <h2>{{ $t("general.box_titles.allegati") }}</h2>
                <div v-if="restituzioniTassaAllegati.length === 0">
                  {{ $t("general.messages.zero_allegati") }}
                </div>
                <div v-else>
                  <ul class="border-list">
                    <li
                      v-for="(item, index) in restituzioniTassaAllegati"
                      :key="index"
                    >
                      <a
                        href="#"
                        v-on:click="
                          scaricaAllegato(item.identificativoArchivio)
                        "
                        >{{ item.nomeAllegato }}</a
                      >
                    </li>
                  </ul>
                </div>
                <div class="error" v-if="downloadFileError !== null">
                  {{ downloadFileError }}
                </div>
              </div>
              <DichiarazioneSostitutiva ref="dichiarazioneSostitutiva" :isChecked="true" :text="'DICH_SOST_NOT'" />
              <RiferimentiPratica
                ref="rifPratica"
                v-on:bloccainvioosservazione="
                  inviaDomandaEsenzioneDisabled = true
                "
                :errorMsgPratica = detailError.fieldError
                @resetMsgErrorsPage="removeMsg"
              />
              <div class="action-button-wide row">
                <v-col class="col-md-6">
                  <BtnBack
                    :backUrl="'inserimento_domanda_restituzione'"
                    :backType="'back'"
                  />
                </v-col>
                <v-col class="col-md-6 text-right">
                  <v-btn
                    depressed
                    id="btnInvioDomandaRestituzione"
                    aria-label="invia la domanda di restituzione"
                    type="submit"
                    color="primary"
                    @click.prevent="inviaDomandaRestituzioneTassa"
                    :disabled="inviaDomandaEsenzioneDisabled"
                    >Avanti</v-btn
                  >
                </v-col>
              </div>
            </v-form>
          </div>
        </div>
      </v-card>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>
<script>
import ApiError from '@/common/api.error'
import { mapGetters } from 'vuex'
import { RESTITUZIONI_TASSA_CREA, RESTITUZIONI_TASSA_CONTRIBUENTI } from '@/store/actions.type'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import NavigatorService from '@/common/navigator.service'
import store from '@/store'
import BoxErrore from '@/components/BoxErrore'
import { emailAttiva, smsAttivo } from '@/common/config'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import DatiVeicoloVersamentiRestituzione from '@/components/pratica/restituzione_tassa/DatiVeicoloVersamentiRestituzione'
import OggettoDomandaRichiestaRestituzione from '@/components/pratica/restituzione_tassa/OggettoDomandaRichiestaRestituzione'
import ModalitaRestituzione from '@/components/pratica/restituzione_tassa/ModalitaRestituzione'
import Spinner from '@/components/layout/Spinner'
import Wizard from '@/components/layout/Wizard'
import BtnBack from '@/components/layout/btn/BtnBack'
import { validationMixin } from 'vuelidate'
import { saveAs } from 'file-saver'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'

export default {
  components: {
    BoxErrore,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    Wizard,
    Spinner,
    RiferimentiPratica,
    DatiVeicoloVersamentiRestituzione,
    OggettoDomandaRichiestaRestituzione,
    ModalitaRestituzione,
    DichiarazioneSostitutiva
  },
  data () {
    return {
      inviaDomandaEsenzioneDisabled: false,
      downloadFileError: null,
      detailError: { message: '', title: '', fieldError: null },
      overlay: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
  },
  computed: {
    ...mapGetters([
      'restituzioniTassa',
      'restituzioniTassaAllegati',
      'contribuenteRestituzione',
      'oggettoDomandaRestituzione',
      'modalitaRestituzione',
      'datiVeicoloVersamentiRestituzione',
      'elencoVeicoliVersamenti',
      'userIdentity'
    ])
  },
  methods: {
    removeMsg (params) {
      if (params === true) {
        this.resetErrori()
      }
    },
    inviaDomandaRestituzioneTassa () {
      this.detailError = { message: '', title: '', fieldError: null }
      this.$refs.rifPratica.iniziaValidazione()
      this.$refs.rifPratica.$v.rifForm.$touch()
      if (this.$refs.rifPratica.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return
      for (let i = 0; i < this.restituzioniTassa.versamenti.length; i++) {
        delete this.elencoVeicoliVersamenti[i].index
      }
      this.restituzioniTassa.allegati.forEach(function (v) { delete v.upFile })
      const { valueName, ...datiVeicoloVersamenti } = this.restituzioniTassa.datiVeicoloVersamenti
      const requestInserisciDomandaEsenzione = {
        ...this.restituzioniTassa,
        datiVeicoloVersamenti
      }
      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) requestInserisciDomandaEsenzione.email = rifObj.email.toLowerCase()
      if (smsAttivo()) requestInserisciDomandaEsenzione.telefono = rifObj.telefono
      this.overlay = true
      store
        .dispatch(RESTITUZIONI_TASSA_CREA, requestInserisciDomandaEsenzione)
        .then(() => {
          this.overlay = false
          store.state.restituzionetassa.restituzioniTassaAllegati = []
          this.$router.push(
            { name: 'esito_domanda_restituzione' }
          )
        })
        .catch((error) => {
          this.overlay = false
          if (error == null) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          const noSentDom = 'Domanda non inviata, '
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: noSentDom + 'domanda non trovata.'
            }
          } else if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: noSentDom + error.response.data.title
            }
          } else if (error.response.status === 409 || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: noSentDom + error.response.data.title
            }
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.pratica_invalid'),
              fieldError: ApiError.serverValidationErrors(error.response.data.detail)
            }
          }
        })
    },
    resetErrori () {
      this.detailError = { message: '', title: '', fieldError: null }
    },
    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.restituzioniTassaAllegati.find(p => (p.identificativoArchivio === idAllegato))
      if (attach === undefined) {
        this.downloadFileError = 'Impossibile scaricare il documento allegato.'
        return
      }
      saveAs(attach.upFile, attach.nomeAllegato)
    },
    mailTelefonoVuoti () {
      if ((this.rifForm.email == null || this.rifForm.email === '') &&
        (this.rifForm.telefono == null || this.rifForm.telefono === '')) return true
      return false
    }
  },
  async created () {
    store.dispatch(RESTITUZIONI_TASSA_CONTRIBUENTI, this.userIdentity.cf)
  }
}
</script>

<style>
</style>
