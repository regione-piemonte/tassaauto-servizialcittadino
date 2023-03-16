<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
        <div class="row inner-cont-alert">
          <div class="text-intro col-lg-8 offset-lg-2"
          id="boxErrDiv">
            <box-errore
              :error="detailError"
            />
          </div>
        </div>
        <div class="row inner-cont-bollo">
          <div class="calcolo-sicuro col-lg-3 col-md-6 offset-lg-2 mt-8 mt-sm-0">
            <v-img
              class="imgHomeServizio"
              width="178"
              :src="require('@/assets/images/ritagli/servizi/calcola_bollo.svg')"
              fluid
            />
            <div class="text-inner pt-7 pl-0 pr-md-8 pr-lg-0">
              <strong>{{ $t('bollo.calcolo.title') }}</strong>
              <p>
                Con questo servizio puoi conoscere subito <strong>l'importo</strong> da pagare per il bollo della tua auto.
              </p>
            </div>
            <div class="text-inner pt-3 pl-0 pr-md-8 pr-lg-0">
              <a href="https://www.regione.piemonte.it/web/temi/tributi/tassa-automobilistica-bollo-auto/bollo-auto-quanto-pagare" target="_blank"><strong>Maggiori informazioni</strong></a>
            </div>
          </div>
          <div class="form-cerca-veicolo col-lg-4 col-md-6 offset-lg-1">
            <h2>
              Cerca un veicolo
            </h2>
            <v-form @submit.prevent="calcolaImporto" v-if="errorpage">
              <Targa
                ref="targa"
                :pServerErr="serverErrors.targa"
                v-on:targachanged="resetErrori()"
              />
              <v-select
                id="tipoVeicolo"
                :items="veicoli"
                label="Scegli il tipo di veicolo"
                v-model="calcForm.tipoVeicolo"
                @change.native="resetErrori()"
                :error-messages="tipoVeicoloErrors"
                :error-count="1">
              </v-select>

              <tassa-auto-recaptcha
                :pCount="noCaptchaCount"
                v-on:recaptchaverified="updRecaptchaVerified()"
                v-on:recaptchanotverified="recaptchaVerified = false"
              />
              <v-btn depressed type="submit" color="primary" class="spaceTopButtonSubmit">
                {{ $t('general.buttons.calcola') }}
              </v-btn>
            </v-form>
            <div v-else>
              <div class="row inner-cont-alert" v-if="visureElencoVeicoli === null">
                <div class="text-intro col-12 mt-12">
                  <BoxNeutral
                    show
                    :msg="detailInfo"
                    class="printDisplay"
                  />
                </div>
              </div>
              <v-form @submit.prevent="calcolaImportoAuth" id="calcoloBollo" v-else>
                <v-select
                :items="listaVeicoliCalcolo"
                v-model="veicoloSceltoCalcolo"
                @change.native="resetErroriServer()"
                label="Seleziona un veicolo"
                :error-messages="veicoloSceltoErrors"
                :error-count="1">
                </v-select>
                <v-text-field
                disabled
                label="Targa / Telaio"
                v-if="veicoloSceltoCalcolo !== null"
                v-model="veicoloSceltoCalcolo.targa">
                </v-text-field>
                <v-text-field
                disabled
                label="Tipo di veicolo"
                v-if="veicoloSceltoCalcolo !== null"
                v-model="veicoloSceltoCalcolo.tipoVeicoloDescrizione"></v-text-field>
                <v-btn
                  depressed
                  class="spaceTopButtonSubmit"
                  type="submit"
                  color="primary">
                  {{ $t('general.buttons.calcola') }}
                </v-btn>
              </v-form>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BoxNeutral from '@/components/BoxNeutral.vue'
