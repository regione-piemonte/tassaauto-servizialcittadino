<template>
  <div>
    <BoxErrore v-if="detail('ERROR')" :error="detail('ERROR')" />
    <BoxWarning v-if="detail('WARN')" :warning="detail('WARN')" />
    <BoxSuccesso v-if="detail('SUCCESS')" :success="detail('SUCCESS')" />
    <BoxNeutral v-if="detail('INFO')" :msg="detail('INFO')" />
  </div>
</template>

<script>
import store from '@/store'
import { REGIONE_ABILITATA, PAGE_ENV } from '@/common/config'
import { COMMON_MESSAGES } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import BoxWarning from '../components/BoxWarning.vue'
import BoxErrore from '../components/BoxErrore.vue'
import BoxSuccesso from '../components/BoxSuccesso.vue'
import BoxNeutral from '../components/BoxNeutral.vue'
export default {
  components: {
    BoxWarning,
    BoxErrore,
    BoxSuccesso,
    BoxNeutral
  },
  data () {
    return {
      pageEnv: PAGE_ENV,
      regione: REGIONE_ABILITATA
    }
  },
  computed: {
    ...mapGetters([
      'messages'
    ])
  },
  methods: {
    detail (type) {
      if (this.messages) {
        let array = []
        array = this.messages.filter(x => x.tipo === type)
        if (array.length > 1) {
          let message = ''
          for (const obj of array) {
            message += '- ' + obj.messaggio + '.<br>'
          }
          return {
            message: message
          }
        } else if (array.length === 1) {
          return {
            message: array[0].messaggio
          }
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  async created () {
    if (this.pageEnv !== 'testing' && this.regione === 'piemonte') {
      await store
        .dispatch(COMMON_MESSAGES)
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
