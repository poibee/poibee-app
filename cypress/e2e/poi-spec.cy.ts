describe('POI detail page', () => {

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.visit('/poi/way-12345678')
  });

  describe('shows poi details', () => {

    it('with every attribute', () => {
      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Koordinaten:')
      cy.get('ion-content').contains('52.91009245 / 8.59079985')
      cy.get('ion-content').contains('Name:')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });
  });

});
