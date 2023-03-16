export default {
  hasTrueValue (obj, key) {
    if (obj[key] === null || obj[key] === undefined) return false
    if (obj[key].value) return true
    return false
  },

  oggettoDomandaDisabili (oggDis) {
    if (oggDis.primaRichiestaEsenzione !== null) {
      if (oggDis.primaRichiestaEsenzione.checked) return 'primaRichiestaEsenzione'
    }
    if (oggDis.trasferimentoEsenzione !== null) {
      if (oggDis.trasferimentoEsenzione.checked) return 'trasferimentoEsenzione'
    }
    return ''
  },

  dichiarazioneDomandaDisabili (dichDis) {
    if (dichDis.proprietarioDisabile !== null) {
      if (dichDis.proprietarioDisabile.checked) return 'proprietarioDisabile'
    }
    if (dichDis.disabileFamiliare !== null) {
      if (dichDis.disabileFamiliare.checked) return 'disabileFamiliare'
    }
    if (dichDis.disabileComproprietario !== null) {
      if (dichDis.disabileComproprietario.checked) return 'disabileComproprietario'
    }
    return ''
  },
  dichiarazioneProprietarioDomandaDisabili (dichPropDis) {
    if (dichPropDis === null || dichPropDis === undefined) return ''
    if (dichPropDis.riconosciutoPersonaDisabile) return 'riconosciutoPersonaDisabile'
    if (dichPropDis.personaDisabilitaPsichicaMentale) return 'personaDisabilitaPsichicaMentale'
    if (dichPropDis.personaVedenteIpovedente) return 'personaVedenteIpovedente'
    if (dichPropDis.invalidoRidotteImpediteCapacitaMotorie) return 'invalidoRidotteImpediteCapacitaMotorie'
    return ''
  },
  dichiarazioneDisabileFamiliareDomandaDisabili (dichDisFamDis) {
    if (dichDisFamDis === null || dichDisFamDis === undefined) return ''
    if (dichDisFamDis.disabilitaGrave) return 'disabilitaGrave'
    if (dichDisFamDis.disabilitaPsichicaMentale) return 'disabilitaPsichicaMentale'
    if (dichDisFamDis.disabilitaNonVedenteIpovedente) return 'disabilitaNonVedenteIpovedente'
    return ''
  },
  dichiarazioneDisabileComproprietarioDomandaDisabili (dichDisComp) {
    if (dichDisComp === null || dichDisComp === undefined) return ''
    if (dichDisComp.disabilitaGrave) return 'disabilitaGrave'
    if (dichDisComp.disabilitaPsichicaMentale) return 'disabilitaPsichicaMentale'
    if (dichDisComp.disabilitaNonVedenteIpovedente) return 'disabilitaNonVedenteIpovedente'
    if (dichDisComp.comproprietario) return 'comproprietario'
    return ''
  }
}
