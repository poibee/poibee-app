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

})
