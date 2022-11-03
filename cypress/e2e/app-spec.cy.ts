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

  // TODO #32 - not working on GitHub-CI
  xit('has a menu', () => {
    appSite.visit()
    cy.contains(appSite.title());

    clickMenuItem('Ein Dank an ...');
    cy.url().should('include', '/credit')
    cy.get('ion-content').contains('Openstreetmap')


    clickMenuItem('Kontakt / Impressum');
    cy.url().should('include', '/about')
    cy.get('ion-content').contains('Softwareentwicklung')


    clickMenuItem('Entdecken');
    cy.url().should('include', '/discover')
    cy.get('[data-cy=buttonToggleView]').click()
    cy.get('ion-content').contains('Es wurden keine POIs gefunden.')
  });

  function clickMenuItem(menuItemLabel: string) {
    cy.get('ion-list#menu-list').contains(menuItemLabel).click()
  }
});
