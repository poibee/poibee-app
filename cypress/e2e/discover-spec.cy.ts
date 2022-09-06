describe('Discover page', () => {

  const discoverPage = {
    visit: () => {
      cy.visit('/discover')
    }
  }

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');
    discoverPage.visit()
  });

  describe('with list view', () => {

    it('shows poi list', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').first().as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').should('have.text', 'church')
      cy.get('@christuskircheItem').find('ion-label p').should('have.text', 'Christuskirche')

      cy.get('app-discover-list ion-list ion-item').eq(1).as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').should('have.text', 'hotel')
      cy.get('@wasserburgItem').find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')

      cy.get('app-discover-list ion-list ion-item').last().as('marktplatzItem')
      cy.get('@marktplatzItem').find('ion-label h3').should('have.text', 'parking')
      cy.get('@marktplatzItem').find('ion-label p').should('have.text', 'Marktplatz')
    });

    it('navigates to poi details after poi click', () => {
      cy.get('app-discover-list ion-list ion-item').eq(1).as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Koordinaten:')
      cy.get('ion-content').contains('52.91009245 / 8.59079985')
      cy.get('ion-content').contains('Name:')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });
  });

});
