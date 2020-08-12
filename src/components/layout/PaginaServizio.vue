<template>
  <div>
    <TitoloServizio :servizio="servizio" />
    <router-view></router-view>
  </div>
</template>

<script>
import TitoloServizio from '@/components/layout/TitoloServizio'

export default {
  name: 'PaginaServizio',
  props: {
    servizio: { type: String, required: true }
  },
  components: { TitoloServizio }
}
</script>
