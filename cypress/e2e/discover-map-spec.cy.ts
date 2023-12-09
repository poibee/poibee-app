import {DiscoverPage}  from "../pages/discover-page";

describe('Discover page shows map', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000)

    cy.viewport('iphone-x')

    discoverPage.open()
  });

  describe('with position control', () => {

    it('"geocode" should move map to searched "Hamburg"', () => {
      discoverPage.map().assertPosition(52.908, 8.588);
      discoverPage.map().positionMarker().assertPosition(52.908, 8.588);

      discoverPage.map().buttons().positionByGeocodeSearch().search('Hamburg')
      // ignore search, because it's only working locally not at GitHub-CI
      // discoverPage.map().buttons().positionByGeocodeSearch().execute()

      // discoverPage.map().assertPosition(53.550341, 10.000654);
      // discoverPage.map().positionMarker().assertPosition(53.550341, 10.000654);
    })

    it('"locate" should move map and position to current device position', () => {
      discoverPage.map().assertPosition(52.908, 8.588);
      discoverPage.map().positionMarker().assertPosition(52.908, 8.588);

      discoverPage.map().buttons().positionByDeviceLocation().click()

      // ignore handling of browser popup at the moment
    })

    it('"map center" should move position to map center', () => {
      discoverPage.map().assertPosition(52.908, 8.588);
      discoverPage.map().positionMarker().assertPosition(52.908, 8.588);

      // ignore drag and drop of the map at the moment

      discoverPage.map().buttons().positionByMapCenter().click()
    })
  });

  describe('with zoom control', () => {

    it('"Zoom in" should map zoom in', () => {
      discoverPage.map().assertZoom(13);

      discoverPage.map().buttons().zoomIn().click()

      discoverPage.map().assertZoom(14);
    })

    it('"Zoom out" should map zoom out', () => {
      discoverPage.map().assertZoom(13);

      discoverPage.map().buttons().zoomOut().click()

      discoverPage.map().assertZoom(12);
    })
  });

});
