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

describe('Login and go to dashboard', function() {
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

   it('Go to dashboard', function(){
       cy.visit('http://localhost:3000/dashboard')
   })
})

describe('Check routes', function() {
   it('Check student skills route', function(){
       cy.get('a[href="/skills"]').click()
       cy.url().should('contain', 'skills')
       cy.visit('http://localhost:3000/dashboard')
   })

   it('Check student activity route', function(){
       cy.get('a[href="/studentModel"]').click()
       cy.url().should('contain', 'studentModel')
       cy.visit('http://localhost:3000/dashboard')
   })

   it('Check class activity route', function(){
       cy.get('a[href="/socialModel"]').click()
       cy.url().should('contain', 'socialModel');
       cy.visit('http://localhost:3000/dashboard')
   })
})