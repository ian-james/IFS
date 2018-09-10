/** There is an error on the tool page that is caused
  *  by angular that cannot be handled by cypresss
  * in order to fix this call this function
  * */

var login = {
  username: 'ryoung08@uoguelph.ca',
  password: 'cowscows'
}

function ignoreError(){
    cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.include('Unexpected token ;')
        done()
        return false
      })
}

export {login, ignoreError}
