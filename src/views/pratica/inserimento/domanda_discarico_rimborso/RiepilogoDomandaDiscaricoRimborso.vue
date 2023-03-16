<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-bollo">
          <div class="text-intro col-lg-8 offset-lg-2">
            <Wizard :servizio="'domanda_discarico_rimborso'" :stepAttivo="2" />
          </div>
        </div>
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2">
            <BoxErrore :error="detailError" />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="col-lg-8 offset-lg-2">
            <div class="space-section">
              <DatiAnagraficiIntestatario
                :denominazione="soggettoDomDisRim"
                :codiceFiscale="cfDomDisRim"
                :dataNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.dataNascita"
                :comuneNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.comuneNascita"
                :provinciaNascita="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.provinciaNascita"
                :sesso="datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.sesso"
                :tipoDatiAnagrafici="'intestatario ingiunzione / cartella'"
                :personaFisica="personaFisica"
              />
            </div>
            <div class="space-section"
              v-if="rappresentanteLegaleDomanda !== null">
              <DatiAnagRapprLegale
                :denominazione="rappresentanteLegaleDomanda.nome + ' ' + rappresentanteLegaleDomanda.cognome"
                :codiceFiscale="rappresentanteLegaleDomanda.codiceFiscaleR"
                :sesso="rappresentanteLegaleDomanda.sesso"
                :dataDiNascita="rappresentanteLegaleDomanda.dataDiNascita"
                :comuneDiNascita="rappresentanteLegaleDomanda.comune"
                :provinciaDiNascita="rappresentanteLegaleDomanda.provincia"/>
            </div>
            <titolo-esecutivo
              :tipoTitolo="(ingiunzioneFiscaleDiscRimb.value) ? 'ingiunzione' : 'cartella'"
              :numeroEsecutivo="(ingiunzioneFiscaleDiscRimb.value) ? ingiunzioneFiscaleDiscRimb.numeroIngiunzione : cartellaEsattorialeDiscRimb.numeroCartellaEsattoriale"
              :dataNotifica="domandaDiscaricoRimborso.dataNotifica"
              :importoTotale="Number(domandaDiscaricoRimborso.importoTotaleRiscossione)"
            />
            <oggetto-domanda
              :oggetto="domandaDiscaricoRimborso.oggettoDomanda"
            />
            <motivo-domanda
              :motivo="domandaDiscaricoRimborso.motivo"
            />
            <div class="space-section">
              <h2>{{ $t('general.box_titles.allegati') }}</h2>
              <div v-if="domDiscaricoRimborsoAllegati.length === 0">
                {{ $t('general.messages.zero_allegati') }}
              </div>
              <div v-else>
                <ul class="border-list">
                  <li v-for="(item, index) in domDiscaricoRimborsoAllegati" :key="index">
                    <a href="#" v-on:click="scaricaAllegato(item.identificativoArchivio)">{{ item.nomeAllegato }}</a>
                  </li>
                </ul>
              </div>
              <div class="error"
                v-if="downloadFileError !== null">
                {{ downloadFileError }}
              </div>
            </div>
            <RiferimentiPratica
              ref="rifPratica"
              v-on:bloccainvioosservazione="inviaDomDisRimbDisabled = true"
              :errorMsgPratica = detailError.fieldError
              @resetMsgErrorsPage="removeMsg"
            />
            <div class="action-button-wide row">
              <div class="col-md-6">
                <BtnBack
                  :backUrl="'crea_domanda_discarico_rimborso'"
                  :backType="'backMod'"/>
              </div>
              <div class="col-md-6 text-md-right">
                <v-btn
                  depressed
                  id="inviaRichiestaDTE"
                  type="button"
                  color="primary"
                  @click.prevent="inviaDomandaDiscRimb"
                  :disabled="inviaDomDisRimbDisabled">
                  Invia richiesta
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import ApiError from '@/common/api.error'
import { emailAttiva, smsAttivo } from '@/common/config'
import BoxErrore from '@/components/BoxErrore'
import NavigatorService from '@/common/navigator.service'
import DatiAnagraficiIntestatario from '@/components/DatiAnagraficiIntestatario'
import DatiAnagRapprLegale from '@/components/pratica/DatiAnagRapprLegale'
import RiferimentiPratica from '@/components/pratica/RiferimentiPratica'
import MotivoDomanda from '@/components/pratica/domanda_discarico_rimborso/MotivoDomanda'
import OggettoDomanda from '@/components/pratica/domanda_discarico_rimborso/OggettoDomanda'
import TitoloEsecutivo from '@/components/pratica/domanda_discarico_rimborso/TitoloEsecutivo'
import BtnBack from '@/components/layout/btn/BtnBack'
import Spinner from '@/components/layout/Spinner'
import { INVIO_DOMANDA_DISCARICO_RIMBORSO } from '@/store/actions.type'
import Wizard from '@/components/layout/Wizard'
import store from '@/store'
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'

