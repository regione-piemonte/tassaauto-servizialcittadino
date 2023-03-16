const fs = require('fs')
const mocha = require('mocha')
const assert = require('assert')
const describe = mocha.describe
const it = mocha.it

const axios = require('axios')

const axiosPublicConfig = {
  baseURL: 'http://cmpto1-haproxy01.site01.nivolapiemonte.it:10537'
}

const axiosPublicInstance = axios.create(axiosPublicConfig)

function getJsonBollobotTests () {
  const rawdata = fs.readFileSync('test/unit/specs/bot/tassaauto.bot.testcases.json')
  return JSON.parse(rawdata).bot_casi_test
}

describe('API Rest Km Bollobot', function () {
  describe('#bollobot - Risposta corretta API http://cmpto1-haproxy01.site01.nivolapiemonte.it:10537', function () {
    const testcases = getJsonBollobotTests()
    for (let i = 0; i < testcases.length; i++) {
      it('Risposta corretta a domanda "' + testcases[i].domanda + '"', function (done) {
        const testPromise =
        axiosPublicInstance
          .post(
            '/',
            { id: 1, service: 'query', body: { text: testcases[i].domanda } },
            { headers: { 'Content-Type': 'application/json' } })

        testPromise.then(function ({ data }) {
          try {
            const answers = data.result.answers
            assert(answers.length > 0, 'Estratte risposte')
            console.log('answers[0].index_ques: ' + answers[0].index_ques + ' - testcases[i].index_ques_atteso ' + testcases[i].index_ques_atteso)
            assert(answers[0].index_ques === testcases[i].index_ques_atteso, 'Risposta con index_ques corretto')
            done()
          } catch (err) {
            done(err)
          }
        }, done)
      })
    }
  })
})
