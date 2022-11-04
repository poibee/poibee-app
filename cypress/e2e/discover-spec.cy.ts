describe('Discover page', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');

    cy.visit('/discover')
  });

  describe('with common features', () => {

    it('shows search button for search dialog', () => {
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')
    })

    it('shows toggle button to switch between map and list', () => {
      cy.get('[data-cy=buttonToggleView]').should('have.text', 'Karte')
      cy.get('[data-cy=buttonToggleView]').should('not.have.text', 'Liste')
      cy.get('[data-cy=componentDiscoverList]').should('not.exist')
      cy.get('[data-cy=componentDiscoverMap]').should('exist')
      cy.get('[data-cy=componentDiscoverPoiDetailToolbar]').should('exist')

      cy.get('[data-cy=buttonToggleView]').click()
      cy.get('[data-cy=buttonToggleView]').should('have.text', 'Liste')
      cy.get('[data-cy=buttonToggleView]').should('not.have.text', 'Karte')
      cy.get('[data-cy=componentDiscoverList]').should('exist')
      cy.get('[data-cy=componentDiscoverMap]').should('not.exist')
      cy.get('[data-cy=componentDiscoverPoiDetailToolbar]').should('not.exist')

      cy.get('[data-cy=buttonToggleView]').click()
      cy.get('[data-cy=buttonToggleView]').should('have.text', 'Karte')
      cy.get('[data-cy=buttonToggleView]').should('not.have.text', 'Liste')
      cy.get('[data-cy=componentDiscoverList]').should('not.exist')
      cy.get('[data-cy=componentDiscoverMap]').should('exist')
      cy.get('[data-cy=componentDiscoverPoiDetailToolbar]').should('exist')
    })
  })

  describe('with list view', () => {

    beforeEach(() => {
      cy.get('[data-cy=buttonToggleView]').click()
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()
    });

    it('shows poi list', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').first().as('informationItem')
      cy.get('@informationItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('@informationItem').find('[data-cy=detailToolbarLabelName]').should('have.text', '')

      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('[data-cy=detailToolbarLabelName]').should('have.text', 'Christuskirche')

      cy.get('app-discover-list ion-list ion-item').last().as('wasserburgItem')
      cy.get('@wasserburgItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
      cy.get('@wasserburgItem').find('[data-cy=detailToolbarLabelName]').should('have.text', 'Akzent Hotel Zur Wasserburg')
/*    // TODO #32 - not working on GitHub-CI

      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=all&distance=250')
*/
    });

    it('shows poi details as chips in line item', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').first().as('informationItem')
      cy.get('@informationItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('@informationItem').find('[data-cy=detailToolbarLabelName]').should('have.text', '')
      cy.get('@informationItem').find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/information.png')
      cy.get('@informationItem').find('[data-cy=chipCuisine]').should('not.exist')
      cy.get('@informationItem').find('[data-cy=chipDistance]').should('have.text', '0.02\u00a0km')
      cy.get('@informationItem').find('[data-cy=chipDirection]').should('have.class', 'rotate-west')
      cy.get('@informationItem').find('[data-cy=chipOpeningHours]').should('not.exist')
      cy.get('@informationItem').find('[data-cy=chipWebsite]').should('not.exist')
      cy.get('@informationItem').find('[data-cy=chipWikidata]').should('not.exist')
      cy.get('@informationItem').find('[data-cy=chipWikipedia]').should('not.exist')

      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('[data-cy=detailToolbarLabelName]').should('have.text', 'Christuskirche')
      cy.get('@christuskircheItem').find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/church.png')
      cy.get('@christuskircheItem').find('[data-cy=chipCuisine]').should('have.text', 'Küche')
      cy.get('@christuskircheItem').find('[data-cy=chipDistance]').should('have.text', '0.05\u00a0km')
      cy.get('@christuskircheItem').find('[data-cy=chipDirection]').should('have.class', 'rotate-northeast')
      cy.get('@christuskircheItem').find('[data-cy=chipOpeningHours]').should('have.text', 'Zeiten')
      cy.get('@christuskircheItem').find('[data-cy=chipWebsite]').should('have.text', 'Webseite')
      cy.get('@christuskircheItem').find('[data-cy=chipWikidata]').should('have.text', 'Wikidata')
      cy.get('@christuskircheItem').find('[data-cy=chipWikipedia]').should('have.text', 'Wikipedia')
    });

    it('shows poi details as chips with popup for further informations', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')

      cy.get('@christuskircheItem').find('[data-cy=chipCuisine]').should('have.text', 'Küche')
      cy.get('@christuskircheItem').find('[data-cy=chipCuisine]').click()
      cy.get('[data-cy=popoverChipCuisine]').should('have.text', 'German')
      pressEscape()

      cy.get('@christuskircheItem').find('[data-cy=chipOpeningHours]').should('have.text', 'Zeiten')
      cy.get('@christuskircheItem').find('[data-cy=chipOpeningHours]').click()
      cy.get('[data-cy=popoverChipOpeningHours]').should('have.text', 'Th 12:00-12:00; Su 13:30-17:00')
      pressEscape()

      cy.get('@christuskircheItem').find('[data-cy=chipVending]').should('have.text', 'Verkauf')
      cy.get('@christuskircheItem').find('[data-cy=chipVending]').click()
      cy.get('[data-cy=popoverChipVending]').should('have.text', 'wine')
      pressEscape()

      cy.get('@christuskircheItem').find('[data-cy=chipWebsite]').should('have.text', 'Webseite')
      cy.get('@christuskircheItem').find('[data-cy=chipWebsite]').click()
      cy.get('[data-cy=popoverChipWebsite]').should('have.text', 'https://www.kirche-harpstedt.de/')
      cy.get('[data-cy=popoverChipWebsite] a').should('have.attr', 'href', 'https://www.kirche-harpstedt.de/')
      pressEscape()

      cy.get('@christuskircheItem').find('[data-cy=chipWikidata]').should('have.text', 'Wikidata')
      cy.get('@christuskircheItem').find('[data-cy=chipWikidata]').click()
      cy.get('[data-cy=popoverChipWikidata]').should('have.text', 'https://www.wikidata.org/wiki/Q1087325')
      cy.get('[data-cy=popoverChipWikidata] a').should('have.attr', 'href', 'https://www.wikidata.org/wiki/Q1087325')
      pressEscape()

      cy.get('@christuskircheItem').find('[data-cy=chipWikipedia]').should('have.text', 'Wikipedia')
      cy.get('@christuskircheItem').find('[data-cy=chipWikipedia]').click()
      cy.get('[data-cy=popoverChipWikipedia]').should('have.text', 'https://de.wikipedia.org/wiki/Christuskirche (Harpstedt)')
      cy.get('[data-cy=popoverChipWikipedia] a').should('have.attr', 'href', 'https://de.wikipedia.org/wiki/Christuskirche (Harpstedt)')
    });

    it('navigates to poi details after poi click', () => {
      cy.get('app-discover-list ion-list ion-item').last().as('wasserburgItem')
      cy.get('@wasserburgItem').find('[data-cy=detailToolbarLabelCategory]').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });

    it('filters pois by ignoring uppercase and lowercase', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelName]').should('have.text', '')

      cy.get('[data-cy=searchbarFilter]').type('markt');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 2)
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelName]').should('have.text', 'Marktplatz')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Marktkieker')

      cy.get('[data-cy=searchbarFilter]').type('X');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 0)

      cy.get('[data-cy=searchbarFilter]').clear();
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('[data-cy=searchbarFilter]').type('DENKMAL');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 1)
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelName]').should('have.text', 'Kriegerdenkmal 1870-71')
    });

    it('sorts items by distance, name, relevance and category', () => {
      // default: sort by distance
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')

      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').should('have.length', 4)
      cy.get('ion-select-popover ion-item.item-radio-checked').should('have.text', 'Entfernung')

      // sort by name
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(1).find('ion-radio').click()

      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelName]').should('have.text', 'Akzent Hotel Zur Wasserburg')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Charisma')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Christuskirche')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Kriegerdenkmal 1870-71')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Marktkieker')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('[data-cy=detailToolbarLabelName]').should('have.text', 'Marktplatz')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelName]').should('have.text', '')

      // sort by relevance
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(2).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')

      // sort by category
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(3).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Restaurant')

      // sort by distance
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(0).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
    });

    it('restores state after poi selection and back', () => {
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 7 mit Filter, 7 insgesamt')
      cy.get('[data-cy=searchbarFilter]').type('er');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 3)
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 3 mit Filter, 7 insgesamt')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
      cy.get('[data-cy=buttonNavigateBack]').click()

      // TODO #9 - the list <-> map state should be restored
      cy.get('[data-cy=buttonToggleView]').click()

      cy.get('app-discover-list ion-list ion-item').should('have.length', 3)
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 3 mit Filter, 7 insgesamt')
      cy.get('app-discover-list ion-list ion-item').last().find('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')
    });
  });

  describe('with map view', () => {

    xit('shows spinner on map', () => {
      // TODO #32 - not working on GitHub-CI (and locally)

      cy.get('app-discover-map ion-spinner').should('exist')
      cy.get('app-discover-map ion-spinner').should('be.visible')
      cy.get('app-discover-map ion-spinner').should('not.exist')
    })

    it('shows search distance circle on map', () => {
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('app-discover-map .map svg').should('exist')
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.length', 1)
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should('have.attr', 'fill', '#ff7777')
      cy.get('app-discover-map .map svg').find('path.leaflet-interactive').should("have.attr", 'd').and("match", /174 0 1,0 348,0 a174,174 0 1,0 -348,0 /);
    })

    it('shows poi markers on map', () => {
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.class', 'leaflet-marker-icon')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.class', 'leaflet-marker-icon')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.attr', 'src', 'assets/category/information.png')

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.class', 'leaflet-marker-icon')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.attr', 'src', 'assets/marker/poi-selection-mask.png')
    })

    it('filters pois by ignoring uppercase and lowercase', () => {
      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.attr', 'src', 'assets/category/information.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).should('have.attr', 'src', 'assets/category/parking.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(3).should('have.attr', 'src', 'assets/category/memorial.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(4).should('have.attr', 'src', 'assets/category/church.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(5).should('have.attr', 'src', 'assets/category/amenity.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(6).should('have.attr', 'src', 'assets/category/restaurant.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(7).should('have.attr', 'src', 'assets/category/hotel.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.attr', 'src', 'assets/marker/poi-selection-mask.png')

      cy.get('[data-cy=searchbarFilter]').type('markt');
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 4)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.attr', 'src', 'assets/marker/poi-selection-mask.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).should('have.attr', 'src', 'assets/category/parking.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.attr', 'src', 'assets/category/amenity.png')

      cy.get('[data-cy=searchbarFilter]').type('X');
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 1)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')

      cy.get('[data-cy=searchbarFilter]').clear();
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)

      cy.get('[data-cy=searchbarFilter]').type('DENKMAL');
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 3)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.attr', 'src', 'assets/marker/poi-selection-mask.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.attr', 'src', 'assets/category/memorial.png')
    });

    it('shows poi details toolbar under map', () => {
      cy.get('app-discover-poi-detail-toolbar').contains('Kein POI ausgewählt')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')
      cy.get('[data-cy=detailToolbarLabelName]').should('have.text', '')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '2 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')
      cy.get('[data-cy=detailToolbarLabelName]').should('have.text', 'Marktplatz')
    })

    it('shows poi navigator on map with navigation buttons', () => {
      cy.get('app-discover-poi-detail-toolbar').contains('Kein POI ausgewählt')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '2 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Parking')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '3 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Memorial')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '4 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '5 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '6 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Restaurant')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '7 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '7 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '6 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '5 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '4 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '3 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '2 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
    })

    it('updates selected poi after sort selection', () => {
      cy.get('app-discover-poi-detail-toolbar').contains('Kein POI ausgewählt')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Information')

      // sort by name
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(1).find('ion-radio').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Hotel')

      // sort by category
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(2).find('ion-radio').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Church')

      // sort by relevance
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').last().find('ion-radio').click()
      cy.get('[data-cy=mapPoiNavigatorText]').should('have.text', '1 / 7')
      cy.get('[data-cy=detailToolbarLabelCategory]').should('have.text', 'Amenity')
    })

    it('highlights marker on map of the selected poi', () => {
      cy.get('app-discover-poi-detail-toolbar').contains('Kein POI ausgewählt')

      cy.get('[data-cy=buttonSearchModal]').click()
      cy.get('[data-cy=buttonStartSearch]').click()

      cy.get('.leaflet-pane.leaflet-marker-pane').should('exist')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').should('have.length', 9)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().should('have.attr', 'src', 'assets/marker/marker-icon.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().invoke('css', 'z-index').then(parseInt).should('be.lt', 1001)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).should('have.attr', 'src', 'assets/category/information.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).invoke('css', 'z-index').then(parseInt).should('be.gte', 999)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).should('have.attr', 'src', 'assets/category/parking.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).invoke('css', 'z-index').then(parseInt).should('be.lt', 1002)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(3).should('have.attr', 'src', 'assets/category/memorial.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(3).invoke('css', 'z-index').then(parseInt).should('be.lt', 1003)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(4).should('have.attr', 'src', 'assets/category/church.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(4).invoke('css', 'z-index').then(parseInt).should('be.lt', 1004)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(5).should('have.attr', 'src', 'assets/category/amenity.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(5).invoke('css', 'z-index').then(parseInt).should('be.lt', 1005)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(6).should('have.attr', 'src', 'assets/category/restaurant.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(6).invoke('css', 'z-index').then(parseInt).should('be.lt', 1006)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(7).should('have.attr', 'src', 'assets/category/hotel.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(7).invoke('css', 'z-index').then(parseInt).should('be.lt', 1007)

      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().should('have.attr', 'src', 'assets/marker/poi-selection-mask.png')
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().invoke('css', 'z-index').then(parseInt).should('be.gte', 2000)

      cy.get('[data-cy=buttonSelectNextPoi]').click()
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().invoke('css', 'z-index').then(parseInt).should('be.lt', 1008)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).invoke('css', 'z-index').then(parseInt).should('be.lt', 1009)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).invoke('css', 'z-index').then(parseInt).should('be.gte', 998)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(3).invoke('css', 'z-index').then(parseInt).should('be.lt', 1010)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(4).invoke('css', 'z-index').then(parseInt).should('be.lt', 1011)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(5).invoke('css', 'z-index').then(parseInt).should('be.lt', 1012)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(6).invoke('css', 'z-index').then(parseInt).should('be.lt', 1013)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(7).invoke('css', 'z-index').then(parseInt).should('be.lt', 1014)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().invoke('css', 'z-index').then(parseInt).should('be.gte', 2000)

      cy.get('[data-cy=buttonSelectPreviousPoi]').click()
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').first().invoke('css', 'z-index').then(parseInt).should('be.lt', 1015)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(1).invoke('css', 'z-index').then(parseInt).should('be.gte', 997)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(2).invoke('css', 'z-index').then(parseInt).should('be.lt', 1016)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(3).invoke('css', 'z-index').then(parseInt).should('be.lt', 1017)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(4).invoke('css', 'z-index').then(parseInt).should('be.lt', 1018)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(5).invoke('css', 'z-index').then(parseInt).should('be.lt', 1019)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(6).invoke('css', 'z-index').then(parseInt).should('be.lt', 1020)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').eq(7).invoke('css', 'z-index').then(parseInt).should('be.lt', 1021)
      cy.get('.leaflet-pane.leaflet-marker-pane').first().find('img').last().invoke('css', 'z-index').then(parseInt).should('be.gte', 2000)
    })

  });

  describe('with search dialog', () => {

    beforeEach(() => {
      cy.get('[data-cy=buttonSearchModal]').click()
    });

    xit('has distance selection', () => {
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')

      cy.get('[data-cy=selectDistance]').click()
      cy.get('ion-select-popover ion-item').should('have.length', 11)
      cy.get('ion-select-popover ion-item.item-radio-checked').should('have.text', '0,25 km')
      cy.get('ion-select-popover ion-item').eq(5).find('ion-radio').click()
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '5 km, Maximale Entfernung')

      cy.get('[data-cy=buttonStartSearch]').click()

      // TODO #32 - not working on GitHub-CI (and locally)
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=all&distance=5000')
    });

    xit('has favorite category buttons', () => {
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Alles")
      cy.get('[data-cy=itemFavoriteCategory] ion-button').should('have.length', 9)

      cy.get('[data-cy=itemFavoriteCategory] ion-button').eq(5).click()
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Spielplatz")

      cy.get('[data-cy=buttonStartSearch]').click()

      // TODO #32  - not working on GitHub-CI
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=playground&distance=250')
    });

    xit('has category selection as category modal', () => {
      // TODO #32  - not working on GitHub-CI
      cy.get('[data-cy=buttonCategoryModal').should('have.text', "Alles")

      cy.get('[data-cy=buttonCategoryModal]').click()
      cy.get('app-category-modal ion-title').should('have.text', "Alles")
      cy.get('app-category-modal app-category-modal-main-item').should('have.length', 8)
      cy.get('app-category-modal app-category-modal-main-item ion-item.item-radio-checked ion-label').should('have.text', 'Alles')
      cy.get('app-category-modal app-category-modal-main-item ion-item ion-label').eq(7).should('have.text', 'Touristik')

      cy.get('app-category-modal app-category-modal-main-item').eq(7).click()
      cy.get('app-category-modal app-category-modal-main-item').eq(7).find('ion-item').should('have.length', 10)
      cy.get('app-category-modal app-category-modal-main-item').eq(7).find('ion-item ion-label').eq(5).should('have.text', 'Hotel')
      cy.get('app-category-modal app-category-modal-main-item').eq(7).find('ion-item').eq(5).click()

      cy.get('[data-cy=buttonSelectCategory]').click()

      cy.get('[data-cy=buttonStartSearch]').click()

      // TODO #32  - not working on GitHub-CI
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=hotel&distance=250')
    });

    xit('updates distance circle on map', () => {
      // TODO #32  - not working on GitHub-CI
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')
      cy.get('[data-cy=componentMyPositionMap] .map svg').should('exist')
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.length', 1)
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'fill', '#ff7777')
      // actual: 'M-174.19164444506168,-0.29940737411379814a174,174 0 1,0 348,0 a174,174 0 1,0 -348,0 '
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'd', 'M13.808355554938316,233.7005926258862a174,174 0 1,0 348,0 a174,174 0 1,0 -348,0 ')

      cy.get('[data-cy=selectDistance]').click()
      cy.get('ion-select-popover ion-item').eq(5).find('ion-radio').click()
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'd', 'M-29.636977777816355,233.24385850178078a217,217 0 1,0 434,0 a217,217 0 1,0 -434,0 ')
    });

    xit('has zoom buttons at the map', () => {
      // TODO #32  - not working on GitHub-CI
      // actual: 'z-index: 16; transform: translate3d(2px, 2px, 0px) scale(8);'
      cy.get('[data-cy=componentMyPositionMap] .leaflet-zoom-animated').should('have.attr', 'style', 'z-index: 16; transform: translate3d(-1314px, -1636px, 0px) scale(8);')

      cy.get('[data-cy=componentMyPositionMap] a.leaflet-control-zoom-out').click()
      cy.get('[data-cy=componentMyPositionMap] .leaflet-zoom-animated').should('have.attr', 'style', 'z-index: 17; transform: translate3d(-563px, -701px, 0px) scale(4);')

      cy.get('[data-cy=componentMyPositionMap] .leaflet-control [title="Kartenmitte als Standort"]').click({ multiple: true })
    });
  });

  // https://sqa.stackexchange.com/questions/46912/how-to-simulate-a-simple-keypress-in-cypress
  function pressEscape() {
    // first method
    cy.get('body').trigger('keydown', {keyCode: 27});
    cy.wait(500);
    cy.get('body').trigger('keyup', {keyCode: 27});
    cy.wait(500);
    // next method
    cy.get('body').type('{esc}');
    cy.wait(500)
  }
});
