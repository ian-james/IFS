/**
 *  Login page tests
 *  Testing tool: Cypress
 *  Date: July 3rd 2018
 *  Author: Rhys Young
 */

describe('Login page tests', function() { 
    it('Visit page', function() {
        // pages should take no more than 3 seconds to load
        cy.visit('http://localhost:8000', {timeout: 3000})
    })

    it('Incorrect inputs', function(){
        cy.get('input[name="username"]').type('test')
        // have to  click away from username field 
        cy.contains('Welcome').click()
        cy.get('#inputEmail-error').contains('Your email must be in the form of name@domain.com')
        cy.get('input[name="password"]').type('test')
        // have to click away from password field
        cy.contains('Welcome').click()
        cy.get('#pwd-error').contains('Your password must be at least 8 characters long')
    })

    it('Login - incorrect', function(){
        cy.get('input[name="username"]').type('test@uoguelph.ca')
        cy.get('input[name="password"]').type('testtest')
        cy.get('#loginFrm').submit()
        // should be on the same page
        cy.url().should('contain', '/login')
        // should have an error message display
        cy.get('.errorMessage').contains('Incorrect username or password')
    })

    it('Login - correct', function(){
        cy.get('input[name="username"]').type('ryoung08@uoguelph.ca')
        cy.get('input[name="password"]').type('cowscows')
        cy.get('#loginFrm').submit()
        cy.url().should('contain', 'tool')
    })
  })