export default {
  hasTrueValue (obj, key) {
    if (obj[key] === null || obj[key] === undefined) return false
    if (obj[key].value) return true
    return false
  },
  // oggetto domanda restituzione
  oggettoDomandaRestituzione (oggRes) {
    if (oggRes.doppioPagamento !== null) {
      if (oggRes.doppioPagamento) return 'doppioPagamento'
    }
    if (oggRes.pagamentoEccessivo !== null) {
      if (oggRes.pagamentoEccessivo.checked) return 'pagamentoEccessivo'
    }
    if (oggRes.pagamentoNonDovuto !== null) {
      if (oggRes.pagamentoNonDovuto.checked) return 'pagamentoNonDovuto'
    }
    if (oggRes.perditaDiPossesso !== null) {
      if (oggRes.perditaDiPossesso.checked) return 'perditaDiPossesso'
    }
    return ''
  },
  pagamentoEccessivoRestituzione (pagRes) {
    return pagRes.erroreMateriale ? 'erroreMateriale' : pagRes.targaErrata ? 'targaErrata' : ''
  },
  perditaDiPossessoRestituzione (perRes) {
    return perRes.restituzioneDifferenza ? 'restituzioneDifferenza' : perRes.restituzionePeriodo ? 'restituzionePeriodo' : ''
  },
  // modalità restituzione
  modalitaRestituzione (modRes) {
    if (modRes.accreditoCc !== null) {
      if (modRes.accreditoCc.checked) return 'accreditoCc'
    }
    if (modRes.compensazione !== null) {
      if (modRes.compensazione.checked) return 'compensazione'
    }
    return ''
  },
  compensazioneRestituzione (compRes) {
    return compRes.altroSoggetto ? 'altroSoggetto' : compRes.miaProprieta ? 'miaProprieta' : ''
  }
}
