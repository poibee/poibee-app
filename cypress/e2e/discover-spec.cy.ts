describe('Discover page', () => {

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');

    cy.visit('/discover')
    cy.get('[data-cy=buttonSearchModal]').click()
    cy.get('[data-cy=buttonStartSearch]').click()
  });

  describe('with list view', () => {

    it('shows poi list', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').first().as('informationItem')
      cy.get('@informationItem').find('ion-label h3').should('have.text', 'Information')
      cy.get('@informationItem').find('ion-label p').should('have.text', '')

      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('ion-label p').should('have.text', 'Christuskirche')

      cy.get('app-discover-list ion-list ion-item').last().as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').should('have.text', 'Hotel')
      cy.get('@wasserburgItem').find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')

      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=all&distance=250')
    });

    it('shows poi details as line item', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').eq(3).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('ion-label p').should('have.text', 'Christuskirche')
      cy.get('@christuskircheItem').find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/church.png')
      cy.get('@christuskircheItem').find('[data-cy=badgeDistance]').should('have.text', '0.05 km')
      cy.get('@christuskircheItem').find('[data-cy=badgeDirection]').should('have.class', 'rotate-northeast')
    });

    it('navigates to poi details after poi click', () => {
      cy.get('app-discover-list ion-list ion-item').last().as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });

    it('filters items by ignoring uppercase and lowercase', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', '')

      cy.get('[data-cy=searchbarFilter]').type('markt');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 2)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Marktplatz')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label p').should('have.text', 'Marktkieker')

      cy.get('[data-cy=searchbarFilter]').type('X');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 0)

      cy.get('[data-cy=searchbarFilter]').clear();
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('[data-cy=searchbarFilter]').type('DENKMAL');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 1)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Kriegerdenkmal 1870-71')
    });

    it('sorts items by distance, name, relevance and category', () => {
      // default: sort by distance
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label h3').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label h3').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label h3').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label h3').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label h3').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Hotel')

      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').should('have.length', 4)
      cy.get('ion-select-popover ion-item.item-radio-checked').should('have.text', 'Entfernung')

      // sort by name
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(1).find('ion-radio').click()

      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label p').should('have.text', 'Charisma')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label p').should('have.text', 'Christuskirche')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label p').should('have.text', 'Kriegerdenkmal 1870-71')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label p').should('have.text', 'Marktkieker')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label p').should('have.text', 'Marktplatz')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label p').should('have.text', '')

      // sort by relevance
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(2).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label h3').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label h3').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label h3').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label h3').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label h3').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Parking')

      // sort by category
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(3).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label h3').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label h3').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label h3').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label h3').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label h3').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Restaurant')

      // sort by distance
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(0).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label h3').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label h3').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label h3').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label h3').should('have.text', 'Amenity')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label h3').should('have.text', 'Restaurant')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Hotel')
    });

    it('restores state after poi selection and back', () => {
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 7 mit Filter, 7 insgesamt')
      cy.get('[data-cy=searchbarFilter]').type('er');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 3)
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 3 mit Filter, 7 insgesamt')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
      cy.get('[data-cy=buttonNavigateBack]').click()

      cy.get('app-discover-list ion-list ion-item').should('have.length', 3)
      cy.get('[data-cy=componentDiscoverSearchToolbar] ion-title').should('have.text', 'Gefundene POIs: 3 mit Filter, 7 insgesamt')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Hotel')
    });
  });

  describe('with search dialog', () => {

    xit('has distance selection', () => {
      cy.get('[data-cy=buttonSearchModal]').click()

      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')

      cy.get('[data-cy=selectDistance]').click()
      cy.get('ion-select-popover ion-item').should('have.length', 11)
      cy.get('ion-select-popover ion-item.item-radio-checked').should('have.text', '0,25 km')
      cy.get('ion-select-popover ion-item').eq(5).find('ion-radio').click()
      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '5 km, Maximale Entfernung')

      cy.get('[data-cy=buttonStartSearch]').click()

      // TODO #32 - not working on GitHub-CI
      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=all&distance=5000')
    });

    xit('has favorite category buttons', () => {
      cy.get('[data-cy=buttonSearchModal]').click()

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
      cy.get('[data-cy=buttonSearchModal]').click()
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

    it('updates distance circle on map', () => {
      cy.get('[data-cy=buttonSearchModal]').click()

      cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', '0,25 km, Maximale Entfernung')
      cy.get('[data-cy=componentMyPositionMap] .map svg').should('exist')
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.length', 1)
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'fill', '#ff7777')
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'd', 'M13.808355554938316,233.7005926258862a174,174 0 1,0 348,0 a174,174 0 1,0 -348,0 ')

      cy.get('[data-cy=selectDistance]').click()
      cy.get('ion-select-popover ion-item').eq(5).find('ion-radio').click()
      cy.get('[data-cy=componentMyPositionMap] .map svg').find('path.leaflet-interactive').should('have.attr', 'd', 'M-29.636977777816355,233.24385850178078a217,217 0 1,0 434,0 a217,217 0 1,0 -434,0 ')
    });

    it('has zoom buttons at the map', () => {
      cy.get('[data-cy=buttonSearchModal]').click()

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
