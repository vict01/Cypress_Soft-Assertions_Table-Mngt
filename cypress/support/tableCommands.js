import { webElements } from "../fixtures/fixtures.json"

Cypress.Commands.add('acceptCookies', () => {
    cy.isTheElementPresent(webElements.cookiesBox).then(el => {
        if (el) cy.get(webElements.cookiesCloseBtn).click()
    })
})

Cypress.Commands.add('setEntriesView', (entry) => {
    cy.get(webElements.entryViewBtn).select(entry)
})

Cypress.Commands.add('getEntriesView', () => {
    cy.get(webElements.entryViewBtn).invoke('val').then(el => {
        let numOfEntries = parseInt(el)
        return numOfEntries
    })
})

Cypress.Commands.add('getTotalItems', () => {
    cy.findByText(/Showing /i).then((element) => {
        let totalOfItems = element.text()
        let begining = totalOfItems.indexOf('of')
        let end = totalOfItems.indexOf(' ent')
        totalOfItems = totalOfItems.substring(begining + 3, end)
        totalOfItems = parseInt(totalOfItems)
        return totalOfItems
    })
})

Cypress.Commands.add('getTotalOfRowsInView', () => {
    cy.get('table').find('tr').then(el => {
        let count = el.length - 1
        return count
    })
})

Cypress.Commands.add('doAsearch', (search) => {
    cy.get('[type="search"]').first()
        .should('be.visible')
        .and('be.enabled')
        .type(search)
})

Cypress.Commands.add('inspectTableByText', (search) => {
    return cy.get('table').contains('td', search)
})

Cypress.Commands.add('orderByColumn', (columnName) => {
    cy.get(`.row-1 > .column-${columnName}`).click()
})

Cypress.Commands.add('searchByColumn', (columnName, search) => {
    let isValuePresent = false
    cy.get(`.column-${columnName}`)
        .each(ele => {
            if (ele.text() === search) {
                isValuePresent = true
                if (isValuePresent) return false
            }
        }).then(() => {
            return isValuePresent
        })
})