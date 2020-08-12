<template>
  <PaginaServizio :servizio="servizio" />
</template>

<script>
import PaginaServizio from '@/components/layout/PaginaServizio'

export default {
  components: { PaginaServizio },
  data () {
    return {
      servizio: 'ricevuta_bollo'
    }
  }
}
</script>
