<template>
  <div class="space-section">
    <h2>
      Dati del pagamento
    </h2>
    <table class="table table-row">
      <tr>
        <th scope="row">
          Prestatore del servizio
        </th>
        <td>
          {{ ricevutaPagam.banca.descrizione }}
        </td>
      </tr>
      <tr
        v-if="ricevutaPagam.identificativoPagamento !== undefined && ricevutaPagam.identificativoPagamento !== null">
        <!-- campo valorizzato solo per PagoBollo e non per PagoRate, cfr issue 127 -->
        <th scope="row">
          ID pagamento
        </th>
        <td>
          {{ ricevutaPagam.identificativoPagamento }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          ID transazione
        </th>
        <td>
          {{ ricevutaPagam.identificativoTransazione }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          ID riscossione
        </th>
        <td>
          {{ ricevutaPagam.idRiscossione }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          IUV
        </th>
        <td>
          {{ ricevutaPagam.iuv }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          Data del pagamento
        </th>
        <td>
          {{ ricevutaPagam.dataOraPagamento | getDate }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          Esito del pagamento
        </th>
        <td>
          {{ ricevutaPagam.esitoPagamento }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          Beneficiario
        </th>
        <td>
          Regione {{ ricevutaPagam.regione }}
        </td>
      </tr>
      <tr>
        <th scope="row">
          <strong>
            Totale pagamento
          </strong>
        </th>
        <td>
          {{ ricevutaPagam.importo | formatCurrency }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DatiPagamento',
  props: {
    ricevutaPagam: { type: Object, required: true }
  },
  data () {
    return {
    }
  }
}
</script>
