import {AboutPage}  from "../pages/about-page"

describe('About page', () => {

  const aboutPage = new AboutPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000)

    cy.viewport('iphone-x')

    aboutPage.open()
  })

  describe('with default elements', () => {

    it('shows html title', () => {
      aboutPage.htmlTitle().assertText('Ionic App')
    })

    it('shows title', () => {
      aboutPage.title().assertText('Kontakt / Impressum')
    })

    it('shows content', () => {
      aboutPage.content().assertText('Softwareentwicklung')
    })
  })

})
