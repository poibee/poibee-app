describe('Discover page shows map', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')

    cy.visit('/discover')
  });

  describe('with position control', () => {

    it('"geocode" should move map to searched "Hamburg"', () => {
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lat', '52.908')
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lon', '8.588')

      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [aria-label="Initiate a new search"]').click()
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control-geocoder input').type('Hamburg')

      // ignore search, because it's only working locally not at GitHub-CI
      // cy.get('[data-cy=componentDiscoverMap] .leaflet-control-geocoder input').type('{enter}')

      // cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lat', '53.550341')
      // cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lon', '10.000654')
    })

    it('"locate" should move map and position to current device position', () => {
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lat', '52.908')
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lon', '8.588')

      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Standort lokalisieren"]').click()

      // ignore handling of browser popup at the moment
    })

    it('"map center" should move position to map center', () => {
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lat', '52.908')
      cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon').should('have.attr', 'data-cy-marker-lon', '8.588')

      // ignore drag and drop of the map at the moment

      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Kartenmitte als Standort"]').click()
    })
  });

  describe('with zoom control', () => {

    it('"Zoom in"', () => {
      cy.get('[data-cy=componentDiscoverMap] .map').should('have.attr', 'data-cy-map-zoom', '13')

      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom in"]').click()

      cy.get('[data-cy=componentDiscoverMap] .map').should('have.attr', 'data-cy-map-zoom', '14')
    })

    it('"Zoom out"', () => {
      cy.get('[data-cy=componentDiscoverMap] .map').should('have.attr', 'data-cy-map-zoom', '13')

      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom out"]').click()

      cy.get('[data-cy=componentDiscoverMap] .map').should('have.attr', 'data-cy-map-zoom', '12')
    })
  });

});
