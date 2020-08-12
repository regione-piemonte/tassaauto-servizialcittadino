<template>
  <div>
    <slot
      v-if="!overlay"
    />
    <div class="app-container">
      <spinner :pOverlay="overlay" />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/layout/Spinner'

export default {
  name: 'CsiAppBootstrap',
  components: { Spinner },
  data () {
    return {
      overlay: true
    }
  },
  async created () {
    // aspettiamo che il router sia pronto prima di ottenere la route dall'URL
    this.$router.onReady(() => {
      console.debug('[FirstAccess] Router ready')
      console.debug('[FirstAccess] Router:', this.$router)
      console.debug('[FirstAccess] Route:', this.$route)
      console.debug('[FirstAccess] matched:', this.$router.getMatchedComponents())
      console.debug('[FirstAccess] current:', this.$router.history.current)
      this.overlay = false
    })

    // Evitiamo di spaccare completamente l'app
    // In questo modo è sempre possibile aggiornarla
    setTimeout(() => {
      this.overlay = false
    }, 5000)
  }
}
</script>

<style scoped lang="stylus"></style>
