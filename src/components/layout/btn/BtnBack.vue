<template>
  <v-btn
    type="button"
    class="btn-secondary"
    :to="{ name: backUrl }"
    id="backButton"
    :block="(size) ? true : false">
    <span v-if="backType === 'back'">{{ $t('general.buttons.back') }}</span>
    <span v-if="backType === 'backMod'">{{ $t('general.buttons.back_mod') }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'BtnBack',
  props: {
    backUrl: { type: String },
    // ci sono 2 tipi di backType:
    // se la pagina presenta la label 'indietro/modifica' => backMod
    // altrimenti 'indietro' => back
    backType: { type: String, required: true },
    // nel caso in cui il bottone sia di tipo block
    size: { type: Boolean }
  }
}
</script>
