import {PoiPage} from "../pages/poi-page"
import {DiscoverPage} from "../pages/discover-page"

describe('POI detail page', () => {

  const poiPage = new PoiPage()
  const discoverPage = (page: PoiPage): DiscoverPage => new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000)

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois')
    cy.intercept('GET', '/pois/way-45666704', {fixture: 'poi-christuskirche.json'}).as('poi-christuskirche')
    cy.intercept('GET', '/pois/way-12345678', {fixture: 'poi-wasserburg.json'}).as('poi-wasserburg')
    cy.intercept('GET', '/pois/node-1628572328', {fixture: 'poi-charisma.json'})
    cy.intercept('GET', '/pois/node-1628572605', {fixture: 'poi-marktkieker.json'})
    cy.intercept('GET', '/pois/node-1628573037', {fixture: 'poi-information.json'}).as('poi-information')
    cy.intercept('GET', '/pois/node-1628573040', {fixture: 'poi-denkmal.json'})
    cy.intercept('GET', '/pois/way-45666703', {fixture: 'poi-marktplatz.json'})
  })

  describe('visited from discover page', () => {

    beforeEach(() => {
      const localDiscoverPage = discoverPage(poiPage)
      localDiscoverPage.open()
      localDiscoverPage.toggleView().toggle()
      localDiscoverPage.search().openDialog()
      localDiscoverPage.search().executeSearch()

      localDiscoverPage.list().assertCount(7)
      localDiscoverPage.list().item(3).clickLabel()

      poiPage.assertUrl('/poi/way-45666704')
      poiPage.content().assertText('Christuskirche')
    })

    it('shows navigation buttons and title', () => {
      poiPage.header().buttonNavigateBack().assertIsVisible(true)

      poiPage.header().titlePoiLabel().assertText('Christuskirche')
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLabel().assertText('Marktkieker')
      poiPage.header().labelPoiNavigatorText().assertText('5 / 7')
      poiPage.content().assertColumnCategories(['Amenity'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLabel().assertText('Charisma')
      poiPage.header().labelPoiNavigatorText().assertText('6 / 7')
      poiPage.content().assertColumnCategories(['Restaurant'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLabel().assertText('Akzent Hotel Zur Wasserburg')
      poiPage.header().labelPoiNavigatorText().assertText('7 / 7')
      poiPage.content().assertColumnCategories(['Hotel', 'Restaurant'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('7 / 7')
      poiPage.content().assertColumnCategories(['Hotel', 'Restaurant'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('6 / 7')
      poiPage.content().assertColumnCategories(['Restaurant'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('5 / 7')
      poiPage.content().assertColumnCategories(['Amenity'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('3 / 7')
      poiPage.content().assertColumnCategories(['Memorial'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('2 / 7')
      poiPage.content().assertColumnCategories(['Parking'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('1 / 7')
      poiPage.content().assertColumnCategories(['Information'])

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('1 / 7')
      poiPage.content().assertColumnCategories(['Information'])
    })

    it('updates URL location after navigating to further POI ', () => {
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])
      poiPage.assertUrl('/poi/way-45666704')

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('5 / 7')
      poiPage.content().assertColumnCategories(['Amenity'])
      poiPage.assertUrl('/poi/node-1628572605')

      poiPage.header().buttonSelectPreviousPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])
      poiPage.assertUrl('/poi/way-45666704')
    })

    it('shows distance and relevance chip ', () => {
      poiPage.content().overviewChipDistance().assertIsVisible(true).assertText('0.05 km').assertIcon('rotate-northeast')
      poiPage.content().overviewChipRelevance().assertIsVisible(true).assertText('19')
    })

    it('shows poi area on map', () => {
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])
      poiPage.content().map().assertNumberOfGemetries(1)
      poiPage.content().map().assertGeometryValues(/M/)
      poiPage.content().map().assertGeometryColor('#0000FF')

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('5 / 7')
      poiPage.content().assertColumnCategories(['Amenity'])
      poiPage.content().map().assertNumberOfGemetries(1)
      poiPage.content().map().assertGeometryValues(/2 0 1,0 4,0 a2,2 0 1,0 -4,0/)

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('6 / 7')
      poiPage.content().assertColumnCategories(['Restaurant'])
      poiPage.content().map().assertNumberOfGemetries(1)
      poiPage.content().map().assertGeometryValues(/2 0 1,0 4,0 a2,2 0 1,0 -4,0/)

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().labelPoiNavigatorText().assertText('7 / 7')
      poiPage.content().assertColumnCategories(['Hotel', 'Restaurant'])
      poiPage.content().map().assertNumberOfGemetries(1)
      poiPage.content().map().assertGeometryValues(/M/)
    })
  })

})
