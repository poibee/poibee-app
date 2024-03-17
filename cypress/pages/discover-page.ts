import {BasePage} from "./base-page"

class DiscoverPage extends BasePage {

  url(): string {
    return '/discover'
  }

  map(): MapComponent {
    return new MapComponent()
  }

  list(): ListComponent {
    return new ListComponent()
  }

  search(): SearchDialog {
    return new SearchDialog()
  }

  filter(): FilterComponent {
    return new FilterComponent()
  }

  sort(): SortSelection {
    return new SortSelection()
  }

  toggleView(): ToggleViewComponent {
    return new ToggleViewComponent()
  }

  detailToolbar(): DetailToolbarComponent {
    return new DetailToolbarComponent()
  }
}

class MapComponent {

  private static CY_LOCATOR = "[data-cy=componentDiscoverMap] .map"

  assertIsVisible(visible: boolean): void {
    cy.get(MapComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertPosition(lat: number, lon: number) {
    cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-lat', lat)
    cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-lon', lon)
  }

  assertZoom(value: number) {
    return cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-zoom', value)
  }

  positionMarker(): PositionMarker {
    return new PositionMarker(MapComponent.CY_LOCATOR)
  }

  poiMarkers(): PoiMarkers {
    return new PoiMarkers(MapComponent.CY_LOCATOR)
  }

  distanceMarker(): DistanceMarker {
    return new DistanceMarker(MapComponent.CY_LOCATOR)
  }

  buttons(): ButtonsComponent {
    return new ButtonsComponent(MapComponent.CY_LOCATOR)
  }

  navigator(): NavigatorComponent {
    return new NavigatorComponent(MapComponent.CY_LOCATOR)
  }

  markersLayer(): MarkersLayerComponent {
    return new MarkersLayerComponent(MapComponent.CY_LOCATOR)
  }

  spinner(): SpinnerComponent {
    return new SpinnerComponent(MapComponent.CY_LOCATOR)
  }
}


class ListComponent {

  private static CY_LOCATOR = 'app-discover-list ion-list'

  assertIsVisible(visible: boolean): void {
    cy.get(ListComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertEmpty() {
    this.findItemsLocator().should('not.exist')
  }

  assertCount(count: number) {
    this.findItemsLocator().should('have.length', count)
  }

  item(index: number): ListItemComponent {
    const locatorFunction = () => this.findItemsLocator().eq(index);
    return new ListItemComponent(locatorFunction);
  }

  private findItemsLocator() {
    return cy.get(ListComponent.CY_LOCATOR).first().find('ion-item');
  }
}

class ListItemComponent {

  constructor(private parentLocator: () => Cypress.Chainable<JQuery<HTMLElement>>) {
  }

  click() {
    this.parentLocator().click()
  }

  assertLabel(label: string) {
    this.parentLocator().find('[data-cy=detailToolbarLabelName]').should('have.text', label)
  }

  clickLabel() {
    this.parentLocator().find('[data-cy=detailToolbarLabelName]').click()
  }

  assertCategory(label: string) {
    this.parentLocator().find('[data-cy=detailToolbarLabelCategory]').should('have.text', label)
  }

  assertHasCategoryImage(imagePath: string) {
    this.parentLocator().first().find('ion-thumbnail img').should('have.attr', 'src', imagePath)
    this.parentLocator().first().find('img').last().should('have.attr', 'src', imagePath)
  }

  chipCuisine(): Chip {
    return this.chipLocator('[data-cy=chipCuisine]', '[data-cy=popoverChipCuisine]')
  }

  chipDistance(): Chip {
    return this.chipLocator('[data-cy=chipDistance]', null)
  }

  chipDirection(): Chip {
    return this.chipLocator('[data-cy=chipDirection]', null)
  }

  chipOpeningHours(): Chip {
    return this.chipLocator('[data-cy=chipOpeningHours]', '[data-cy=popoverChipOpeningHours]')
  }

  chipWebsite(): Chip {
    return this.chipLocator('[data-cy=chipWebsite]', '[data-cy=popoverChipWebsite]')
  }

  chipWikidata(): Chip {
    return this.chipLocator('[data-cy=chipWikidata]', '[data-cy=popoverChipWikidata]')
  }

  chipWikipedia(): Chip {
    return this.chipLocator('[data-cy=chipWikipedia]', '[data-cy=popoverChipWikipedia]')
  }

  chipVending(): Chip {
    return this.chipLocator('[data-cy=chipVending]', '[data-cy=popoverChipVending]')
  }

  private chipLocator(selector: string, popoverSelector: string) {
    return new Chip(() => this.parentLocator().first().find(selector), popoverSelector);
  }
}

class SearchDialog {

  openDialog(): void {
    cy.get('[data-cy=buttonSearchModal]').click()
  }

  distance(): SearchDistanceComponent {
    return new SearchDistanceComponent()
  }

  category(): SearchCategoryComponent {
    return new SearchCategoryComponent()
  }

  map(): SearchMapComponent {
    return new SearchMapComponent()
  }

  executeSearch(): void {
    cy.get('[data-cy=buttonStartSearch]').click()
  }
}

class SearchCategoryDialog {

  executeSelection(): void {
    cy.get('[data-cy=buttonSelectCategory]').click()
  }

  assertTitle(title: string) {
    cy.get('app-category-modal ion-title').should('have.text', title)
  }

  mainItemsAssertCount(count: number) {
    cy.get('app-category-modal app-category-modal-main-item').should('have.length', count)
  }

  mainItemsAssertChecked(label: string) {
    cy
      .get('app-category-modal app-category-modal-main-item ion-item ion-radio.radio-checked')
      .parent('ion-item')
      .find('ion-label')
      .should('have.text', label)
  }

  mainItemsAssertLabel(mainIndex: number, label: string) {
    cy.get('app-category-modal app-category-modal-main-item ion-item ion-label').eq(mainIndex).should('have.text', label)
  }

  mainItemsClick(mainIndex: number) {
    cy.get('app-category-modal app-category-modal-main-item').eq(mainIndex).click()
  }

  subItemsAssertCount(mainIndex: number, count: number) {
    cy.get('app-category-modal app-category-modal-main-item').eq(mainIndex).find('ion-item').should('have.length', count)
  }

  subItemsAssertLabel(mainIndex: number, subIndex: number, label: string) {
    cy.get('app-category-modal app-category-modal-main-item').eq(mainIndex).find('ion-item ion-label').eq(subIndex).should('have.text', label)
  }

  subItemsClick(mainIndex: number, subIndex: number) {
    cy.get('app-category-modal app-category-modal-main-item').eq(mainIndex).find('ion-item').eq(subIndex).click()
  }
}

class SearchDistanceComponent {

  private static CY_LOCATOR = '[data-cy=selectDistance]'
  private static CY_LOCATOR_POPOVER_RADIO_ITEM = 'ion-select-popover ion-item'

  assertDistance(value: string) {
    cy.get(SearchDistanceComponent.CY_LOCATOR).should('have.attr', 'aria-label', value)
  }

  click() {
    cy.get(SearchDistanceComponent.CY_LOCATOR).click()
  }

  popupAssertCount(count: number) {
    cy.get(SearchDistanceComponent.CY_LOCATOR_POPOVER_RADIO_ITEM).should('have.length', count)
  }

  assertSelectedElement(label: string) {
    cy.get(SearchDistanceComponent.CY_LOCATOR_POPOVER_RADIO_ITEM + '.item-radio-checked').should('have.text', label)
  }

  clickElement(index: number) {
    cy.get(SearchDistanceComponent.CY_LOCATOR_POPOVER_RADIO_ITEM).eq(index).find('ion-radio').click()
  }
}

class FilterComponent {

  private static CY_LOCATOR = '[data-cy=searchbarFilter]'

  type(value: string) {
    cy.get(FilterComponent.CY_LOCATOR).type(value)
  }

  clear() {
    cy.get(FilterComponent.CY_LOCATOR).type('{selectall}{backspace}')
  }
}

class SortSelection {

  private static CY_LOCATOR_OPEN = '[data-cy=buttonSort]'
  private static CY_LOCATOR_POPOVER_RADIO_ITEM = 'ion-select-popover ion-item'

  open() {
    cy.wait(500)
    cy.get(SortSelection.CY_LOCATOR_OPEN).click()
  }

  assertCount(count: number) {
    cy.get(SortSelection.CY_LOCATOR_POPOVER_RADIO_ITEM).should('have.length', count)
  }

  assertSelectedElement(label: string) {
    cy.get(SortSelection.CY_LOCATOR_POPOVER_RADIO_ITEM + '.item-radio-checked').should('have.text', label)
  }

  clickElement(index: number) {
    cy.get(SortSelection.CY_LOCATOR_POPOVER_RADIO_ITEM).eq(index).find('ion-radio').click()
  }
}

class ToggleViewComponent {

  private static CY_LOCATOR = '[data-cy=buttonToggleView]'

  toggle() {
    cy.get(ToggleViewComponent.CY_LOCATOR).click()
  }

  assertMap() {
    cy.get(ToggleViewComponent.CY_LOCATOR).should('have.text', 'Karte')
    cy.get(ToggleViewComponent.CY_LOCATOR).should('not.have.text', 'Liste')
  }

  assertList() {
    cy.get(ToggleViewComponent.CY_LOCATOR).should('have.text', 'Liste')
    cy.get(ToggleViewComponent.CY_LOCATOR).should('not.have.text', 'Karte')
  }
}

class SearchCategoryComponent {

  assertButtonCategory(value: string) {
    cy.get('[data-cy=buttonCategoryModal').should('have.text', value)
  }

  openDialog() {
    cy.get('[data-cy=buttonCategoryModal]').click()
  }

  assertFavoriteButtonsCount(count: number) {
    cy.get('[data-cy=itemFavoriteCategory] ion-button').should('have.length', count)
  }

  clickFavoriteButtonsElement(index: number) {
    cy.get('[data-cy=itemFavoriteCategory] ion-button').eq(index).click()
  }

  dialog(): SearchCategoryDialog {
    return new SearchCategoryDialog()
  }
}

class SearchMapComponent {

  private static CY_LOCATOR = "[data-cy=componentMyPositionMap]"

  assertCenter(value: string) {
    cy.get(SearchMapComponent.CY_LOCATOR).should('have.attr', 'ng-reflect-my-position', value)
  }

  assertNumberOfGemetries(numberOfGemetries: number) {
    cy.get(SearchMapComponent.CY_LOCATOR).find('path').should('have.length', numberOfGemetries)
  }

  assertGeometryColor(color: string) {
    cy.get(SearchMapComponent.CY_LOCATOR).find('path.leaflet-interactive').should('have.attr', 'fill', color)
  }

  assertGeometryValues(values: RegExp) {
    cy.get(SearchMapComponent.CY_LOCATOR).find('path').first().should("have.attr", 'd').and("match", values)
  }

  assertZoomStyle(zoomStyle: string) {
    cy.get(SearchMapComponent.CY_LOCATOR + ' .leaflet-zoom-animated').should('have.attr', 'style', zoomStyle)
  }

  zoomOutClick() {
    cy.get(SearchMapComponent.CY_LOCATOR + ' a.leaflet-control-zoom-out').click()
  }
}

class DetailToolbarComponent {

  private static CY_LOCATOR = 'app-discover-poi-detail-toolbar'

  assertIsVisible(visible: boolean): void {
    cy.get(DetailToolbarComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertText(text: string) {
    cy.get(DetailToolbarComponent.CY_LOCATOR).should('have.text', text)
  }

  assertCategory(category: string) {
    cy.get(DetailToolbarComponent.CY_LOCATOR+ ' [data-cy=detailToolbarLabelCategory]').should('have.text', category)
  }

  assertName(name: string) {
    cy.get(DetailToolbarComponent.CY_LOCATOR+ ' [data-cy=detailToolbarLabelName]').should('have.text', name)
  }
}

class NavigatorComponent {

  constructor(private locator: string) {
  }

  nextClick(): void {
    cy.get(this.locator + ' [data-cy=buttonSelectNextPoi]').click()
  }

  previousClick(): void {
    cy.get(this.locator + ' [data-cy=buttonSelectPreviousPoi]').click()
  }

  assertText(text: string) {
    cy.get(this.locator + ' [data-cy=mapPoiNavigatorText]').should('contain', text)
  }
}

class ButtonsComponent {

  constructor(private locator: string) {
  }

  zoomIn(): MapButton {
    return new MapButton(this.locator, "Zoom in")
  }

  zoomOut() {
    return new MapButton(this.locator, "Zoom out")
  }

  positionByMapCenter(): MapButton {
    return new MapButton(this.locator, "Kartenmitte als Standort")
  }

  positionByDeviceLocation(): MapButton {
    return new MapButton(this.locator, "Standort lokalisieren")
  }

  positionByGeocodeSearch(): PositionByGeocodeButton {
    return new PositionByGeocodeButton(this.locator)
  }
}

class PositionMarker {

  private locator: string

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' img[data-cy-type="position"]'
  }

  assertPosition(lat: number, lon: number) {
    cy.get(this.locator).should('have.attr', 'data-cy-position-lat', lat)
    cy.get(this.locator).should('have.attr', 'data-cy-position-lon', lon)
  }
}

class DistanceMarker {

  private locator: string

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' path[data-cy-type="distance"]'
  }

  assertPosition(lat: number, lon: number) {
    cy.get(this.locator).should('have.attr', 'data-cy-distance-lat', lat)
    cy.get(this.locator).should('have.attr', 'data-cy-distance-lon', lon)
  }

  assertRadius(radius: number) {
    cy.get(this.locator).should('have.attr', 'data-cy-distance-radius', radius)
  }
}

class PoiMarkers {

  private locator: string

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' img[data-cy-type="poi"]'
  }

  assertEmpty() {
    cy.get(this.locator).should('have.length', 0)
  }

  assertCount(count: number) {
    cy.get(this.locator).should('have.length', count)
  }
}

class MapButton {

  private locator: string

  constructor(parentLocator: string, title: string) {
    this.locator = parentLocator + ' .leaflet-control [title="' + title + '"]'
  }

  click() {
    cy.get(this.locator).click()
  }
}

class SpinnerComponent {

  private locator: string

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' ion-spinner'
  }

  assertIsExistent(existent: boolean): void {
    cy.get(this.locator).should(existent ? 'exist' : 'not.exist')
  }

  assertIsVisible(): void {
    cy.get(this.locator).should('be.visible')
  }
}

class PositionByGeocodeButton {

  constructor(private parentLocator: string) {
  }

  search(value: string) {
    cy.get(this.parentLocator + ' .leaflet-control [aria-label="Initiate a new search"').click()
    cy.get(this.parentLocator + ' .leaflet-control-geocoder input').type(value)
  }

  execute() {
    cy.get(this.parentLocator + ' .leaflet-control-geocoder input').type('{enter}')
  }
}

// TODO - Duplication of PoiPage -> MarkersLayerComponent
class MarkersLayerComponent {

  private locator: string

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' .leaflet-pane.leaflet-marker-pane'
  }

  assertIsVisible(visible: boolean) {
    cy.get(this.locator).should(visible ? 'exist' : 'not.exist')
  }

  assertNumberOfMarkers(numberOfMarkers: number) {
    cy.get(this.locator).first().find('img').should('have.length', numberOfMarkers)
  }

  marker(index: number): Marker {
    const locatorFunction = () => cy.get(this.locator).first().find('img').eq(index);
    return new Marker(locatorFunction);
  }
}

class Marker {

