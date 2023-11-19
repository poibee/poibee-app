class DiscoverPage {

  open() {
    cy.visit('/discover')
    return this;
  }

  mapPositionMarker(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.leaflet-pane.leaflet-marker-pane .leaflet-marker-icon')
  }

  mapLeafletNative(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .map')
  }

  mapControlPositionByGeocodeSearchOpen(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control [aria-label="Initiate a new search"]')
  }

  mapControlPositionByGeocodeSearchTextfield(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control-geocoder input')
  }

  mapControlPositionByDeviceLocation(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Standort lokalisieren"]');
  }

  mapControlPositionByMapCenter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Kartenmitte als Standort"]')
  }

  mapControlZoomIn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom in"]')
  }

  mapControlZoomOut(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy=componentDiscoverMap] .leaflet-control [title="Zoom out"]')
  }
}

export default DiscoverPage
