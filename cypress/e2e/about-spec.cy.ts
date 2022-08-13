describe('About page', () => {

  const aboutPage = {
    visit: () => {
      cy.visit('/about')
    },

    title: () => {
      return 'Softwareentwicklung'
    },
  }

  it('shows About page', () => {
    aboutPage.visit()
    cy.contains(aboutPage.title())
  });
});
