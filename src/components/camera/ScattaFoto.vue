<template>
  <v-dialog
    v-model="modalFoto"
    ref="modaleFoto"
    hide-footer
    title="Scatta una foto"
    @click:outside="closeDialog()"
    max-width="600px">
    <v-card class="pa-4">
      <v-card-title class="justify-end">
        <v-icon @click.stop="closeDialog()">mdi-close</v-icon>
      </v-card-title>
      <BoxErrore
        :error="detailError"
      />
      <div class="d-block text-center">
        <Camera
          ref="camera"
          v-on:updateboxerr="updateDetailError($event)"
        />
        <v-btn
          @click="scattaFoto()"
          color="primary"
          v-if="this.detailError.message === '' && this.detailError.title === ''">
          Scatta
        </v-btn>
      </div>
      <v-btn
        v-if="imgFile !== null"
        class="mt-3"
        color="primary"
        @click="nascondiModaleFoto()">
        {{ $t('general.buttons.undo') }}
      </v-btn>
      <v-btn
        v-if="imgFile !== null"
        class="mt-3"
        color="primary"
        @click="caricaFoto()">
        Vai
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import BoxErrore from '@/components/BoxErrore'
import Camera from '@/components/camera/Camera'

export default {
  name: 'ScattaFoto',
  props: {
    imgFile: { type: File, required: false }
  },
  components: {
    BoxErrore,
    Camera
  },
  data () {
    return {
      detailError: { message: '', title: '' },
      modalFoto: false
    }
  },
  methods: {
    nascondiModaleFoto () {
      this.$refs.camera.clearPhoto()
      this.$refs.camera.$refs.video.pause()
      const tracks = this.$refs.camera.stream.getTracks()
      tracks.forEach(track => track.stop())
      this.modalFoto = false
      this.$emit('annullafile')
    },

    scattaFoto () {
      const data = new Date()
      let mese = (data.getMonth() + 1).toString()
      if (mese.length === 1) mese = '0' + mese
      const nomeFile = 'IMG' + data.getFullYear().toString() + mese + data.getDate().toString() + data.getHours().toString() + data.getMinutes().toString() + data.getSeconds().toString()

      var self = this
      const canvas = this.$refs.camera.takeAPhoto()
      canvas.toBlob(function (blob) {
        const file = new File([blob], nomeFile + '.jpg', { type: 'image/jpeg' })
        self.$emit('salvafile', file)
      }, 'image/jpeg', 0.95
      ) // JPEG at 95% quality
    },

    caricaFoto () {
      this.modalFoto = false
      this.$emit('caricaallegato')
      this.$refs.camera.$refs.video.pause()
      const tracks = this.$refs.camera.stream.getTracks()
      tracks.forEach(track => track.stop())
    },

    updateDetailError (detErr) {
      this.detailError = detErr
    },
    closeDialog () {
      this.$refs.camera.$refs.video.pause()
      const tracks = this.$refs.camera.stream.getTracks()
      tracks.forEach(track => track.stop())
      this.modalFoto = false
      return this.modalFoto
    }
  }
}
</script>
