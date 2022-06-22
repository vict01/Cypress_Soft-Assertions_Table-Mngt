import { appData, credentials, webElements } from "../fixtures/fixtures.json"
const jsonAssertion = require("soft-assert")

Cypress.Commands.add('softAssert', (actual, expected, message) => {
    jsonAssertion.softAssert(actual, expected, message)
    if (jsonAssertion.jsonDiffArray.length) {
        jsonAssertion.jsonDiffArray.forEach(diff => {

            Cypress.log({
                name: 'Soft assertion error',
                displayName: 'softAssert',
                message: diff.error.message
            })

        })
    }
})

Cypress.Commands.add('softVisible', { prevSubject: true },
    (subject, expectedCondition, message) => {

        // translate expectedCondition to true/false
        const expected = expectedCondition === 'be.visible'
        const actual = subject.is(":visible")
        cy.softAssert(actual, expected, message)
    })

Cypress.Commands.add('softAssertAll', () => {
    jsonAssertion.softAssertAll()
    const testSoftAssertAll = () => jsonAssertion.softAssertAll()
    expect(testSoftAssertAll).not.throw()
})

Cypress.Commands.add('isTheElementPresent', (ele) => {
    cy.get('body').then($body => {
        if ($body.find(ele).length) return true
        else return false
    });
})

Cypress.Commands.add('waitUntilPageLoads', () => {
    window.onload = () => {
        cy.log('page is fully loaded');
    };
})

Cypress.Commands.add('waitUntilElementsLoad', (urlRequest) => {
    cy.intercept(urlRequest).as('elementsLoaded')
    cy.wait('@elementsLoaded')
})