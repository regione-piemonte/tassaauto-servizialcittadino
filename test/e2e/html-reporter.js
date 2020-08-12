var HtmlReporter = require('nightwatch-html-reporter')
var reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory: 'test/e2e/reports',
  uniqueFilename: true
})

module.exports = {
  write: function (results, options, done) {
    reporter.fn(results, done)
  }
}
