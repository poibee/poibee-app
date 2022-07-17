describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    // cy.title().contains('Ionic App')
    cy.contains('Inbox')
  })
})
