import {DiscoverPage} from "../pages/discover-page";

describe('Discover page evaluates URL query parameters', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000)

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg')
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois')
  })

  describe('without query parameters ', () => {

    beforeEach(() => {
      discoverPage.open()
    })

    it('initializes search dialog with default parameters', () => {
      discoverPage.search().openDialog()
      discoverPage.search().map().assertCenter('{"lat":52.908,"lon":8.588}')
      discoverPage.search().distance().assertDistance('0,25 km, Maximale Entfernung')
      discoverPage.search().category().assertCategory('Alles')
    })

    it('does not start search', () => {
      discoverPage.map().assertPosition(52.908,8.588)
      discoverPage.map().poiMarkers().assertEmpty()
    })
  })

  describe('with query parameter "position" ', () => {

    it('initializes search dialog with given position', () => {
      discoverPage.openWithQuery('?position=22.2,11.1')

      discoverPage.search().openDialog()
      discoverPage.search().map().assertCenter('{"lat":22.2,"lon":11.1}')
    })

    it('does start search with given position', () => {
      discoverPage.openWithQuery('?position=22.2,11.1')

      discoverPage.map().poiMarkers().assertCount(7)
      discoverPage.map().assertPosition(22.2,11.1)
      discoverPage.map().distanceMarker().assertPosition(22.2,11.1)
    })

    it('ignores invalid parameter for position and uses default value', () => {
      discoverPage.openWithQuery('?position=invalid')

      discoverPage.map().poiMarkers().assertEmpty()
      discoverPage.map().assertPosition(52.908,8.588)
      discoverPage.map().distanceMarker().assertPosition(52.908, 8.588)
    })
  })

  describe('with query parameter "distance" ', () => {

    it('initializes search dialog with given distance', () => {
      discoverPage.openWithQuery('?distance=10000')

      discoverPage.search().openDialog()
      discoverPage.search().distance().assertDistance('10 km, Maximale Entfernung')
    })

    it('does start search with given distance', () => {
      discoverPage.openWithQuery('?distance=10000')

      discoverPage.map().poiMarkers().assertCount(7)

      discoverPage.map().distanceMarker().assertPosition(52.908, 8.588)
      discoverPage.map().distanceMarker().assertRadius(10000)
    })

    it('ignores invalid parameter for distance and uses default value', () => {
      discoverPage.openWithQuery('?distance=invalid')

      discoverPage.map().poiMarkers().assertCount(0)

      discoverPage.map().distanceMarker().assertPosition(52.908, 8.588)
      discoverPage.map().distanceMarker().assertRadius(1)
    })
  })

  describe('with query parameter "category" ', () => {

    it('initializes search dialog with given category', () => {
      discoverPage.openWithQuery('?category=restaurant')

      discoverPage.search().openDialog()
      discoverPage.search().category().assertCategory('Restaurant')
    })

    it('does start search with given category', () => {
      discoverPage.openWithQuery('?category=restaurant')

      discoverPage.map().poiMarkers().assertCount(7)
    })

    it('ignores invalid parameter for category and uses default value', () => {
      discoverPage.openWithQuery('?category=invalid')

      discoverPage.search().openDialog()
      discoverPage.search().category().assertCategory('Alles')
    })
  })

})
