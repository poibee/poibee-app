describe('POI detail page', () => {

  beforeEach(() => {
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
      cy.get('[data-cy=detailPoiNavigatorText]').should('not.exist')
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
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').click()

      cy.url().should('include', '/poi/way-45666704')
      cy.get('ion-content').contains('Christuskirche')
    });

    it('shows navigation buttons', () => {
      cy.get('[data-cy=buttonNavigateBack]').should('exist')

      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '4 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Church')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '5 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Amenity')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '6 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Restaurant')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '7 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'HotelRestaurant')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '7 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'HotelRestaurant')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '6 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Restaurant')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '5 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Amenity')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '4 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Church')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '3 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Memorial')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '2 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Parking')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Information')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=detailPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=columnCategories]').should('have.text', 'Information')
    })

    it('shows distance chip', () => {
      cy.get('[data-cy=chipDistance]').should('have.text', '0.05 km')
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
      cy.get('[data-cy=chipCuisine]').should('have.text', 'German')
      cy.get('[data-cy=chipOpeningHours]').should('have.text', '17:00+')
      cy.get('[data-cy=chipDistance]').should('not.exist')
      cy.get('[data-cy=chipIsBuilding]').should('have.text', 'Gebäude')
      cy.get('[data-cy=chipIsBar]').should('have.text', 'Bar')
      cy.get('[data-cy=chipIsCafe]').should('have.text', 'Cafe')
    });

    it('without specific attributes', () => {
      cy.visit('/poi/node-1628573037')
      cy.url().should('include', '/poi/node-1628573037')
      cy.get('[data-cy=chipCuisine]').should('not.exist')
      cy.get('[data-cy=chipOpeningHours]').should('not.exist')
      cy.get('[data-cy=chipDistance]').should('not.exist')
      cy.get('[data-cy=chipIsBar]').should('not.exist')
      cy.get('[data-cy=chipIsCafe]').should('not.exist')
      cy.get('[data-cy=chipIsBuilding]').should('not.exist')
    });

    it('with every contact attribute', () => {
      cy.visit('/poi/way-12345678')
      cy.url().should('include', '/poi/way-12345678')
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
      cy.get('[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')
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
