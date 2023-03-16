<template>
  <div class="space-section">
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
          <p v-html="parametri" />
        </v-col>
      </v-row>
    </v-alert>
    <div class="inner-cont-2box info-left row" id="informativa-flag">
      <div class="reset-margin">
        <div class="inline-check-submit no-gutters-col offset-lg-0 col-12">
          <div class="tooltip-field">
            <div class="position-relative d-inline-block">
              <v-checkbox
                v-if="!isChecked"
                id="flag"
                v-model="dichSostForm.flag"
                @change="$v.dichSostForm.flag.$touch()"
                :state="!$v.dichSostForm.flag.$error"
                value="accepted"
                unchecked-value="not_accepted"
                :error-messages="flagErrors"
                :error-count="2"
                :label="
                  this.$i18n.t(
                    this.text === 'DICH_SOST_CERT'
                      ? 'pratica.esenzioni_disabili.dichiarazione.dichiarazioneSostitutivaCertificazione'
                      : 'pratica.esenzioni_disabili.dichiarazione.dichiarazioneSostitutivaNotorieta'
                  )
                "
              >
              </v-checkbox>
              <v-checkbox
                v-if="isChecked"
                id="flag2"
                v-model="flag"
                value="accepted"
                unchecked-value="accepted"
                disabled
                :label="
                    this.text === 'DICH_SOST_CERT'
                      ? 'Dichiarazione sostitutiva di certificazione'
                      : 'Dichiarazione sostitutiva di notorietà'
                "
              >
              </v-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { COMMON_PARAMETRI } from '@/store/actions.type'
import { acceptedFlag } from '@/validators/bolloweb.validator'
import { validationMixin } from 'vuelidate'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'DichiarazioneSostitutiva',
  props: {
    isChecked: { type: Boolean, required: true },
    text: { type: String, required: true }
  },
  data () {
    return {
      errorCheck: {
        message: 'Impossibile caricare dichiarazione sostitutiva, ci scusiamo per il disagio',
        title: 'ERRORE'
      },
      dichSostForm: {
        flag: 'not_accepted'
      }
    }
  },
  methods: {
    errorCheckDichiarazione () {
      this.$emit('dichSostEvent', this.errorCheck)
    }
  },
  computed: {
    ...mapGetters([
      'parametri'
    ]),
    flag () {
      return this.isChecked ? 'accepted' : 'not_accepted'
    },
    flagErrors () {
      const errors = []
      if (!this.$v.dichSostForm.flag.$error) return errors
      if (!this.$v.dichSostForm.flag.acceptedflag) errors.push(this.$i18n.t('general.labels.error.flag'))
      return errors
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    dichSostForm: {
      flag: { acceptedFlag }
    }
  },
  async created () {
    await store.dispatch(COMMON_PARAMETRI, this.text)
      .then(() => {
        if (this.parametri === null) {
          this.errorCheckDichiarazione()
        }
      })
  }
}
</script>
