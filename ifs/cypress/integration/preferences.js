/**
 *  Preference page tests
 *  Testing tool: Cypress
 *  Date: July 3rd 2018
 *  Author: Rhys Young
 */


 // store the session across tests
Cypress.Cookies.defaults({
    whitelist: function(cookie){
        return true
    }
})

describe('Preference page tests', function() {
    // if already logged in this will fail
    it('Visit login page', function() {
        // pages should take no more than 3 seconds to load
        cy.visit('http://localhost:8000', {timeout: 3000})
    })

    it('Login - correct', function(){
        cy.get('input[name="username"]').type('ryoung08@uoguelph.ca')
        cy.get('input[name="password"]').type('cowscows')
        cy.get('#loginFrm').submit()
        cy.url().should('contain', 'tool')
    })

    it('Go to preferences', function(){
        cy.visit('http://localhost:8000/preferences')
    })

    it('Update bio - bad characters', function(){
        cy.get("#student-bio").type('SELECT *')
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', '/preferences?err=bio')
        cy.get('.errorMessage').contains('Illegal characters in bio. Please try again.')
    }) 

    it('Update bio - success', function(){
        cy.get("#student-bio").type('test bio')
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', 'tool')
    })
})