import Spinner from '@/components/layout/Spinner'
import Targa from '@/components/Targa'
import TassaAutoRecaptcha from '@/components/TassaAutoRecaptcha'
import { BOLLO_CALCOLO, BOLLO_CALCOLO_RESET_STATE, VEICOLO_LISTA, VISURE_CONTRIBUENTE } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  components: { BoxErrore, BoxNeutral, Spinner, TassaAutoRecaptcha, Targa },
  data () {
    return {
      detailError: { message: '', title: '' },
      detailInfo: {
        message: this.$i18n.t('general.info_loading.message'),
        title: this.$i18n.t('general.info_loading.title')
      },
      veicoli: [],
      calcForm: {
        tipoVeicolo: null
      },
      noCaptchaCount: 0,
      overlay: false,
      recaptchaVerified: false,
      serverErrors: { targa: '' },
      listaVeicoliCalcolo: [],
      veicoloSceltoCalcolo: {},
      errorpage: true
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    calcForm: {
      tipoVeicolo: { required }
    },
    veicoloSceltoCalcolo: { required }
  },
  computed: {
    ...mapGetters([
      'visureElencoVeicoli',
      'userIdentity',
      'isUserLogged',
      'isUserLoggedLocalhost'
    ]),
    logged () {
      if (process.env.NODE_ENV === 'production') {
        return this.isUserLogged
      }
      return this.isUserLoggedLocalhost
    },
    tipoVeicoloErrors () {
      const errors = []
      if (!this.$v.calcForm.tipoVeicolo.$dirty) return errors
      !this.$v.calcForm.tipoVeicolo.required && errors.push('Specificare il tipo di veicolo.')
      return errors
    },
    veicoloSceltoErrors () {
      const errors = []
      if (!this.$v.veicoloSceltoCalcolo.$dirty && !this.$v.veicoloSceltoCalcolo !== null) return errors
      !this.$v.veicoloSceltoCalcolo.required && errors.push('Specificare il veicolo.')
      return errors
    }
  },
  methods: {
    calcolaImporto () {
      this.resetErrori()
      this.$refs.targa.$v.targaForm.$touch()
      this.$v.calcForm.$touch()
      if (this.$v.calcForm.$invalid || this.$refs.targa.$v.targaForm.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }

      this.overlay = true
      store
        .dispatch(BOLLO_CALCOLO, { tipo_veicolo: this.calcForm.tipoVeicolo, targa: this.$refs.targa.getValore().toUpperCase() })
        .then(() => {
          this.$router.push({ name: 'esito_calcolo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(BOLLO_CALCOLO_RESET_STATE)
          if (error == null || error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.fields_missed')
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.serverErrors.targa = error.response.data.title
            this.noCaptchaCount++
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            this.serverErrors.targa = error.response.data.title
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.targa_invalid')
            }
            this.serverErrors.targa = this.$i18n.t('general.api.errors.targa_invalid')
            this.noCaptchaCount++
          }
        })
    },
    calcolaImportoAuth () {
      this.resetErrori()
      this.$v.$touch()
      if (!NavigatorService.checkInternetConnection()) return

      if (this.noCaptchaCount > NO_RECAPTCHA_ATTEMPTS && !this.recaptchaVerified) {
        this.detailError = {
          title: this.$i18n.t('general.error'),
          message: 'Dimostra di non essere un robot'
        }
        return
      }

      this.overlay = true
      store
        .dispatch(BOLLO_CALCOLO, { tipo_veicolo: this.veicoloSceltoCalcolo.tipoVeicolo, targa: this.veicoloSceltoCalcolo.targa })
        .then(() => {
          this.$router.push({ name: 'esito_calcolo' })
        })
        .catch((error) => {
          this.overlay = false
          store.dispatch(BOLLO_CALCOLO_RESET_STATE)
          if (error == null || error.response.status === 500 || error.response.status === 503) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
            return
          }
          if (error.response.status === 400) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.fields_missed')
            }
          } else if (error.response.status === 404) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.serverErrors.targa = error.response.data.title
            this.noCaptchaCount++
          } else if (error.response.status === 406) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: error.response.data.title
            }
            this.noCaptchaCount++
            this.serverErrors.targa = error.response.data.title
          } else if (error.response.status === 422) {
            this.detailError = {
              title: this.$i18n.t('general.api.errors.no_results'),
              message: this.$i18n.t('general.api.errors.targa_invalid')
            }
            this.serverErrors.targa = this.$i18n.t('general.api.errors.targa_invalid')
            this.noCaptchaCount++
          }
        })
    },

    resetErrori () {
      this.$v.$reset()
      this.detailError = { message: '', title: '' }
      this.resetErroriServer()
    },

    resetErroriServer () {
      this.serverErrors.targa = ''
    },

    updRecaptchaVerified () {
      this.recaptchaVerified = true
      this.detailError = { message: '', title: '' }
      this.noCaptchaCount = 0
    },

    elencoVeicoliCalcoloBollo () {
      this.errorpage = false
      this.overlay = true
      if (store.getters.userIdentity) {
        store
          .dispatch(VISURE_CONTRIBUENTE, store.getters.userIdentity.cf)
          .then(() => {
            this.selezionaElencoVeicoliBollo()
            this.overlay = false
          })
          .catch((error) => {
            if (error === null) {
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: 'Non è possibile accedere al servizio'
              }
            }
            if (error.response.status) {
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
            }
            if (error.response.status === 404) {
              this.overlay = false
              this.detailError = {
                title: this.$i18n.t('general.error'),
                message: error.response.data.title
              }
              this.errorpage = true
            }
          })
      }
    },
    selezionaElencoVeicoliBollo () {
      this.listaVeicoliCalcolo.push({ text: 'Seleziona', value: null })
      for (let i = 0; i < this.visureElencoVeicoli.visure.length; i++) {
        if (this.visureElencoVeicoli.visure[i].dataFineProprieta === null) {
          this.listaVeicoliCalcolo.push({
            text: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione + ' - ' + this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
            value: {
              tipoVeicolo: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.codice,
              targa: this.visureElencoVeicoli.visure[i].tipoVeicolo.targa,
              tipoVeicoloDescrizione: this.visureElencoVeicoli.visure[i].tipoVeicolo.tipoVeicolo.descrizione
            }
          })
        }
      }
    }
  },
  async created () {
    store
      .dispatch(VEICOLO_LISTA, { filtro: 'true' }) // calcolo bollo solo per un sottoinsieme di veicoli
      .then((data) => {
        this.veicoli = data
      })
      .catch((error) => {
        if (error != null && error.message != null) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable') + '(' + error.message + ')'
          }
        }
      })
    if (this.logged) {
      this.elencoVeicoliCalcoloBollo()
    }
  }
}
</script>
