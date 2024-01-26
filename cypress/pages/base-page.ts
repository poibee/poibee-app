abstract class BasePage {

  open(): BasePage {
    cy.visit(this.url())
    return this
  }

  openWithQueryParameter(query: string): BasePage {
    cy.visit(this.url() + query)
    return this
  }

  openWithUrlParameter(urlParameter: string): BasePage {
    cy.visit(this.url() + urlParameter)
    return this
  }

  htmlTitle(): HtmlTitleComponent {
    return new HtmlTitleComponent()
  }

  title(): TitleComponent {
    return new TitleComponent()
  }

  content(): ContentComponent {
    return new ContentComponent()
  }

  abstract url(): string

  assertUrl(url: string): void {
    cy.url().should('include', url)
  }

}

class HtmlTitleComponent {

  private static CY_LOCATOR = "title"

  assertText(text: string) {
    cy.get(HtmlTitleComponent.CY_LOCATOR).should('have.text', text)
  }
}

class TitleComponent {

  private static CY_LOCATOR = "ion-title"

  assertText(text: string) {
    cy.get(TitleComponent.CY_LOCATOR).should('have.text', text)
  }
}

class ContentComponent {

  private static CY_LOCATOR = 'ion-content'

  assertText(text: string) {
    cy.get(ContentComponent.CY_LOCATOR).contains(text)
  }
}

export { BasePage, ContentComponent }
