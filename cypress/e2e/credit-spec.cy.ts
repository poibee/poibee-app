import {CreditPage}  from "../pages/credit-page"

describe('Credit page', () => {

  const creditPage = new CreditPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000)

    cy.viewport('iphone-x')

    creditPage.open()
  })

  describe('with default elements', () => {

    it('shows html title', () => {
      creditPage.htmlTitle().assertText('Ionic App')
    })

    it('shows title', () => {
      creditPage.title().assertText('Ein Dank an ...')
    })

    it('shows content', () => {
      creditPage.content().assertText('Openstreetmap')
    })
  })

})
