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
            <Wizard :servizio="'esenzioni_disabili'" :stepAttivo="1" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <DatiAnagraficiIntestatario
              :denominazione="contribuente.nome + ' ' + contribuente.cognome"
              :codiceFiscale="contribuente.codiceFiscale"
              :provinciaNascita="contribuente.provinciaNascita"
              :comuneNascita="contribuente.comuneNascita"
              :email="contribuente.mail"
              :sesso="contribuente.sesso"
              :personaFisica="contribuente.personaFisica"
              tipoDatiAnagrafici="contribuente"
            />
            <DatiIndirizzoIntestatario
              :indirizzo="contribuente.indirizzo"
              :comune="contribuente.descComune"
              :provincia="contribuente.provincia"
              :cap="contribuente.cap"
              tipoDatiAnagrafici="contribuente"
            />
            <v-form
              @submit.prevent="inviaDomandaEsenzioniDisabili"
              class="multiple-inline-form"
              enctype="multipart/form-data"
            >
              <OggettoDomandaDisabili :attributi="oggettoDomanda" />
              <DichiarazioneDisabili :attributi="dichiarazione" />
              <VeicoloEsentare
                :veicolo="
                  oggettoDomanda.primaRichiestaEsenzione.checked
                    ? oggettoDomanda.primaRichiestaEsenzione.veicolo
                    : oggettoDomanda.trasferimentoEsenzione.veicolo
                "
              />
              <div class="space-section">
                <h2>{{ $t("general.box_titles.allegati") }}</h2>
                <div v-if="esenzioniDisabiliAllegati.length === 0">
                  {{ $t("general.messages.zero_allegati") }}
                </div>
                <div v-else>
                  <ul class="border-list">
                    <li
                      v-for="(item, index) in esenzioniDisabiliAllegati"
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
              <DichiarazioneSostitutiva ref="dichiarazioneSostitutiva" :isChecked="true" :text="'DICH_SOST_CERT'" />
              <RiferimentiPratica
                ref="rifPratica"
                v-on:bloccainvioosservazione="inviaDomandaEsenzioneDisabled = true"
                :errorMsgPratica = detailError.fieldError
                @resetMsgErrorsPage="removeMsg"
              />
              <div class="action-button-wide row">
                <v-col class="col-md-6">
                  <BtnBack
                    :backUrl="'inserimento_domanda_esenzione'"
                    :backType="'back'"
                  />
                </v-col>
                <v-col class="col-md-6 text-right">
                  <v-btn
                    id="btnInvioDomandaEsenzione"
                    type="submit"
                    depressed
                    color="primary"
                    @click.prevent="inviaDomandaEsenzioniDisabili"
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
    <Spinner :pOverlay="overlay" />
  </div>
</template>
<script>
import ApiError from '@/common/api.error'
import BoxErrore from '@/components/BoxErrore'
import BtnBack from '@/components/layout/btn/BtnBack'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiIndirizzoIntestatario from '@/components/DatiIndirizzoIntestatario'
import DichiarazioneDisabili from '@/components/pratica/esenzioni_disabili/DichiarazioneDisabili'
import DichiarazioneSostitutiva from '@/components/pratica/DichiarazioneSostitutiva'
import NavigatorService from '@/common/navigator.service'
import OggettoDomandaDisabili from '@/components/pratica/esenzioni_disabili/OggettoDomandaDisabili'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import Spinner from '@/components/layout/Spinner'
import VeicoloEsentare from '@/components/pratica/esenzioni_disabili/VeicoloEsentare'
import Wizard from '@/components/layout/Wizard'
import store from '@/store'
import { ESENZIONI_DISABILI_CREA, ESENZIONI_DISABILI_CONTRIBUENTI } from '@/store/actions.type'
import { emailAttiva, smsAttivo } from '@/common/config'
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    BoxErrore,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiIndirizzoIntestatario,
    DichiarazioneDisabili,
    DichiarazioneSostitutiva,
    OggettoDomandaDisabili,
    RiferimentiPratica,
    Spinner,
    VeicoloEsentare,
    Wizard
  },
  data () {
    return {
      inviaDomandaEsenzioneDisabled: false,
      downloadFileError: null,
      detailError: { message: '', title: '', fieldError: null },
      overlay: false,
      descrizione: '<p>Il servizio permette al contribuente, in pochi e semplici passi, di inviare al Settore Politiche Fiscali e Contenzioso Amministrativo della Regione una <strong>richiesta di esenzione per disabilità</strong>.<br/></p>' +
        '<p>Prima di cominciare ricordati di avere a disposizione i <strong>documenti</strong> necessari da allegare. Ove possibile utilizzare il <strong>formato PDF</strong>.<br/> Se stai usando uno smartphone, puoi allegare i documenti facendo una <strong>foto</strong>; in questo caso assicurati della leggibilità del documento</p>'
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
  },
  computed: {
    ...mapGetters([
      'esenzioniDisabili',
      'esenzioniDisabiliAllegati',
      'contribuente',
      'oggettoDomanda',
      'dichiarazione',
      'userIdentity'
    ])
  },
  methods: {
    removeMsg (params) {
      if (params === true) {
        this.resetErrori()
      }
    },
    inviaDomandaEsenzioniDisabili () {
      this.detailError = { message: '', title: '', fieldError: null }
      this.$refs.rifPratica.iniziaValidazione()
      this.$refs.rifPratica.$v.rifForm.$touch()
      if (this.$refs.rifPratica.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return
      this.esenzioniDisabili.allegati.forEach(function (v) { delete v.upFile })
      const { valueName, ...oggettoDomanda } = this.esenzioniDisabili.oggettoDomanda
      const requestInserisciDomandaEsenzione = {
        ...this.esenzioniDisabili,
        oggettoDomanda
      }
      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) requestInserisciDomandaEsenzione.email = rifObj.email.toLowerCase()
      if (smsAttivo()) requestInserisciDomandaEsenzione.telefono = rifObj.telefono
      this.overlay = true
      store
        .dispatch(ESENZIONI_DISABILI_CREA, requestInserisciDomandaEsenzione)
        .then(() => {
          this.overlay = false
          store.state.esenzionidisabili.esenzioniDisabiliAllegati = []
          this.$router.push(
            { name: 'esito_domanda_esenzione' }
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
          if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          } else if (error.response.status === 400 || error.response.status === 412) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
            }
          } else if (error.response.status === 409 || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: error.response.data.title
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
      const attach = this.esenzioniDisabiliAllegati.find(p => (p.identificativoArchivio === idAllegato))
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
    store.dispatch(ESENZIONI_DISABILI_CONTRIBUENTI, this.userIdentity.cf)
  }
}
</script>

<style>
</style>
