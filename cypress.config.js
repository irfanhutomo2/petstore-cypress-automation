const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    env: {
      PETSTORE_API: "https://petstore.swagger.io/v2"
    },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true
    }
  }
});