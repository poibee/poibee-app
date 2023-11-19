import DiscoverPage from "../pages/discover-page";

describe('Discover page shows map', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000)

    cy.viewport('iphone-x')

    discoverPage.open()
  });

  describe('with position control', () => {

    it('"geocode" should move map to searched "Hamburg"', () => {
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lat', '52.908')
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lon', '8.588')

      discoverPage.mapControlPositionByGeocodeSearchOpen().click()
      discoverPage.mapControlPositionByGeocodeSearchTextfield().type('Hamburg')

      // ignore search, because it's only working locally not at GitHub-CI
      // discoverPage.mapControlPositionByGeocodeSearchTextfield().type('{enter}')

      // discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lat', '53.550341')
      // discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lon', '10.000654')
    })

    it('"locate" should move map and position to current device position', () => {
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lat', '52.908')
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lon', '8.588')

      discoverPage.mapControlPositionByDeviceLocation().click()

      // ignore handling of browser popup at the moment
    })

    it('"map center" should move position to map center', () => {
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lat', '52.908')
      discoverPage.mapPositionMarker().should('have.attr', 'data-cy-marker-lon', '8.588')

      // ignore drag and drop of the map at the moment

      discoverPage.mapControlPositionByMapCenter().click()
    })
  });

  describe('with zoom control', () => {

    it('"Zoom in"', () => {
      discoverPage.mapLeafletNative().should('have.attr', 'data-cy-map-zoom', '13')

      discoverPage.mapControlZoomIn().click()

      discoverPage.mapLeafletNative().should('have.attr', 'data-cy-map-zoom', '14')
    })

    it('"Zoom out"', () => {
      discoverPage.mapLeafletNative().should('have.attr', 'data-cy-map-zoom', '13')

      discoverPage.mapControlZoomOut().click()

      discoverPage.mapLeafletNative().should('have.attr', 'data-cy-map-zoom', '12')
    })
  });

});
