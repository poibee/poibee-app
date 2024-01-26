import {AppPage}  from "../pages/app-page"
import {DiscoverPage} from "../pages/discover-page"

describe('PoiBee App', () => {

  const appPage = new AppPage()
  const discoverPage = (page: AppPage): DiscoverPage => new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 5000)

    appPage.open()
  })

  describe('with default elements', () => {

    it('shows html title', () => {
      appPage.htmlTitle().assertText('Ionic App')
    })

    it('shows title', () => {
      appPage.title().assertText('Gefundene POIs: 0 mit Filter, 0 insgesamt')
    })

    it('shows content', () => {
      appPage.content().assertText('POIs in Harpstedt und überall')
    })

    it('has a menu', () => {
      appPage.menu().clickItem('Ein Dank an ...')
      appPage.assertUrl('/credit')
      appPage.content().assertText('Openstreetmap')

      appPage.menu().clickItem('Kontakt / Impressum')
      appPage.assertUrl('/about')
      appPage.content().assertText('Softwareentwicklung')

      appPage.menu().clickItem('Entdecken')
      appPage.assertUrl('/discover')
      discoverPage(appPage).toggleView().toggle()
      appPage.content().assertText('Es wurden keine POIs gefunden.')
    })
  })
})

