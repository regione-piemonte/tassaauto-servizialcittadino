export default {
  hasTrueValue (obj, key) {
    if (obj[key] === null || obj[key] === undefined) return false
    if (obj[key].value) return true
    return false
  },

  motivoOssAvvAccPagato (accPag) {
    if (accPag === null || accPag === undefined) return ''
    if (accPag.pagamentiCorretti !== null && accPag.pagamentiCorretti) return 'pagamentiCorretti'
    if (accPag.targaErrata !== null && accPag.targaErrata) return 'targaErrata'
    if (accPag.scadenzaErrata !== null && accPag.scadenzaErrata) return 'scadenzaErrata'
    if (accPag.veicoloRitargato !== null && accPag.veicoloRitargato) return 'veicoloRitargato'
    if (accPag.pagamentoAltraRegioneProvincia !== null && accPag.pagamentoAltraRegioneProvincia) return 'pagamentoAltraRegioneProvincia'
    return ''
  },

  motivoOssAvvAccNonPagato (accNonPag) {
    if (accNonPag === null || accNonPag === undefined) return ''
    if (this.hasTrueValue(accNonPag, 'grigliaVenditaVeicolo')) return 'venduto'
    if (this.hasTrueValue(accNonPag, 'grigliaRadiatoDemolizione')) return 'radiatoDemolizione'
    if (this.hasTrueValue(accNonPag, 'grigliaRadiatoEsportazione')) return 'esportato'
    if (this.hasTrueValue(accNonPag, 'grigliaPrivazioneDisponibilita')) return 'nonDisponibile'
    if (this.hasTrueValue(accNonPag, 'grigliaVeicoloMaiPosseduto')) return 'maiPosseduto'
    if (this.hasTrueValue(accNonPag, 'grigliaTrasferimentoRegione')) return 'trasferitoRegione'
    if (this.hasTrueValue(accNonPag, 'grigliaEsenzioni')) return 'esentato'
    if (this.hasTrueValue(accNonPag, 'grigliaCompetevaAltroSoggetto')) return 'competevaAltroSoggetto'
    return ''
  },

  motivoOssAvvAccAltroMotivo (altroMotivo) {
    if (altroMotivo === null || altroMotivo === undefined) return ''
    if (this.hasTrueValue(altroMotivo, 'grigliaDirittoRiduzione')) return 'dirittoRiduzione'
    if (this.hasTrueValue(altroMotivo, 'grigliaDatiTecniciErrati')) return 'datiVeicoloRettifica'
    return ''
  },

  motivoOssAvvScadenza (attr) {
    if (attr.venduto !== null && attr.venduto.value) return 'venduto'
    if (attr.radiatoDemolizione !== null && attr.radiatoDemolizione.value) return 'radiatoDemolizione'
    if (attr.radiato !== null && attr.radiato.value) return 'esportato'
    if (attr.esenzioni !== null && attr.esenzioni.value) return 'esentato'
    if (attr.disponibilitaPrivata !== null && attr.disponibilitaPrivata.value) return 'nonDisponibile'
    if (attr.isNotIntestatario !== null && attr.isNotIntestatario.value) return 'maiPosseduto'
    if (attr.trasferimentoRegione !== null && attr.trasferimentoRegione.value) return 'trasferitoRegione'
    if (attr.datiVeicoloRettifica !== null && attr.datiVeicoloRettifica.value) return 'datiVeicoloRettifica'
    return ''
  },

  tipoEsenzione (attrEsenz) {
    if (attrEsenz !== null && attrEsenz.value) {
      if (attrEsenz.disabili !== null && attrEsenz.disabili.value) return 'esentatoDisabili'
      if (attrEsenz.altroMotivo !== null && attrEsenz.altroMotivo.value) return 'esentatoAltroMotivo'
      if (attrEsenz.impiantoGplMetano !== null && attrEsenz.impiantoGplMetano.value) return 'esentatoImpianto'
    }
    return ''
  },

  tipoEsenzioneAcc (attrEsenz) {
    if (attrEsenz !== null && attrEsenz.value) {
      if (attrEsenz.grigliaEsenzioniDisabili !== null && attrEsenz.grigliaEsenzioniDisabili.value) return 'esentatoDisabili'
      if (attrEsenz.grigliaEsenzioniAltroMotivo !== null && attrEsenz.grigliaEsenzioniAltroMotivo.value) return 'esentatoAltroMotivo'
      if (attrEsenz.grigliaInstallazioneGplMetano !== null && attrEsenz.grigliaInstallazioneGplMetano.value) return 'esentatoImpianto'
    }
    return ''
  }
}
