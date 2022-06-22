/// <reference types="cypress" />
import { webElements } from "../fixtures/fixtures.json"

describe('Business Critical Scenarios', () => {
    const ageColumn = 8

    before(() => {
        cy.visit('/')
        cy.acceptCookies()
        cy.findAllByText(/Sort and Tables/i).first().click()
        cy.get(webElements.darkModeBtn).click()
        cy.get('.site-description').as('siteDescription')
    })

    beforeEach(() => {
        cy.getTotalOfRowsInView().as('count')
        cy.get('table').find('tr').as('table')
        cy.get('[type="search"]').first().clear()
    })

    it('1. Verify visibility and existence of elements (with soft assert), along with the blog name', () => {
        cy.get('@siteDescription')
            .then(el => {
                cy.log(`The website is called: ${el.text()}`)
                cy.softAssert(el.length > 0, true, "expected this element to exist!");
                cy.softAssert(el.is(":visible"), true, "expected this element to be visible!");
            })

        cy.get('@siteDescription').softVisible('be.visible', 'It was expected this element to be visible')

        cy.getEntriesView().then(numOfEntries => {
            cy.log(`The amount of entries is: ${numOfEntries}`)

            cy.get('@table').then(ele => {
                let numOfRows = ele.length - 1
                cy.log(`The amount of rows is: ${numOfEntries}`)
                expect(numOfRows).to.eq(numOfEntries)
            })
        })

        cy.softAssertAll()
    });

    it('2. Update the table entry view field and verify matches the current amount of items displayed', () => {
        const entry = '50'
        let currentCount

        cy.get('@table')
            .then(count => {
                currentCount = count.length - 1
                cy.log(`The curren amount of items is ${currentCount}`)

                cy.setEntriesView(entry)
                    .should('have.value', entry)
                    .invoke('val')
                    .should('eq', entry)

                cy.getTotalItems().then((element) => {
                    cy.log(`The total amount of items is: ${element}`)

                    cy.getTotalOfRowsInView().then(newCount => {
                        cy.log(`Now, the amount of rows in this view is ${newCount}`)
                        cy.softAssert(element >= currentCount, true, 'Expected total items to be greater or equal than current rows itmes')
                        expect(newCount).not.to.eq(currentCount)
                    })
                })
            })

        cy.softAssertAll()
    })

    it('3. Do a search and check the amount of items decreases, then inspect table and check result', () => {
        cy.get('@table').then(ele => {
            const citizenName = 'Norma'
            let numOfRows = ele.length

            cy.log(`The amount of rows is: ${numOfRows}`)
            cy.doAsearch(citizenName)

            cy.getTotalOfRowsInView().then(newNumOfRows => {
                cy.log(`Now, the amount of rows is: ${newNumOfRows}`)
                cy.softAssert(newNumOfRows <= numOfRows, true, "expected new amount of rows is less than previous ones");
            })

            cy.inspectTableByText(citizenName)
                .then(el => {
                    cy.log(`This cell contains the value: ${el.text()}`)
                    cy.softAssert(el.length > 0, true, "expected this element to exist!");
                    cy.softAssert(el.is(":visible"), true, "expected this element to be visible!");
                    expect(el.text()).includes(citizenName)
                })

            cy.softAssertAll();
        })
    });

    it('4. Print each of the items existing in the table, count them, and verify URL and Title Page', () => {
        cy.get('@table')
            .each(ele => {
                cy.log(`Row items are: ${ele.text()}`)
            })
            .then(count => {
                let rowItems = count.length - 1
                cy.log(`The amount of row items is: ${rowItems}`)
                cy.softAssert(isNaN(rowItems), false, 'Expected row items to be a number')
            })

        cy.title().should('contain', 'Sort and Tables')

        cy.url().then(el => {
            expect(el).includes('sort-and-tables')
        })

        cy.softAssertAll();
    });

    it('5. Order the table by age, and verify if there is at least one record with specific years of age', () => {
        let ageValue = '23'
        cy.orderByColumn(ageColumn)
        cy.searchByColumn(ageColumn, ageValue).then(isValuePresent => {
            cy.log(`It's ${isValuePresent} that there's one citizen with ${ageValue} years of age`)
            expect(isValuePresent).to.be.true
        })
    });

})