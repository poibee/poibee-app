import {BasePage} from "./base-page"

class AppPage extends BasePage {

  url(): string {
    return '/'
  }

  menu(): MenuComponent {
    return new MenuComponent()
  }
}

class MenuComponent {

  private static CY_MENU_LIST = 'ion-list#menu-list'

  clickItem(menuLabel: string) {
    cy.get(MenuComponent.CY_MENU_LIST).contains(menuLabel).click()
  }
}

export { AppPage }
