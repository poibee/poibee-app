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

  describe('visited directly by URL', () => {

    beforeEach(() => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.content().assertText('Akzent Hotel Zur Wasserburg')
    })

    it('loads poi by querying data from external PoiOverpassService', () => {
      poiPage.assertUrl('/poi/way-12345678')
      cy.get('@poi-wasserburg')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois/way-12345678')
    })

    it('shows no navigation buttons', () => {
      poiPage.header().buttonSelectNextPoi().assertIsVisible(false)
      poiPage.header().labelPoiNavigatorText().assertIsVisible(false)
      poiPage.header().buttonSelectPreviousPoi().assertIsVisible(false)
      poiPage.header().buttonNavigateBack().assertIsVisible(false)
    })

    it('shows no distance chip', () => {
      poiPage.content().overviewChipDistance().assertIsVisible(false)
    })
  })

  describe('visited from discover page', () => {

    beforeEach(() => {
      const localDiscoverPage = discoverPage(poiPage)
      localDiscoverPage.open()
      localDiscoverPage.toggleView().toggle()
      localDiscoverPage.search().openDialog()
      localDiscoverPage.search().executeSearch()

      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-thumbnail').click({ multiple: true })

      poiPage.assertUrl('/poi/way-45666704')

      poiPage.content().assertText('Christuskirche')
    })

    it('shows navigation buttons and title', () => {
      poiPage.header().buttonNavigateBack().assertIsVisible(true)

      poiPage.header().titlePoiLable().assertText('Christuskirche')
      poiPage.header().labelPoiNavigatorText().assertText('4 / 7')
      poiPage.content().assertColumnCategories(['Church'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLable().assertText('Marktkieker')
      poiPage.header().labelPoiNavigatorText().assertText('5 / 7')
      poiPage.content().assertColumnCategories(['Amenity'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLable().assertText('Charisma')
      poiPage.header().labelPoiNavigatorText().assertText('6 / 7')
      poiPage.content().assertColumnCategories(['Restaurant'])

      poiPage.header().buttonSelectNextPoi().click()
      poiPage.header().titlePoiLable().assertText('Akzent Hotel Zur Wasserburg')
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
      poiPage.content().map().assertGeometryValues(/M14|M15/)
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
      poiPage.content().map().assertGeometryValues(/M14|M15/)
    })
  })

  describe('shows poi details of a poi', () => {

    it('with categories', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      cy.get('[data-cy=columnCategories] ion-item').should('have.length', 2)
      cy.get('[data-cy=columnCategories] ion-item').eq(0).find('ion-label').should('have.text', 'Hotel')
      cy.get('[data-cy=columnCategories] ion-item').eq(0).find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/hotel.png')
      cy.get('[data-cy=columnCategories] ion-item').eq(1).find('ion-label').should('have.text', 'Restaurant')
      cy.get('[data-cy=columnCategories] ion-item').eq(1).find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/restaurant.png')
    })

    it('with specific attributes', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      poiPage.content().overviewChipCuisine().assertIsVisible(true).assertText('German')
      poiPage.content().overviewChipOpeningHours().assertIsVisible(true).assertText('17:00+')
      poiPage.content().overviewChipVending().assertIsVisible(true).assertText('wine')
      poiPage.content().overviewChipIsBuilding().assertIsVisible(true).assertText('Gebäude')
      poiPage.content().overviewChipIsBar().assertIsVisible(true).assertText('Bar')
      poiPage.content().overviewChipIsCafe().assertIsVisible(true).assertText('Cafe')
      poiPage.content().overviewChipDistance().assertIsVisible(false)
      poiPage.content().overviewChipRelevance().assertIsVisible(true).assertText('17')
    })

    it('without specific attributes', () => {
      poiPage.openWithUrlParameter('/node-1628573037')
      poiPage.assertUrl('/poi/node-1628573037')

      poiPage.content().overviewChipCuisine().assertIsVisible(false)
      poiPage.content().overviewChipOpeningHours().assertIsVisible(false)
      poiPage.content().overviewChipVending().assertIsVisible(false)
      poiPage.content().overviewChipIsBuilding().assertIsVisible(false)
      poiPage.content().overviewChipIsBar().assertIsVisible(false)
      poiPage.content().overviewChipIsCafe().assertIsVisible(false)
      poiPage.content().overviewChipDistance().assertIsVisible(false)
      poiPage.content().overviewChipRelevance().assertIsVisible(true).assertText('1')
    })

    it('with every contact attribute', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      poiPage.header().titlePoiLable().assertText('Akzent Hotel Zur Wasserburg')

      poiPage.content().contactItemName().assertIsVisible(true).assertText('Akzent Hotel Zur Wasserburg')
      poiPage.content().contactItemAddress().assertIsVisible(true).assertText('Amtsfreiheit 4, 27243 Harpstedt')
      poiPage.content().contactItemPhone().assertIsVisible(true).assertText('+49 4244 1008')
      poiPage.content().contactItemFax().assertIsVisible(true).assertText('+49 4244 1009')
      poiPage.content().contactItemEmail().assertIsVisible(true).assertText('info@zur-wasserburg.de').assertLinkUrl('mailto:info@zur-wasserburg.de')
      poiPage.content().contactItemWebsite().assertIsVisible(true).assertText('https://www.zur-wasserburg.de').assertLinkUrl('https://www.zur-wasserburg.de')
    })

    it('without every contact attribute', () => {
      poiPage.openWithUrlParameter('/node-1628573037')
      poiPage.assertUrl('/poi/node-1628573037')

      poiPage.header().titlePoiLable().assertText('Information')

      poiPage.content().contactItemName().assertIsVisible(false)
      poiPage.content().contactItemAddress().assertIsVisible(false)
      poiPage.content().contactItemPhone().assertIsVisible(false)
      poiPage.content().contactItemFax().assertIsVisible(false)
      poiPage.content().contactItemEmail().assertIsVisible(false)
      poiPage.content().contactItemWebsite().assertIsVisible(false)
    })

    it('with every reference attribute', () => {
      poiPage.openWithUrlParameter('/way-45666704')
      poiPage.assertUrl('/poi/way-45666704')

      poiPage.content().referencesChipOsmDataset().assertIsVisible(true).assertText('OSM-Datensatz').assertLinkUrl('https://www.openstreetmap.org/way/45666704')
      poiPage.content().referencesChipOsmLocation().assertIsVisible(true).assertText('OSM-Karte').assertLinkUrl('https://www.openstreetmap.org/#map=19/52.9082584/8.5886623')
      poiPage.content().referencesChipGoogleLocation().assertIsVisible(true).assertText('Google-Maps').assertLinkUrl('https://www.google.de/maps/@52.9082584,8.5886623,18z')
      poiPage.content().referencesChipWikipedia().assertIsVisible(true).assertText('Wikipedia').assertLinkUrl('https://de.wikipedia.org/wiki/Christuskirche (Harpstedt)')
      poiPage.content().referencesChipWikidata().assertIsVisible(true).assertText('Wikidata').assertLinkUrl('https://www.wikidata.org/wiki/Q1087325')
    })

    it('without every reference attribute', () => {
      poiPage.openWithUrlParameter('/node-1628573037')
      poiPage.assertUrl('/poi/node-1628573037')

      poiPage.content().referencesChipOsmDataset().assertIsVisible(true).assertText('OSM-Datensatz').assertLinkUrl('https://www.openstreetmap.org/node/1628573037')
      poiPage.content().referencesChipOsmLocation().assertIsVisible(true).assertText('OSM-Karte').assertLinkUrl('https://www.openstreetmap.org/#map=19/52.9080359/8.5877197')
      poiPage.content().referencesChipGoogleLocation().assertIsVisible(true).assertText('Google-Maps').assertLinkUrl('https://www.google.de/maps/@52.9080359,8.5877197,18z')
      poiPage.content().referencesChipWikipedia().assertIsVisible(false)
      poiPage.content().referencesChipWikidata().assertIsVisible(false)
    })

    it('with spinner and poi markers on map', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      poiPage.content().map().assertIsVisible(true)

      poiPage.content().map().assertSpinnerVisible(true)
      poiPage.content().map().assertSpinnerVisible(false)

      poiPage.content().map().mapMarker().assertIsVisible(true)
      poiPage.content().map().mapMarker().assertNumberOfElements(2)
      poiPage.content().map().mapMarker().assertHasCssClass('leaflet-marker-icon')
      poiPage.content().map().mapMarker().assertHasMarkerImage('assets/marker/marker-icon.png')
      poiPage.content().map().mapMarker().assertHasCategoryImage('assets/category/hotel.png')
    })

    it('with OSM key and tag links to OSM-Wiki and TagInfo', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      poiPage.content().osmTags().assertIsVisible(true)
      poiPage.content().osmTags().assertTitle('OSM-Tags')
      poiPage.content().osmTags().assertNumberOfRows(18)

      poiPage.content().osmTags().row(1).key().assertText('addr:city')
      poiPage.content().osmTags().row(1).key().assertWikiLinkUrl('https://wiki.openstreetmap.org/wiki/Key:addr:city')
      poiPage.content().osmTags().row(1).key().assertTagInfoLinkUrl('https://taginfo.openstreetmap.org/keys/addr:city')

      poiPage.content().osmTags().row(1).value().assertText('Harpstedt')
      poiPage.content().osmTags().row(1).value().assertWikiLinkUrl('https://wiki.openstreetmap.org/wiki/Tag:addr:city=Harpstedt')
      poiPage.content().osmTags().row(1).value().assertTagInfoLinkUrl('https://taginfo.openstreetmap.org/tags/addr:city=Harpstedt')

      poiPage.content().osmTags().row(2).key().assertText('addr:housenumber')
    })

    it('with raw data as JSON', () => {
      poiPage.openWithUrlParameter('/way-12345678')
      poiPage.assertUrl('/poi/way-12345678')

      poiPage.content().rawData().assertIsVisible(true)
      poiPage.content().rawData().assertTitle('Rohdaten')
      poiPage.content().rawData().assertText('"id": "way/12345678"')
    })
  })

})
