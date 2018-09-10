/**
 *  About page tests
 *  Testing tool: Cypress
 *  Date: July 3rd 2018
 *  Author: Rhys Young
 */

describe('Quick about page tests', function() {
    it('Visit login page', function() {
        // pages should take no more than 3 seconds to load
        cy.visit('http://localhost:3000', {timeout: 3000})
    })

    it('Click about', function(){
        cy.get('a[href="/about"]').click()
        cy.url().should('contain', '/about')
    })
})