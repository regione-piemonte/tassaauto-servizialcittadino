<template>
  <PaginaServizio :servizio="servizio" />
</template>

<script>
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { PaginaServizio },
  data () {
    return {
      servizio: 'osservazione_avviso_bonario'
    }
  }
}
</script>
