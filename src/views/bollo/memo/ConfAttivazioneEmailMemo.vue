<template>
  <div class="app-container">
    <v-card class="card-view-page">
    <div class="app-row justify-content-md-center">
      <div class="col-12 col-lg-8">
        <div class="wrap-view">
          <div class="inner-cont-alert">
            <div class="row">
              <BoxErrore show :error="detailError" />
              <BoxSuccesso show :success="detailSuccess" />
            </div>
            <div class="action-button-wide">
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
</template>

<script>
import NavigatorService from '@/common/navigator.service'
import { MEMO_ATTIVAZ_EMAIL } from '@/store/actions.type'
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
      .dispatch(MEMO_ATTIVAZ_EMAIL, { email: this.$route.query.email, token: this.$route.query.token })
      .then(() => {
        this.detailSuccess = {
          title: 'Attivazione Memobollo via e-mail',
          message: 'Memobollo attivato correttamente!'
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
