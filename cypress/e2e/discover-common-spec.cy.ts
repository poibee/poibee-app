import {DiscoverPage} from "../pages/discover-page";

describe('Discover page', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');

    discoverPage.open()
  });

  describe('with common features', () => {

    it('should show search button for search dialog', () => {
      discoverPage.search().openDialog()
      discoverPage.search().distance().assertDistance('0,25 km, Maximale Entfernung')
    })

    it('should show toggle button to switch between map and list', () => {
      discoverPage.toggleView().assertMap()
      discoverPage.list().assertIsVisible(false)
      discoverPage.map().assertIsVisible(true)
      discoverPage.detailToolbar().assertIsVisible(true)

      discoverPage.toggleView().toggle()
      discoverPage.toggleView().assertList()
      discoverPage.list().assertIsVisible(true)
      discoverPage.map().assertIsVisible(false)
      discoverPage.detailToolbar().assertIsVisible(false)

      discoverPage.toggleView().toggle()
      discoverPage.toggleView().assertMap()
      discoverPage.list().assertIsVisible(false)
      discoverPage.map().assertIsVisible(true)
      discoverPage.detailToolbar().assertIsVisible(true)
    })
  })

  describe('with search dialog', () => {

    beforeEach(() => {
      discoverPage.search().openDialog()
    });

    it('should have distance selection', () => {
      discoverPage.search().distance().assertDistance('0,25 km, Maximale Entfernung')

      discoverPage.search().distance().click()
      discoverPage.search().distance().popupAssertCount(11)
      discoverPage.search().distance().assertSelectedElement('0,25 km')
      discoverPage.search().distance().clickElement(5)
      discoverPage.search().distance().assertDistance('5 km, Maximale Entfernung')

      discoverPage.search().executeSearch()
      // TODO #32 - not working on GitHub-CI (and locally)
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=all&distance=5000')
    });

    it('should have category selection by favorite buttons', () => {
      discoverPage.search().category().assertButtonCategory('Alles')
      discoverPage.search().category().assertFavoriteButtonsCount(9)

      discoverPage.search().category().clickFavoriteButtonsElement(5)
      discoverPage.search().category().assertButtonCategory('Spielplatz')

      discoverPage.search().executeSearch()
      // TODO #32  - not working on GitHub-CI
      // cy.get('@search-pois')
      //  .its('request.url')
      //  .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=playground&distance=250')
    });

    // TODO #92 - enable E2E again
    xit('should have category selection by category dialog', () => {
      // TODO #32  - not working on GitHub-CI
      discoverPage.search().category().assertButtonCategory('Alles')
      discoverPage.search().category().openDialog()

      discoverPage.search().category().dialog().assertTitle('Alles')
      discoverPage.search().category().dialog().mainItemsAssertCount(8)
      discoverPage.search().category().dialog().mainItemsAssertChecked('Alles')
      discoverPage.search().category().dialog().mainItemsAssertLabel(7, 'Touristik')
      discoverPage.search().category().dialog().mainItemsClick(7)

      discoverPage.search().category().dialog().subItemsAssertCount(7, 10)
      discoverPage.search().category().dialog().subItemsAssertLabel(7, 5, 'Hotel')
      discoverPage.search().category().dialog().subItemsClick(7, 5)

      discoverPage.search().category().dialog().executeSelection()
      discoverPage.search().category().assertButtonCategory('Hotel')

      discoverPage.search().executeSearch()
      // TODO #32  - not working on GitHub-CI
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=hotel&distance=250')
    });

    // TODO #92 - enable E2E again
    xit('should update distance circle on map', () => {
      // TODO #32  - not working on GitHub-CI
      discoverPage.search().distance().assertDistance('0,25 km, Maximale Entfernung')
      discoverPage.search().map().assertNumberOfGemetries(1)
      discoverPage.search().map().assertGeometryColor('#ff7777')
      discoverPage.search().map().assertGeometryValues(/M13.*/)

      discoverPage.search().distance().click()
      discoverPage.search().distance().clickElement(5)
      discoverPage.search().map().assertGeometryValues(/M-29.*/)
    });

    // TODO #92 - enable E2E again
    xit('should have zoom buttons at the map', () => {
      // TODO #32  - not working on GitHub-CI
      // actual: 'z-index: 16; transform: translate3d(2px, 2px, 0px) scale(8);'
      discoverPage.search().map().assertZoomStyle('z-index: 16; transform: translate3d(-1314px, -1636px, 0px) scale(8);')

      discoverPage.search().map().zoomOutClick()
      discoverPage.search().map().assertZoomStyle('z-index: 17; transform: translate3d(-563px, -701px, 0px) scale(4);')
    });
  });
});
