import {DiscoverPage}  from "../pages/discover-page";
import {PoiPage} from "../pages/poi-page";

describe('Discover page shows list', () => {

  const discoverPage = new DiscoverPage()

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 60000)

    cy.viewport('iphone-x')
    cy.intercept('GET', '/pois/way-12345678', { fixture: 'poi-wasserburg.json' }).as('poi-wasserburg');
    cy.intercept('GET', '/pois*', { fixture: 'pois.json' }).as('search-pois');

    discoverPage.open()
    discoverPage.toggleView().toggle();
    discoverPage.search().openDialog()
    discoverPage.search().executeSearch()
  });

  describe('with list view', () => {

    it('should show pois as list', () => {
      discoverPage.list().assertCount(7)

      discoverPage.list().item(0).assertCategory('Information')
      discoverPage.list().item(0).assertLabel('')

      discoverPage.list().item(3).assertCategory('Church')
      discoverPage.list().item(3).assertLabel('Christuskirche')

      discoverPage.list().item(6).assertCategory('Hotel')
      discoverPage.list().item(6).assertLabel('Akzent Hotel Zur Wasserburg')
    });

    it('should show poi details as chips in line item', () => {
      discoverPage.list().assertCount(7)

      discoverPage.list().item(0).assertCategory('Information')
      discoverPage.list().item(0).assertLabel('')
      discoverPage.list().item(0).assertHasCategoryImage('assets/category/information.png')
      discoverPage.list().item(0).chipCuisine().assertIsExistent(false)
      discoverPage.list().item(0).chipDistance().assertText('0.02\u00a0km')
      discoverPage.list().item(0).chipDirection().assertCssClass('rotate-west')
      discoverPage.list().item(0).chipOpeningHours().assertIsExistent(false)
      discoverPage.list().item(0).chipWebsite().assertIsExistent(false)
      discoverPage.list().item(0).chipWikidata().assertIsExistent(false)
      discoverPage.list().item(0).chipWikipedia().assertIsExistent(false)

      discoverPage.list().item(3).assertCategory('Church')
      discoverPage.list().item(3).assertLabel('Christuskirche')
      discoverPage.list().item(3).assertHasCategoryImage('assets/category/church.png')
      discoverPage.list().item(3).chipCuisine().assertText('German, ...')
      discoverPage.list().item(3).chipDistance().assertText('0.05\u00a0km')
      discoverPage.list().item(3).chipDirection().assertCssClass('rotate-northeast')
      discoverPage.list().item(3).chipOpeningHours().assertText('Zeiten')
      discoverPage.list().item(3).chipWebsite().assertText('Webseite')
      discoverPage.list().item(3).chipWikidata().assertText('Wikidata')
      discoverPage.list().item(3).chipWikipedia().assertText('Wikipedia')
    });

    it('should show poi details as chips with popup for further informations', () => {
      discoverPage.list().assertCount(7)

      discoverPage.list().item(3).assertCategory('Church')

      discoverPage.list().item(3).chipCuisine().assertText('German, ...')
      discoverPage.list().item(3).chipCuisine().click()
      discoverPage.list().item(3).chipCuisine().popover().assertText('German, Latin')
      discoverPage.pressEscape()

      discoverPage.list().item(3).chipOpeningHours().assertText('Zeiten')
      discoverPage.list().item(3).chipOpeningHours().click()
      discoverPage.list().item(3).chipOpeningHours().popover().assertText('Th 12:00-12:00; Su 13:30-17:00')
      discoverPage.pressEscape()

      discoverPage.list().item(3).chipVending().assertText('Verkauf')
      discoverPage.list().item(3).chipVending().click()
      discoverPage.list().item(3).chipVending().popover().assertText('wine')
      discoverPage.pressEscape()

      discoverPage.list().item(3).chipWebsite().assertText('Webseite')
      discoverPage.list().item(3).chipWebsite().click()
      discoverPage.list().item(3).chipWebsite().popover().assertText('https://www.kirche-harpstedt.de/')
      discoverPage.list().item(3).chipWebsite().popover().assertLink('https://www.kirche-harpstedt.de/')
      discoverPage.pressEscape()

      discoverPage.list().item(3).chipWikidata().assertText('Wikidata')
      discoverPage.list().item(3).chipWikidata().click()
      discoverPage.list().item(3).chipWikidata().popover().assertText('https://www.wikidata.org/wiki/Q1087325')
      discoverPage.list().item(3).chipWikidata().popover().assertLink('https://www.wikidata.org/wiki/Q1087325')
      discoverPage.pressEscape()

      discoverPage.list().item(3).chipWikipedia().assertText('Wikipedia')
      discoverPage.list().item(3).chipWikipedia().click()
      discoverPage.list().item(3).chipWikipedia().popover().assertText('https://de.wikipedia.org/wiki/Christuskirche_(Harpstedt)')
      discoverPage.list().item(3).chipWikipedia().popover().assertLink('https://de.wikipedia.org/wiki/Christuskirche_(Harpstedt)')
    });
  });

  describe('with navigation control', () => {

    it('should navigate to poi details after poi click', () => {
      discoverPage.list().assertCount(7)

      discoverPage.list().item(6).assertLabel('Akzent Hotel Zur Wasserburg')
      discoverPage.list().item(6).click()

      const poiPage = new PoiPage();
      poiPage.assertUrl('/poi/way-12345678')
      poiPage.title().assertText('Akzent Hotel Zur Wasserburg')
    });

    it('should restore state after poi selection and back', () => {
      discoverPage.title().assertText('Gefundene POIs: 7 mit Filter, 7 insgesamt')
      discoverPage.filter().type('er');
      discoverPage.list().assertCount(3)
      discoverPage.title().assertText('Gefundene POIs: 3 mit Filter, 7 insgesamt')
      discoverPage.list().item(2).assertCategory('Hotel')
      discoverPage.list().item(2).click()

      const poiPage = new PoiPage();
      poiPage.assertUrl('/poi/way-12345678')
      poiPage.title().assertText('Akzent Hotel Zur Wasserburg')
      poiPage.header().buttonNavigateBack().click()

      discoverPage.toggleView().assertList()
      discoverPage.list().assertCount(3)
      discoverPage.title().assertText('Gefundene POIs: 3 mit Filter, 7 insgesamt')
      discoverPage.list().item(2).assertCategory('Hotel')
    });
  });

  describe('with filter control', () => {

    it('should filter pois by ignoring uppercase and lowercase', () => {
      discoverPage.list().assertCount(7)
      discoverPage.list().item(0).assertLabel('')

      discoverPage.filter().type('markt');
      discoverPage.list().assertCount(2)
      discoverPage.list().item(0).assertLabel('Marktplatz')
      discoverPage.list().item(1).assertLabel('Marktkieker')

      discoverPage.filter().type('X');
      discoverPage.list().assertEmpty()

      discoverPage.filter().clear();
      discoverPage.list().assertCount(7)

      discoverPage.filter().type('DENKMAL');
      discoverPage.list().assertCount(1)
      discoverPage.list().item(0).assertLabel('Kriegerdenkmal 1870-71')
    });
  });

  describe('with sort control', () => {

    it('should sort items by distance, name, category and relevance', () => {
      discoverPage.list().assertCount(7)

      // default: sort by distance
      discoverPage.list().item(0).assertCategory('Information')
      discoverPage.list().item(1).assertCategory('Parking')
      discoverPage.list().item(2).assertCategory('Memorial')
      discoverPage.list().item(3).assertCategory('Church')
      discoverPage.list().item(4).assertCategory('Amenity')
      discoverPage.list().item(5).assertCategory('Restaurant')
      discoverPage.list().item(6).assertCategory('Hotel')

      discoverPage.sort().open()
      discoverPage.sort().assertCount(4)
      discoverPage.sort().assertSelectedElement('Entfernung')

      // sort by name
      discoverPage.pressEscape()
      discoverPage.sort().open()
      discoverPage.sort().clickElement(1)
      discoverPage.list().item(0).assertLabel('Akzent Hotel Zur Wasserburg')
      discoverPage.list().item(1).assertLabel('Charisma')
      discoverPage.list().item(2).assertLabel('Christuskirche')
      discoverPage.list().item(3).assertLabel('Kriegerdenkmal 1870-71')
      discoverPage.list().item(4).assertLabel('Marktkieker')
      discoverPage.list().item(5).assertLabel('Marktplatz')
      discoverPage.list().item(6).assertLabel('')

      // sort by relevance
      discoverPage.sort().open()
      discoverPage.sort().clickElement(2)
      discoverPage.list().item(0).assertCategory('Church')
      discoverPage.list().item(1).assertCategory('Restaurant')
      discoverPage.list().item(2).assertCategory('Hotel')
      discoverPage.list().item(3).assertCategory('Amenity')
      discoverPage.list().item(4).assertCategory('Parking')
      discoverPage.list().item(5).assertCategory('Memorial')
      discoverPage.list().item(6).assertCategory('Information')

      // sort by category
      discoverPage.sort().open()
      discoverPage.sort().clickElement(3)
      discoverPage.list().item(0).assertCategory('Amenity')
      discoverPage.list().item(1).assertCategory('Church')
      discoverPage.list().item(2).assertCategory('Hotel')
      discoverPage.list().item(3).assertCategory('Information')
      discoverPage.list().item(4).assertCategory('Memorial')
      discoverPage.list().item(5).assertCategory('Parking')
      discoverPage.list().item(6).assertCategory('Restaurant')

      // sort by distance
      discoverPage.sort().open()
      discoverPage.sort().clickElement(0)
      discoverPage.list().item(0).assertCategory('Information')
      discoverPage.list().item(1).assertCategory('Parking')
      discoverPage.list().item(2).assertCategory('Memorial')
      discoverPage.list().item(3).assertCategory('Church')
      discoverPage.list().item(4).assertCategory('Amenity')
      discoverPage.list().item(5).assertCategory('Restaurant')
      discoverPage.list().item(6).assertCategory('Hotel')
    });
  });
});
