describe('Discover page shows map', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')

    cy.visit('/discover')
  });

  describe('with position control', () => {

    it('"geocode"', () => {
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [aria-label="Initiate a new search"]').click({ multiple: true })
    })

    it('"locate"', () => {
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Standort lokalisieren"]').click()
    })

    it('"map center"', () => {
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Kartenmitte als Standort"]').click()
    })
  });

  describe('with zoom control', () => {

    it('"Zoom in"', () => {
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom in"]')
    })

    it('"Zoom out"', () => {
      cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom out"]')
    })
  });

});