export default {
  components: {
    Wizard,
    BoxErrore,
    BtnBack,
    DatiAnagraficiIntestatario,
    DatiAnagRapprLegale,
    RiferimentiPratica,
    MotivoDomanda,
    OggettoDomanda,
    Spinner,
    TitoloEsecutivo
  },
  data () {
    return {
      detailError: { message: '', title: '', fieldError: null },
      downloadFileError: null,
      inviaDomDisRimbDisabled: false,
      overlay: false
    }
  },
  computed: {
    ...mapGetters([
      'datiDomandaDiscaricoIntestatario',
      'domDiscaricoRimborsoAllegati',
      'ingiunzioneFiscaleDiscRimb',
      'cartellaEsattorialeDiscRimb',
      'domandaDiscaricoRimborso',
      'rappresentanteLegaleDomanda'
    ]),
    soggettoDomDisRim: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione
      return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.nome + ' ' + this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.cognome
    },
    cfDomDisRim: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.piva
      return this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.codiceFiscale
    },
    personaFisica: function () {
      if (this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario.denominazione !== null) return false
      return true
    },
    soggettoDomDisRimLeg: function () {
      if (this.rappresentanteLegaleDomanda === null) return null
      return this.rappresentanteLegaleDomanda.nome + ' ' + this.rappresentanteLegaleDomanda.cognome
    }
  },
  methods: {
    removeMsg (params) {
      if (params === true) {
        this.resetErrori()
      }
    },
    scaricaAllegato (idAllegato) {
      this.downloadFileError = null
      const attach = this.domDiscaricoRimborsoAllegati.find(p => (p.identificativoArchivio === idAllegato))
      if (attach === undefined) {
        this.downloadFileError = 'Impossibile scaricare il documento allegato.'
        return
      }
      saveAs(attach.upFile, attach.nomeAllegato)
    },

    inviaDomandaDiscRimb () {
      this.detailError = { message: '', title: '', fieldError: null }
      this.$refs.rifPratica.iniziaValidazione()
      this.$refs.rifPratica.$v.rifForm.$touch()
      if (this.$refs.rifPratica.$v.rifForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const inputParams = this.datiDomandaDiscRimb()
      this.overlay = true
      store
        .dispatch(INVIO_DOMANDA_DISCARICO_RIMBORSO, inputParams)
        .then(() => {
          this.overlay = false
          this.$router.push({ name: 'esito_domanda_discarico_rimborso' })
        })
        .catch((error) => {
          this.overlay = false
          if (error == null || error.response === undefined) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          // cfr issue gitlab #166
          if (error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
            }
          } else if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Dati non corretti.'
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata.'
            }
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Domanda non inviata, esiste una pratica in lavorazione.'
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

    datiDomandaDiscRimb () {
      const attachDocs = this.domDiscaricoRimborsoAllegati
      attachDocs.forEach(function (v) { delete v.upFile })

      const inputParams = {
        dataNotifica: this.domandaDiscaricoRimborso.dataNotifica,
        importoTotaleRiscossione: this.domandaDiscaricoRimborso.importoTotaleRiscossione,
        oggettoDomanda: this.domandaDiscaricoRimborso.oggettoDomanda,
        motivo: this.domandaDiscaricoRimborso.motivo,
        dataAnagraficiIntestatario: this.datiDomandaDiscaricoIntestatario.dataAnagraficiIntestatario,
        allegati: attachDocs
      }
      if (this.rappresentanteLegaleDomanda !== null) {
        inputParams.dataAnagraficiRappresentante = {
          codiceFiscale: this.rappresentanteLegaleDomanda.codiceFiscaleR,
          cognome: this.rappresentanteLegaleDomanda.cognome,
          comuneNascita: this.rappresentanteLegaleDomanda.comune,
          nome: this.rappresentanteLegaleDomanda.nome,
          dataNascita: this.rappresentanteLegaleDomanda.dataDiNascita,
          sesso: this.rappresentanteLegaleDomanda.sesso,
          provinciaNascita: this.rappresentanteLegaleDomanda.provincia,
          statoNascita: 'ITALIA'
        }
        if (inputParams.dataAnagraficiRappresentante.provinciaNascita === '' || inputParams.dataAnagraficiRappresentante.provinciaNascita === null) {
          inputParams.dataAnagraficiRappresentante.statoNascita = this.rappresentanteLegaleDomanda.comune
          inputParams.dataAnagraficiRappresentante.comuneNascita = null
        }
      }
      // vedi https://gitlab.csi.it/prodotti/bolloweb/bolloweb/issues/210
      inputParams.ingiunzioneFiscale = this.ingiunzioneFiscaleDiscRimb
      if (!this.ingiunzioneFiscaleDiscRimb.value) inputParams.cartellaEsattoriale = this.cartellaEsattorialeDiscRimb

      const rifObj = this.$refs.rifPratica.getRiferimenti()
      if (emailAttiva()) inputParams.email = rifObj.email.toLowerCase()
      if (smsAttivo()) inputParams.telefono = rifObj.telefono
      return inputParams
    }
  }
}
</script>
