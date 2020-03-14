describe('My First Test', function() {
  it('goes to /login and finds the navbar', function() {
    cy.visit('http://localhost:8080/login')
    cy.get('#nav')
  })
})