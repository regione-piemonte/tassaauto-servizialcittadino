<template>
  <v-dialog
    id="modalePrivacy"
    ref="modalePrivacy"
    v-model="dialogPrivacy"
    max-width="500px">
    <v-card>
      <v-card-title>
        {{$t('general.privacy')}}
        <v-spacer></v-spacer>
        <v-btn text @click="dialogPrivacy = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <BoxErrore :error="detailError" />
        <div class="d-block">
          <p v-html="testoPrivacy" />
        </div>
        <div class="action-button-wide row">
          <div class="col-md-6">
            <v-btn
              depressed
              class="mt-3 btn-secondary"
              @click="nascondiModalePrivacy">
              {{ $t('general.buttons.undo') }}
            </v-btn>
          </div>
          <div class="col-md-6 text-md-right">
            <v-btn
              depressed
              class="mt-3 btn-accept"
              color="primary"
              @click="accettaPrivacy">
              {{ $t('general.buttons.accetta') }}
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import BoxErrore from '@/components/BoxErrore'
import { COMMON_PRIVACY } from '@/store/actions.type'
import store from '@/store'

export default {
  name: 'ModalePrivacy',
  components: { BoxErrore },
  data () {
    return {
      detailError: { title: '', message: '' },
      testoPrivacy: '',
      dialogPrivacy: false
    }
  },
  methods: {
    mostraModalePrivacy () {
      this.dialogPrivacy = true
      store
        .dispatch(COMMON_PRIVACY)
        .then(({ data }) => {
          this.testoPrivacy = data.informativa
          this.$refs.modalePrivacy.show()
        })
        .catch((error) => {
          console.log('API Rest Privacy', { error })
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: this.$i18n.t('general.api.errors.service_unavailable')
          }
        })
    },
    nascondiModalePrivacy () {
      this.dialogPrivacy = false
    },
    accettaPrivacy () {
      this.dialogPrivacy = false
      this.$emit('privacyaccepted')
    }
  }
}
</script>
