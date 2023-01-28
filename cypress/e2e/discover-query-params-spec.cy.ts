describe('Discover page evaluates URL query parameters', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000);

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');
  });

  describe('without query parameters ', () => {

    beforeEach(() => {
      cy.visit('/discover')
    });

    it('initializes search dialog with default parameters', () => {
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=componentMyPositionMap]').should('have.attr', 'ng-reflect-my-position', '{"lat":52.908,"lon":8.588}')
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Alles")
    })

    it('does not start search', () => {
      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 1)
    })
  })

  describe('with query parameter "position" ', () => {

    it('initializes search dialog with given position', () => {
      cy.visit('/discover?position=22.2,11.1')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=componentMyPositionMap]').should('have.attr', 'ng-reflect-my-position', '{"lat":22.2,"lon":11.1}')
    })

    it('does start search with given position', () => {
      cy.visit('/discover?position=22.2,11.1')

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)
      cy.get('[data-cy=componentDiscoverMap]').should('have.attr', 'ng-reflect-initial-map-center', '{"lat":22.2,"lon":11.1}')
    })

    it('ignores invalid parameter for position and uses default value', () => {
      cy.visit('/discover?position=invalid')

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 1)
      cy.get('[data-cy=componentDiscoverMap]').should('have.attr', 'ng-reflect-initial-map-center', '{"lat":52.908,"lon":8.588}')
    })
  })

  describe('with query parameter "distance" ', () => {

    it('initializes search dialog with given distance', () => {
      cy.visit('/discover?distance=10000')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '10 km, Maximale Entfernung')
    })

    it('does start search with given distance', () => {
      cy.visit('/discover?distance=10000')

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)

      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.length', 1)
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.attr', 'fill', '#ff7777')
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should("have.attr", 'd').and("match", /109 0 1,0 218,0 a109,109 0 1,0 -218,0 /);
    })

    it('ignores invalid parameter for distance and uses default value', () => {
      cy.visit('/discover?distance=invalid')

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 1)

      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.length', 1)
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.attr', 'fill', '#ff7777')
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should("have.attr", 'd').and("match", /1 0 1,0 2,0 a1,1 0 1,0 -2,0 /);
    })
  })

  describe('with query parameter "category" ', () => {

    it('initializes search dialog with given category', () => {
      cy.visit('/discover?category=restaurant')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Restaurant")
    })

    it('does start search with given category', () => {
      cy.visit('/discover?category=restaurant')

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)
    })

    it('ignores invalid parameter for category and uses default value', () => {
      cy.visit('/discover?category=invalid')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Alles")
    })
  })

});
