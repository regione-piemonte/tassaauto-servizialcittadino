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
          <div class="col-lg-8 offset-lg-2">
            <div class="wrap-view" v-if="this.mostraForm">
              <div class="inner-cont-bollo">
                <div
                  class="row"
                  id="boxAttiva">
                  <div class="col-12">
                    <v-alert class="alert-form pa-0">
                      <h2 class="alert-heading">
                        Conferma indirizzo email
                      </h2>
                      <div class="rfs-24">
                        {{ esitoInfoVerificaEmail.destinatario }}
                      </div>
                      <div class="alert-form-fields">
                        <div class="inline-check-submit no-gutters-col">
                          <v-form
                            @submit.prevent="richiedi"
                            id="richiedi"
                            class="row">
                            <div class="tooltip-field col-md-7 py-md-0 pr-lg-0">
                              <div class="position-relative d-inline-block pr-lg-0">
                                <v-checkbox
                                  id="privacy"
                                  v-model="emailForm.privacy"
                                  @change="$v.emailForm.privacy.$touch()"
                                  :state="!$v.emailForm.privacy.$error"
                                  value="accepted"
                                  unchecked-value="not_accepted"
                                  :error-messages="privacyErrors"
                                  :label="this.$i18n.t('general.privacy')">
                                </v-checkbox>
                                <v-btn
                                  fab
                                  depressed
                                  class="contextual-info privacy-btn"
                                  @click="$refs.mwPrivacy.mostraModalePrivacy()">
                                  <v-icon>mdi-information</v-icon>
                                </v-btn>
                              </div>
                              <div class="error--text"
                                v-if="this.clickCb && !$v.emailForm.privacy.acceptedPrivacy">
                                Il consenso all'informativa sulla privacy è obbligatorio.
                              </div>
                            </div>
                            <div class="confirm-send col-md-4 offset-md-1">
                              <v-btn
                                depressed
                                type="submit"
                                color="primary" >
                                {{ labelBtnAttivaRevoca }}
                              </v-btn>
                            </div>
                          </v-form>
                        </div>
                      </div>
                    </v-alert>
                  </div>
                  <div class="action-button-wide row">
                    <div class="col-12 text-left">
                      <BtnBack
                        :backUrl="'verifica_attivazione_info'"
                        :backType="'back'"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="wrap-view" v-if="this.mostraEsito">
              <div class="row justify-content-center">
                <BoxWarning :warning="detailWarning" />
              </div>
              <div class="action-button-wide row">
                <div class="col-12 text-md-right">
                  <BtnHome />
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <ModalePrivacy
      ref="mwPrivacy"
      v-on:privacyaccepted="emailForm.privacy = 'accepted'"
    />
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import BoxWarning from '@/components/BoxWarning'
import BtnBack from '@/components/layout/btn/BtnBack'
import BtnHome from '@/components/layout/btn/BtnHome'
import Spinner from '@/components/layout/Spinner'
import ModalePrivacy from '@/components/privacy/ModalePrivacy'
import { INFO_RICHIESTA_ATT_EMAIL, INFO_RICHIESTA_REV_EMAIL } from '@/store/actions.type'
import store from '@/store'
import { validationMixin } from 'vuelidate'
import { acceptedPrivacy } from '@/validators/bolloweb.validator'

export default {
  components: {
    BoxErrore,
    BtnBack,
    BoxWarning,
    BtnHome,
    ModalePrivacy,
    Spinner
  },
  data () {
    return {
      detailError: { title: '', message: '' },
      detailWarning: { title: '', message: '' },
      clickCb: false,
      emailForm: { privacy: 'not_accepted' },
      mostraForm: true,
      mostraEsito: false,
      overlay: false
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    emailForm: {
      privacy: { acceptedPrivacy }
    }
  },
  computed: {
    ...mapGetters([
      'esitoInfoVerificaEmail'
    ]),
    labelBtnAttivaRevoca: function () {
      return (this.esitoInfoVerificaEmail.dataAttivazione === null || this.esitoInfoVerificaEmail.dataAttivazione === '') ? this.$i18n.t('general.buttons.attiva') : this.$i18n.t('general.buttons.revoca')
    },
    privacyErrors () {
      const errors = []
      if (!this.$v.emailForm.privacy.$error) return errors
      !this.$v.emailForm.privacy.acceptedPrivacy && errors.push('')
      return errors
    }
  },
  methods: {
    richiedi () {
      this.clickCb = true
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (!NavigatorService.checkInternetConnection()) return

      const action = (this.esitoInfoVerificaEmail.dataAttivazione === null || this.esitoInfoVerificaEmail.dataAttivazione === '') ? INFO_RICHIESTA_ATT_EMAIL : INFO_RICHIESTA_REV_EMAIL
      const msgAction = (this.esitoInfoVerificaEmail.dataAttivazione === null || this.esitoInfoVerificaEmail.dataAttivazione === '') ? 'l\'attivazione' : 'la revoca'
      const titleAction = (this.esitoInfoVerificaEmail.dataAttivazione === null || this.esitoInfoVerificaEmail.dataAttivazione === '') ? 'Attivazione' : 'Revoca'
      this.overlay = true
      store
        .dispatch(action, { email: this.esitoInfoVerificaEmail.destinatario })
        .then(({ data }) => {
          this.overlay = false
          if (data.esito === 'OK') {
            this.mostraEsito = true
            this.mostraForm = false
            this.detailWarning = {
              title: titleAction + ' Infobollo via e-mail',
              message: 'Per confermare ' + msgAction + ' di Infobollo controlla la tua email e clicca sul link entro 24 ore!'
            }
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: 'Problemi occorsi durante l\'operazione, si chiede di riprovare.'
            }
          }
        })
        .catch((error) => {
          this.overlay = false
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable') + ' (' + error.response.data.title + ')'
          }
        })
    }
  }
}
</script>
