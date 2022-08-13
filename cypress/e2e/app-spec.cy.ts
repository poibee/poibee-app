describe('PoiBee-App', () => {

  const appSite = {
    visit: () => {
      cy.visit('/')
    },

    title: () => {
      return 'POIs in Harpstedt und überall'
    },
  }

  beforeEach(() => {
    appSite.visit()
  });

  it('has a menu', () => {
    cy.viewport('iphone-x');

    appSite.visit()
    cy.contains(appSite.title());

    cy.get('ion-menu-button').click()

    clickMenuItem('Ein Dank an ...');
    cy.url().should('include', '/credit')
    cy.get('ion-content').contains('Openstreetmap')
    cy.get('ion-menu-button').click()

    clickMenuItem('Kontakt / Impressum');
    cy.url().should('include', '/about')
    cy.get('ion-content').contains('Softwareentwicklung')
    cy.get('ion-menu-button').click()
  });

  function clickMenuItem(menuItemLabel: string) {
    cy.get('ion-list#menu-list').contains(menuItemLabel).click()
    cy.get('ion-list#menu-list').contains(menuItemLabel).click({force: true})
  }
});
