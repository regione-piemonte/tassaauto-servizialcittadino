<template>
  <vue-recaptcha
    :sitekey="recaptchaSiteKey"
    @verify="markRecaptchaAsVerified"
    @expired="markRecaptchaAsNotVerified"
    @error="markRecaptchaAsNotVerified"
    :loadRecaptchaScript="true"
    v-if="recaptchaVisible()"
  />
</template>

<script>
import { RECAPTCHA_SITE_KEY, NO_RECAPTCHA_ATTEMPTS } from '@/common/config'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'TassaAutoRecaptcha',
  components: { VueRecaptcha },
  props: {
    pCount: { type: Number, required: true }
  },
  data () {
    return {
      recaptchaSiteKey: RECAPTCHA_SITE_KEY
    }
  },
  methods: {
    markRecaptchaAsNotVerified () {
      this.$emit('recaptchanotverified')
    },
    markRecaptchaAsVerified () {
      this.$emit('recaptchaverified')
    },
    recaptchaVisible () {
      return (this.pCount >= NO_RECAPTCHA_ATTEMPTS)
    }
  }
}
</script>
