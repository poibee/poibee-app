describe('Credit page', () => {

  const creditPage = {
    visit: () => {
      cy.visit('/credit')
    },

    title: () => {
      return 'Openstreetmap'
    },
  }

  it('shows Credit page', () => {
    creditPage.visit()
    cy.contains(creditPage.title())
  });

});
