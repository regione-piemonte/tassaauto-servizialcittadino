<template>
  <div class="space-section">
    <h2>
      {{ $t('general.box_titles.allegati') }}
    </h2>
    <div class="app-row inner-cont-alert">
      <div class="text-intro col-lg-8 offset-lg-2 col-12"
      id="boxErrDiv">
        <BoxErrore
          :error="detailError"
        />
      </div>
    </div>
    <div
      v-if="listaAllegati.length === 0">
      {{ $t('general.messages.zero_allegati') }}
    </div>
    <div v-else>
      <ul class="border-list">
        <li v-for="(item, index) in listaAllegati" :key="index">
          <a href="#"
            v-on:click="scaricaAllegato(item.identificativoArchivio, item.nomeAllegato)"
            class="linkPrint">
            {{ item.nomeAllegato }}
          </a>
        </li>
      </ul>
    </div>
    <spinner :pOverlay="overlay" />
  </div>
</template>

<script>
import NavigatorService from '@/common/navigator.service'
import BoxErrore from '@/components/BoxErrore'
import Spinner from '@/components/layout/Spinner'
import { PRATICA_ALLEGATO } from '@/store/actions.type'
import store from '@/store'
import { saveAs } from 'file-saver'

export default {
  name: 'Allegati',
  props: {
    codiceFiscale: { type: String, required: true },
    numeroProtocollo: { type: String, required: true },
    listaAllegati: { type: Array, required: true },
    pLocal: { type: Boolean, required: true }
  },
  components: { BoxErrore, Spinner },
  data () {
    return {
      detailError: { message: '', title: '' },
      overlay: false
    }
  },
  methods: {
    scaricaAllegato (idAllegato, nomeAllegato) {
      if (this.pLocal) {
        const attach = this.listaAllegati.find(p => (p.identificativoArchivio === idAllegato))
        if (attach === undefined) {
          this.detailError = {
            title: this.$i18n.t('general.error'),
            message: 'Impossibile scaricare il documento allegato.'
          }
          return
        }
        saveAs(attach.upFile, attach.nomeAllegato)
        return
      }

      if (!NavigatorService.checkInternetConnection()) return
      this.overlay = true
      store
        .dispatch(PRATICA_ALLEGATO, {
          slug: idAllegato,
          identificativo: this.numeroProtocollo,
          codiceFiscale: this.codiceFiscale
        })
        .then((response) => {
          this.overlay = false
          const blob = new Blob([response.data])
          saveAs(blob, nomeAllegato)
        })
        .catch((error) => {
          this.overlay = false
          if (error == null || error.response.status === 500) {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.service_unavailable')
            }
          } else {
            this.detailError = {
              title: this.$i18n.t('general.error'),
              message: this.$i18n.t('general.api.errors.download_file')
            }
          }
        })
    }
  }
}
</script>
