import './commands'
import './tableCommands'
import '@testing-library/cypress/add-commands'
import '@shelex/cypress-allure-plugin'

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})