/**
 *  Preference page tests
 *  Testing tool: Cypress
 *  Date: July 3rd 2018
 *  Author: Rhys Young
 */

 import {ignoreError} from './includes/functions.js'
 import {login as login} from './includes/functions.js'

 // store the session across tests
Cypress.Cookies.defaults({
    whitelist: function(cookie){
        return true
    }
})

describe('Login and go to preferences', function() {
    // if already logged in this will fail
    it('Visit login page', function() {
        // pages should take no more than 3 seconds to load
        cy.visit('http://localhost:3000', {timeout: 3000})
    })

    it('Login - correct', function(){
        ignoreError();
        cy.get('input[name="username"]').type(login.username)
        cy.get('input[name="password"]').type(login.password)
        cy.get('#loginFrm').submit()
        cy.url().should('contain', 'tool')
    })

    it('Go to preferences', function(){
        cy.visit('http://localhost:3000/preferences')
    })
})

describe('Update preferences information', function() {
    it('Update bio - bad characters', function(){
        cy.get("#student-bio").type('SELECT *')
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', '/preferences?err=bio')
        cy.get('.errorMessage').contains('Illegal characters in bio. Please try again.')
    }) 

    it('Update bio - success', function(){
        ignoreError()
        cy.get("#student-bio").clear().type('test bio')
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', 'tool')
    })

    /**
     * it is too hard to switch what option is used, so we just choose one and make usre its selected
     */
    it('Change Discipline', function(){
        ignoreError()
        cy.visit('http://localhost:3000/preferences')
        cy.get('#pref-toolSelect').select('Writing')
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', 'tool')
        cy.visit('http://localhost:3000/preferences')
        cy.get('#pref-toolSelect').should('have.value', 'Writing')
    })

    it('Check box', function(){
        ignoreError()
        cy.visit('http://localhost:3000/preferences')
        cy.get('#pref-tipsAllowed').check()
        cy.get('#preferencesFrm').submit()
        cy.url().should('contain', 'tool')
        cy.visit('http://localhost:3000/preferences')
        cy.get('#pref-tipsAllowed').should('be.checked')
    })
})