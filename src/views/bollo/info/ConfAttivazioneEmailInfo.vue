<template>
  <div class="container">
    <div class="col-lg-10 mx-lg-auto">
      <v-card class="card-view-page">
      <div class="row justify-content-md-center">
        <div class="offset-lg-2 col-lg-8">
          <div class="wrap-view">
            <div class="inner-cont-alert">
              <div class="row">
                <BoxErrore show :error="detailError" class="mb-3"/>
                <BoxSuccesso show :success="detailSuccess" class="mb-3"/>
              </div>
              <div class="action-button-wide row">
                <div class="col-12 text-md-right">
                  <BtnHome />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </v-card>
    </div>

  </div>
</template>

<script>
import NavigatorService from '@/common/navigator.service'
import { INFO_ATTIVAZ_EMAIL } from '@/store/actions.type'
import store from '@/store'
import BoxErrore from '@/components/BoxErrore'
import BoxSuccesso from '@/components/BoxSuccesso'
import BtnHome from '@/components/layout/btn/BtnHome'

export default {
  components: { BoxErrore, BoxSuccesso, BtnHome },
  data () {
    return {
      detailError: { title: '', message: '' },
      detailSuccess: { title: '', message: '' }
    }
  },
  async created () {
    if (!NavigatorService.checkInternetConnection()) {
      this.detailError = {
        title: this.$i18n.t('general.error'),
        message: this.$i18n.t('general.api.errors.service_unavailable')
      }
      return
    }

    store
      .dispatch(INFO_ATTIVAZ_EMAIL, { email: this.$route.query.email, token: this.$route.query.token })
      .then(() => {
        this.detailSuccess = {
          title: 'Attivazione Infobollo via e-mail',
          message: 'Infobollo attivato correttamente!'
        }
      })
      .catch((error) => {
        if (error == null || error.response.status === 500) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
          return
        }
        if (error.response.status === 400) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Token di sicurezza non valido'
          }
        } else if (error.response.status === 404) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Destinatario non trovato'
          }
        }
      })
  }
}
</script>