  constructor(private parentLocator: () => Cypress.Chainable<JQuery<HTMLElement>>) {
  }

  assertCssClass(cssClass: string) {
    this.parentLocator().should('have.class', cssClass)
  }

  assertImage(imagePath: string) {
    this.parentLocator().should('have.attr', 'src', imagePath)
  }

  click() {
    this.parentLocator().click()
  }

  zindex(): Zindex {
    return new Zindex(this.parentLocator().invoke('css', 'z-index'));
  }
}

class Popover {
  constructor(private popoverLocator: string) {
  }

  assertText(text: string) {
    cy.get(this.popoverLocator).should('have.text', text)
  }

  assertLink(href: string) {
    cy.get(this.popoverLocator + ' a').should('have.attr', 'href', href)
  }
}

class Chip {

  constructor(private locator: () => Cypress.Chainable<JQuery<HTMLElement>>, private popoverLocator: string) {
  }

  popover(): Popover {
    return new Popover(this.popoverLocator);
  }

  click() {
    this.locator().click()
  }

  assertCssClass(cssClass: string) {
    this.locator().should('have.class', cssClass)
  }

  assertText(text: string) {
    this.locator().should('have.text', text)
  }

  assertIsExistent(existent: boolean): void {
    this.locator().should(existent ? 'exist' : 'not.exist')
  }
}

class Zindex {

  constructor(private locator: Cypress.Chainable<any>) {
  }

  assertLess(value: number) {
    this.locator.then(parseInt).should('be.lt', value)
  }

  assertGreaterEquals(value: number) {
    this.locator.then(parseInt).should('be.gte', value)
  }

}
export { DiscoverPage }
