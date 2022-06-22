const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://website.multiformis.com/',
        setupNodeEvents(on, config) {
            allureWriter(on, config)
            return config;
        }
    },
    viewportWidth: 2300,
    viewportHeight: 1800,
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false,
    reporterOptions: {
        reportDir: 'cypress/reports/html',
        charts: true,
        reportPageTitle: 'My Test Suite',
        embeddedScreenShots: true,
        inLineAssets: true,
        video: true,
    }
});