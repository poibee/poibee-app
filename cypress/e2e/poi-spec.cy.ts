describe('POI detail page', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');
    cy.intercept('GET', '/pois/way12345678', {fixture: 'poi-wasserburg.json'}).as('poi-wasserburg');
    cy.intercept('GET', '/pois/node1628573037', {fixture: 'poi-information.json'}).as('poi-information');
    cy.intercept('GET', '/pois/way45666704', {fixture: 'poi-christuskirche.json'}).as('poi-christuskirche');
  });

  describe('visited directly by URL', () => {

    beforeEach(() => {
      cy.visit('/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });

    it('loads poi by querying data from external PoiOverpassService', () => {
      cy.url().should('include', '/poi/way-12345678')
      cy.get('@poi-wasserburg')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois/way12345678')
    });

    it('shows no navigation buttons', () => {
      cy.get('[data-cy=buttonSelectNextPoi]').should('not.exist')
      cy.get('[data-cy=labelPoiNavigatorText]').should('not.exist')
      cy.get('[data-cy=buttonSelectPreviousPoi]').should('not.exist')
      cy.get('[data-cy=buttonNavigateBack]').should('not.exist')
    })

    it('shows no distance chip', () => {
      cy.get('[data-cy=chipDistance]').should('not.exist')
    })
  })

  describe('visited from discover page', () => {

    beforeEach(() => {
      cy.visit('/discover')
      cy.get('[data-cy=buttonToggleView]').click()
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-thumbnail').click({ multiple: true })

      cy.url().should('include', '/poi/way-45666704')
      cy.get('ion-content').contains('Christuskirche')
    });

    it('shows navigation buttons', () => {
      cy.get('[data-cy=buttonNavigateBack]').should('exist')

      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '4 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Church')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '5 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Amenity')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '6 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Restaurant')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '7 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'HotelRestaurant')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '7 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'HotelRestaurant')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '6 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Restaurant')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '5 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Amenity')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '4 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Church')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '3 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Memorial')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '2 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Parking')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Information')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=labelPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Information')
    })

    it('shows distance and relevance chip ', () => {
      cy.get('[data-cy=chipOverviewDistance]').should('have.text', '0.05 km')
      cy.get('[data-cy=chipOverviewDistance] ion-icon').should('have.class', 'rotate-northeast')

      cy.get('[data-cy=chipOverviewRelevance]').should('have.text', '19')
    })
  })

  describe('shows poi details of a poi', () => {

    it('with categories', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')

      cy.get('[data-cy=columnCategories] ion-item').should('have.length', 2)
      cy.get('[data-cy=columnCategories] ion-item').eq(0).find('ion-label').should('have.text', 'Hotel')
      cy.get('[data-cy=columnCategories] ion-item').eq(0).find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/hotel.png')
      cy.get('[data-cy=columnCategories] ion-item').eq(1).find('ion-label').should('have.text', 'Restaurant')
      cy.get('[data-cy=columnCategories] ion-item').eq(1).find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/restaurant.png')
    });

    it('with specific attributes', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')
      cy.get('[data-cy=chipOverviewCuisine]').should('have.text', 'German')
      cy.get('[data-cy=chipOverviewOpeningHours]').should('have.text', '17:00+')
      cy.get('[data-cy=chipOverviewVending]').should('have.text', 'wine')
      cy.get('[data-cy=chipOverviewDistance]').should('not.exist')
      cy.get('[data-cy=chipOverviewIsBuilding]').should('have.text', 'Gebäude')
      cy.get('[data-cy=chipOverviewIsBar]').should('have.text', 'Bar')
      cy.get('[data-cy=chipOverviewIsCafe]').should('have.text', 'Cafe')
    });

    it('without specific attributes', () => {
      cy.visit('/poi/node-1628573037')
      cy.url().should('include', '/poi/node-1628573037')
      cy.get('[data-cy=chipOverviewCuisine]').should('not.exist')
      cy.get('[data-cy=chipOverviewOpeningHours]').should('not.exist')
      cy.get('[data-cy=chipOverviewVending]').should('not.exist')
      cy.get('[data-cy=chipOverviewDistance]').should('not.exist')
      cy.get('[data-cy=chipOverviewIsBar]').should('not.exist')
      cy.get('[data-cy=chipOverviewIsCafe]').should('not.exist')
      cy.get('[data-cy=chipOverviewIsBuilding]').should('not.exist')
    });

    it('with every contact attribute', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')

      cy.get('[data-cy=titlePoiLabel]').should('have.text', 'Akzent Hotel Zur Wasserburg')

      cy.get('[data-cy=itemName]').should('have.text', 'Akzent Hotel Zur Wasserburg')
      cy.get('[data-cy=itemAddress]').should('have.text', 'Amtsfreiheit 4, 27243 Harpstedt')
      cy.get('[data-cy=itemPhone]').should('have.text', '+49 4244 1008')
      cy.get('[data-cy=itemFax]').should('have.text', '+49 4244 1009')

      cy.get('[data-cy=itemEmail]').should('have.text', 'info@zur-wasserburg.de')
      cy.get('[data-cy=itemEmail] a').invoke('attr', 'href').should('eq', 'mailto:info@zur-wasserburg.de')

      cy.get('[data-cy=itemWebsite]').should('have.text', 'https://www.zur-wasserburg.de')
      cy.get('[data-cy=itemWebsite] a').invoke('attr', 'href').should('eq', 'https://www.zur-wasserburg.de')
    });

    it('without every contact attribute', () => {
      cy.visit('/poi/node-1628573037')
      cy.url().should('include', '/poi/node-1628573037')

      cy.get('[data-cy=titlePoiLabel]').should('have.text', 'Information')

      cy.get('[data-cy=itemName]').should('not.exist')
      cy.get('[data-cy=itemAddress]').should('not.exist')
      cy.get('[data-cy=itemPhone]').should('not.exist')
      cy.get('[data-cy=itemFax]').should('not.exist')
      cy.get('[data-cy=itemEmail]').should('not.exist')
      cy.get('[data-cy=itemWebsite]').should('not.exist')
    });

    it('with every reference attribute', () => {
      cy.visit('/poi/way-45666704')
      cy.url().should('include', '/poi/way-45666704')
      cy.get('[data-cy=chipOsmDataset] a').invoke('attr', 'href').should('eq', 'https://www.openstreetmap.org/way/45666704')
      cy.get('[data-cy=chipOsmLocation] a').invoke('attr', 'href').should('eq', 'https://www.openstreetmap.org/#map=19/52.9082584/8.5886623')
      cy.get('[data-cy=chipGoogleLocation] a').invoke('attr', 'href').should('eq', 'https://www.google.de/maps/@52.9082584,8.5886623,18z')
      cy.get('[data-cy=chipWikipedia] a').invoke('attr', 'href').should('eq', 'https://de.wikipedia.org/wiki/Christuskirche (Harpstedt)')
      cy.get('[data-cy=chipWikidata] a').invoke('attr', 'href').should('eq', 'https://www.wikidata.org/wiki/Q1087325')
    });

    it('without every reference attribute', () => {
      cy.visit('/poi/node-1628573037')
      cy.url().should('include', '/poi/node-1628573037')
      cy.get('[data-cy=chipOsmDataset] a').invoke('attr', 'href').should('eq', 'https://www.openstreetmap.org/node/1628573037')
      cy.get('[data-cy=chipOsmLocation] a').invoke('attr', 'href').should('eq', 'https://www.openstreetmap.org/#map=19/52.9080359/8.5877197')
      cy.get('[data-cy=chipGoogleLocation] a').invoke('attr', 'href').should('eq', 'https://www.google.de/maps/@52.9080359,8.5877197,18z')
      cy.get('[data-cy=chipWikipedia]').should('not.exist')
      cy.get('[data-cy=chipWikidata]').should('not.exist')
    });

    // TODO #32 - not working on GitHub-CI
    // AssertionError: Timed out retrying after 4000ms: Expected to find element: `[data-cy=divPoiMap] ion-spinner`, but never found it.
    xit('with spinner and poi markers on map', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')

      cy.get('[data-cy=divPoiMap]').should('exist')

      cy.get('[data-cy=divPoiMap] ion-spinner').should('exist')
      cy.get('[data-cy=divPoiMap] ion-spinner').should('not.exist')

      cy.get('[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 1)
      cy.get('[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.class', 'leaflet-marker-icon')
      cy.get('[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/category/hotel.png')
    });

    it('with OSM key and tag links to OSM-Wiki and TagInfo', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')

      cy.get('[data-cy=cardOsmTags]').should('exist')
      cy.get('[data-cy=cardOsmTags] ion-card-title').should('have.text', 'OSM-Tags')
      cy.get('[data-cy=cardOsmTags] ion-row').should('have.length', 18)

      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnKey]').should('have.text', 'addr:city')
      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnKey] a').first().should('have.attr', 'href', 'https://wiki.openstreetmap.org/wiki/Key:addr:city')
      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnKey] a').last().should('have.attr', 'href', 'https://taginfo.openstreetmap.org/keys/addr:city')

      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnTag]').should('have.text', 'Harpstedt')
      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnTag] a').first().should('have.attr', 'href', 'https://wiki.openstreetmap.org/wiki/Tag:addr:city=Harpstedt')
      cy.get('[data-cy=cardOsmTags] ion-row').eq(1).find('[data-cy=columnTag] a').last().should('have.attr', 'href', 'https://taginfo.openstreetmap.org/tags/addr:city=Harpstedt')

      cy.get('[data-cy=cardOsmTags] ion-row').eq(2).find('[data-cy=columnKey]').should('have.text', 'addr:housenumber')
    });

    it('with raw data as JSON', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')

      cy.get('[data-cy=cardRawData]').should('exist')
      cy.get('[data-cy=cardRawData] ion-card-title').should('have.text', 'Rohdaten')
      cy.get('[data-cy=cardRawData] pre').should('contain', '"id": "way/12345678",\n  "name": "Akzent Hotel Zur Wasserburg"')
    });
  });

});
