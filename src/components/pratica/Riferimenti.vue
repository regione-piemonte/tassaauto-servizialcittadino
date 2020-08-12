<template>
  <div class="space-section">
    <h2>
      {{ $t('general.box_titles.riferimenti') }}
    </h2>
    <p
      v-if="canaleEmailAttivo && pEmail !== null">
      {{ pEmail }}
    </p>
    <p
      v-if="canaleSmsAttivo && pTelefono !== null">
      {{ pTelefono }}
    </p>
  </div>
</template>

<script>
import {
  emailAttiva,
  smsAttivo
} from '@/common/config'

export default {
  name: 'Riferimenti',
  props: {
    pEmail: { type: String, required: false },
    pTelefono: { type: String, required: false }
  },
  data () {
    return {
      canaleEmailAttivo: emailAttiva(),
      canaleSmsAttivo: smsAttivo()
    }
  }
}
</script>
