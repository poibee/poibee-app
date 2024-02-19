import {DiscoverPage}  from "../pages/discover-page";

describe('Discover page shows map', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000)

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');

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

  describe('with navigation control', () => {

    it('should allow to navigate through pois', () => {
      discoverPage.detailToolbar().assertIsVisible(true)
      discoverPage.detailToolbar().assertText('Kein POI ausgewählt')

      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Information')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('2 / 7')
      discoverPage.detailToolbar().assertCategory('Parking')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('3 / 7')
      discoverPage.detailToolbar().assertCategory('Memorial')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('4 / 7')
      discoverPage.detailToolbar().assertCategory('Church')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('5 / 7')
      discoverPage.detailToolbar().assertCategory('Amenity')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('6 / 7')
      discoverPage.detailToolbar().assertCategory('Restaurant')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('7 / 7')
      discoverPage.detailToolbar().assertCategory('Hotel')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('7 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('6 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('5 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('4 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('3 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('2 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('1 / 7')

      discoverPage.map().navigator().previousClick()
      discoverPage.map().navigator().assertText('1 / 7')
    })
  });

  describe('with poi detail toolbar', () => {

    it('should shows poi details', () => {
      discoverPage.detailToolbar().assertText('Kein POI ausgewählt')

      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Information')
      discoverPage.detailToolbar().assertName('')

      discoverPage.map().navigator().nextClick()
      discoverPage.map().navigator().assertText('2 / 7')
      discoverPage.detailToolbar().assertCategory('Parking')
      discoverPage.detailToolbar().assertName('Marktplatz')
    })
  });

  describe('with elements on map', () => {

    // TODO #32 - test fails at CI pipeline
    xit('should show search distance circle', () => {
      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().distanceMarker().assertPosition(52.908, 8.588)
      discoverPage.map().distanceMarker().assertRadius(250)
    })

    it('should show poi markers', () => {
      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().markersLayer().assertIsVisible(true)
      discoverPage.map().markersLayer().assertNumberOfMarkers(9)

      discoverPage.map().markersLayer().marker(0).assertCssClass('leaflet-marker-icon')
      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')
      discoverPage.map().markersLayer().marker(1).assertImage('assets/category/information.png')
      discoverPage.map().markersLayer().marker(2).assertImage('assets/category/parking.png')
      discoverPage.map().markersLayer().marker(3).assertImage('assets/category/memorial.png')
      discoverPage.map().markersLayer().marker(4).assertImage('assets/category/church.png')
      discoverPage.map().markersLayer().marker(5).assertImage('assets/category/amenity.png')
      discoverPage.map().markersLayer().marker(6).assertImage('assets/category/restaurant.png')
      discoverPage.map().markersLayer().marker(7).assertImage('assets/category/hotel.png')
      discoverPage.map().markersLayer().marker(8).assertImage('assets/marker/poi-selection-mask.png')
    })

    it('should highlight marker of the selected poi', () => {
      discoverPage.detailToolbar().assertText('Kein POI ausgewählt')

      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().markersLayer().assertIsVisible(true)
      discoverPage.map().markersLayer().assertNumberOfMarkers(9)

      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')
      discoverPage.map().markersLayer().marker(0).zindex().assertLess(1001)

      discoverPage.map().markersLayer().marker(1).assertImage('assets/category/information.png')
      discoverPage.map().markersLayer().marker(1).zindex().assertGreaterEquals(999)

      discoverPage.map().markersLayer().marker(2).assertImage('assets/category/parking.png')
      discoverPage.map().markersLayer().marker(2).zindex().assertLess(1002)

      discoverPage.map().markersLayer().marker(3).assertImage('assets/category/memorial.png')
      discoverPage.map().markersLayer().marker(3).zindex().assertLess(1003)

      discoverPage.map().markersLayer().marker(4).assertImage('assets/category/church.png')
      discoverPage.map().markersLayer().marker(4).zindex().assertLess(1004)

      discoverPage.map().markersLayer().marker(5).assertImage('assets/category/amenity.png')
      discoverPage.map().markersLayer().marker(5).zindex().assertLess(1005)

      discoverPage.map().markersLayer().marker(6).assertImage('assets/category/restaurant.png')
      discoverPage.map().markersLayer().marker(6).zindex().assertLess(1006)

      discoverPage.map().markersLayer().marker(7).assertImage('assets/category/hotel.png')
      discoverPage.map().markersLayer().marker(7).zindex().assertLess(1007)

      discoverPage.map().markersLayer().marker(8).assertImage('assets/marker/poi-selection-mask.png')
      discoverPage.map().markersLayer().marker(8).zindex().assertGreaterEquals(2000)

      discoverPage.map().navigator().nextClick()
      discoverPage.map().markersLayer().marker(0).zindex().assertLess(1008)
      discoverPage.map().markersLayer().marker(1).zindex().assertLess(1009)
      discoverPage.map().markersLayer().marker(2).zindex().assertGreaterEquals(998)
      discoverPage.map().markersLayer().marker(3).zindex().assertLess(1010)
      discoverPage.map().markersLayer().marker(4).zindex().assertLess(1011)
      discoverPage.map().markersLayer().marker(5).zindex().assertLess(1012)
      discoverPage.map().markersLayer().marker(6).zindex().assertLess(1013)
      discoverPage.map().markersLayer().marker(7).zindex().assertLess(1014)
      discoverPage.map().markersLayer().marker(8).zindex().assertGreaterEquals(2000)

      discoverPage.map().navigator().previousClick()
      discoverPage.map().markersLayer().marker(0).zindex().assertLess(1015)
      discoverPage.map().markersLayer().marker(1).zindex().assertGreaterEquals(997)
      discoverPage.map().markersLayer().marker(2).zindex().assertLess(1016)
      discoverPage.map().markersLayer().marker(3).zindex().assertLess(1017)
      discoverPage.map().markersLayer().marker(4).zindex().assertLess(1018)
      discoverPage.map().markersLayer().marker(5).zindex().assertLess(1019)
      discoverPage.map().markersLayer().marker(6).zindex().assertLess(1020)
      discoverPage.map().markersLayer().marker(7).zindex().assertLess(1021)
      discoverPage.map().markersLayer().marker(8).zindex().assertGreaterEquals(2000)
    })

    it('should show spinner', () => {
      // TODO #32 - not working on GitHub-CI (and locally)

      discoverPage.map().spinner().assertIsExistent(true)
      discoverPage.map().spinner().assertIsVisible()
      discoverPage.map().spinner().assertIsExistent(false)
    })

    // TODO: #32 Fix ignored Cypress tests (failing on GitHub)
    // `<img src="assets/category/church.png" class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive" alt="" tabindex="0" style="margin-left: -16px; margin-top: -37px; width: 32px; height: 37px; transform: translate3d(31px, -20px, 0px); z-index: -20;">`
    // is being covered by another element:
    // `<input aria-label="search text" class="searchbar-input sc-ion-searchbar-md" placeholder="Filtere Ergebnisse" type="search" autocomplete="off" autocorrect="off" spellcheck="false">`
    it('should select poi when clicked', () => {
      discoverPage.detailToolbar().assertText('Kein POI ausgewählt')

      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Information')
      discoverPage.map().markersLayer().assertNumberOfMarkers(9)

      // click on church marker
      discoverPage.map().markersLayer().marker(4).assertImage('assets/category/church.png')
      discoverPage.map().markersLayer().marker(4).click()
      discoverPage.map().navigator().assertText('4 / 7')
      discoverPage.detailToolbar().assertCategory('Church')

      // click on restaurant marker
      discoverPage.map().markersLayer().marker(6).assertImage('assets/category/restaurant.png')
      discoverPage.map().markersLayer().marker(6).click()
      discoverPage.map().navigator().assertText('6 / 7')
      discoverPage.detailToolbar().assertCategory('Restaurant')
    })
  });

  describe('with filter control', () => {

    it('should filter pois by ignoring uppercase and lowercase', () => {
      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().markersLayer().assertIsVisible(true)
      discoverPage.map().markersLayer().assertNumberOfMarkers(9)

      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')
      discoverPage.map().markersLayer().marker(1).assertImage('assets/category/information.png')
      discoverPage.map().markersLayer().marker(2).assertImage('assets/category/parking.png')
      discoverPage.map().markersLayer().marker(3).assertImage('assets/category/memorial.png')
      discoverPage.map().markersLayer().marker(4).assertImage('assets/category/church.png')
      discoverPage.map().markersLayer().marker(5).assertImage('assets/category/amenity.png')
      discoverPage.map().markersLayer().marker(6).assertImage('assets/category/restaurant.png')
      discoverPage.map().markersLayer().marker(7).assertImage('assets/category/hotel.png')
      discoverPage.map().markersLayer().marker(8).assertImage('assets/marker/poi-selection-mask.png')

      discoverPage.filter().type('markt');
      discoverPage.map().markersLayer().assertNumberOfMarkers(4)
      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')
      discoverPage.map().markersLayer().marker(1).assertImage('assets/marker/poi-selection-mask.png')
      discoverPage.map().markersLayer().marker(2).assertImage('assets/category/parking.png')
      discoverPage.map().markersLayer().marker(3).assertImage('assets/category/amenity.png')

      discoverPage.filter().type('X');
      discoverPage.map().markersLayer().assertNumberOfMarkers(1)
      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')

      discoverPage.filter().clear();
      discoverPage.map().markersLayer().assertNumberOfMarkers(9)

      discoverPage.filter().type('DENKMAL');
      discoverPage.map().markersLayer().assertNumberOfMarkers(3)
      discoverPage.map().markersLayer().marker(0).assertImage('assets/marker/marker-icon.png')
      discoverPage.map().markersLayer().marker(1).assertImage('assets/marker/poi-selection-mask.png')
      discoverPage.map().markersLayer().marker(2).assertImage('assets/category/memorial.png')
    });
  });

  describe('with sort control', () => {

    it('should update selected poi after sort selection', () => {
      discoverPage.detailToolbar().assertText('Kein POI ausgewählt')

      discoverPage.search().openDialog()
      discoverPage.search().executeSearch()

      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Information')

      // sort by name
      discoverPage.sort().open()
      discoverPage.sort().clickElement(1)
      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Hotel')

      // sort by category
      discoverPage.pressEscape();
      discoverPage.sort().open()
      discoverPage.sort().clickElement(2)
      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Church')

      // sort by relevance
      discoverPage.pressEscape();
      discoverPage.sort().open()
      discoverPage.sort().clickElement(3)
      discoverPage.map().navigator().assertText('1 / 7')
      discoverPage.detailToolbar().assertCategory('Amenity')
    })
  });
});
