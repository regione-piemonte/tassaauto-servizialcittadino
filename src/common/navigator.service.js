export default {
  checkInternetConnection () {
    if (navigator.onLine === false) {
      alert('Per proseguire è necessario attivare la connessione Internet.')
      return false
    }
    return true
  }
}
