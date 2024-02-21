describe('Discover page', () => {

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000);

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
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
