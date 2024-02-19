import {BasePage} from "./base-page"

class DiscoverPage extends BasePage {

  url(): string {
    return '/discover'
  }

  map(): MapComponent {
    return new MapComponent()
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

class SearchDistanceComponent {

  assertDistance(value: string) {
    cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', value)
  }
}

class FilterComponent {

  private static CY_LOCATOR = '[data-cy=searchbarFilter]'

  type(value: string) {
    cy.get(FilterComponent.CY_LOCATOR).type(value)
  }

  clear() {
    cy.get(FilterComponent.CY_LOCATOR).clear()
  }
}

class SortSelection {

  private static CY_LOCATOR_OPEN = '[data-cy=buttonSort]'
  private static CY_LOCATOR_POPOVER_RADIO_ITEM = 'ion-select-popover ion-item'

  open() {
    cy.get(SortSelection.CY_LOCATOR_OPEN).click()
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
}

class SearchCategoryComponent {

  assertCategory(value: string) {
    cy.get('[data-cy=buttonCategoryModal').should('have.text', value)
  }
}

class SearchMapComponent {

  assertCenter(value: string) {
    cy.get('[data-cy=componentMyPositionMap]').should('have.attr', 'ng-reflect-my-position', value)
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

  assertHasCssClass(cssClass: string) {
    cy.get(this.locator).first().find('img').first().should('have.class', cssClass)
  }

  assertHasMarkerImage(imagePath: string) {
    cy.get(this.locator).first().find('img').first().should('have.attr', 'src', imagePath)
  }

  assertHasCategoryImage(imagePath: string) {
    cy.get(this.locator).last().find('img').last().should('have.attr', 'src', imagePath)
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
