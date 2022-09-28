describe('Discover page', () => {

  const discoverPage = {
    visit: () => {
      cy.visit('/discover')
    }
  }

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');
    discoverPage.visit()
  });

  describe('with list view', () => {

    it('shows poi list', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').first().as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').should('have.text', 'Hotel')
      cy.get('@wasserburgItem').find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')

      cy.get('app-discover-list ion-list ion-item').eq(2).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('ion-label p').should('have.text', 'Christuskirche')

      cy.get('app-discover-list ion-list ion-item').last().as('informationItem')
      cy.get('@informationItem').find('ion-label h3').should('have.text', 'Information')
      cy.get('@informationItem').find('ion-label p').should('have.text', '')

      cy.get('@search-pois')
        .its('request.url')
        .should('deep.equal','http://localhost:3000/pois?lat=52.908&lon=8.588&category=restaurant&distance=1000')
    });

    it('shows poi details as line item', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('app-discover-list ion-list ion-item').eq(2).as('christuskircheItem')
      cy.get('@christuskircheItem').find('ion-label h3').should('have.text', 'Church')
      cy.get('@christuskircheItem').find('ion-label p').should('have.text', 'Christuskirche')
      cy.get('@christuskircheItem').find('ion-thumbnail img').should('have.attr', 'src', 'assets/category/church.png')
    });

    it('navigates to poi details after poi click', () => {
      cy.get('app-discover-list ion-list ion-item').first().as('wasserburgItem')
      cy.get('@wasserburgItem').find('ion-label h3').click()

      cy.url().should('include', '/poi/way-12345678')
      cy.get('ion-content').contains('Akzent Hotel Zur Wasserburg')
    });

    it('filters items by ignoring uppercase and lowercase', () => {
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')

      cy.get('[data-cy=searchbarFilter]').type('markt');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 2)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Marktkieker')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label p').should('have.text', 'Marktplatz')

      cy.get('[data-cy=searchbarFilter]').type('X');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 0)

      cy.get('[data-cy=searchbarFilter]').clear();
      cy.get('app-discover-list ion-list ion-item').should('have.length', 7)

      cy.get('[data-cy=searchbarFilter]').type('DENKMAL');
      cy.get('app-discover-list ion-list ion-item').should('have.length', 1)
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Kriegerdenkmal 1870-71')
    });

    it('sorts items by name and category', () => {
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')
      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label p').should('have.text', 'Charisma')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label p').should('have.text', 'Christuskirche')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label p').should('have.text', 'Kriegerdenkmal 1870-71')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label p').should('have.text', 'Marktkieker')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label p').should('have.text', 'Marktplatz')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label p').should('have.text', '')

      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').should('have.length', 2)
      cy.get('ion-select-popover ion-item.item-radio-checked').should('have.text', 'Name')

      // sort by category
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(1).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Marktkieker')
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Amenity')

      cy.get('app-discover-list ion-list ion-item').eq(1).find('ion-label h3').should('have.text', 'Church')
      cy.get('app-discover-list ion-list ion-item').eq(2).find('ion-label h3').should('have.text', 'Hotel')
      cy.get('app-discover-list ion-list ion-item').eq(3).find('ion-label h3').should('have.text', 'Information')
      cy.get('app-discover-list ion-list ion-item').eq(4).find('ion-label h3').should('have.text', 'Memorial')
      cy.get('app-discover-list ion-list ion-item').eq(5).find('ion-label h3').should('have.text', 'Parking')
      cy.get('app-discover-list ion-list ion-item').last().find('ion-label h3').should('have.text', 'Restaurant')

      // sort by name
      pressEscape();
      cy.get('[data-cy=buttonSort]').click()
      cy.get('ion-select-popover ion-item').eq(0).find('ion-radio').click()
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label p').should('have.text', 'Akzent Hotel Zur Wasserburg')
      cy.get('app-discover-list ion-list ion-item').first().find('ion-label h3').should('have.text', 'Hotel')
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
