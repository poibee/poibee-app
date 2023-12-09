class DiscoverPage {

  open(): DiscoverPage {
    cy.visit('/discover')
    return this;
  }

  openWithQuery(query: string): DiscoverPage {
    cy.visit('/discover' + query)
    return this;
  }

  map(): MapComponent {
    return new MapComponent();
  }

  search(): SearchDialog {
    return new SearchDialog();
  }
}

class MapComponent {

  private static CY_LOCATOR = "[data-cy=componentDiscoverMap] .map";

  assertPosition(lat: number, lon: number) {
    cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-lat', lat)
    cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-lon', lon)
  }

  assertZoom(value: number) {
    return cy.get(MapComponent.CY_LOCATOR).should('have.attr', 'data-cy-map-zoom', value)
  }

  positionMarker(): PositionMarker {
    return new PositionMarker(MapComponent.CY_LOCATOR);
  }

  poiMarkers(): PoiMarkers {
    return new PoiMarkers(MapComponent.CY_LOCATOR);
  }

  distanceMarker(): DistanceMarker {
    return new DistanceMarker(MapComponent.CY_LOCATOR);
  }

  buttons(): ButtonsComponent {
    return new ButtonsComponent(MapComponent.CY_LOCATOR);
  }
}

class SearchDialog {

  openDialog(): void {
    cy.get('[data-cy=buttonSearchModal]').click()
  }

  distance(): SearchDistanceComponent {
    return new SearchDistanceComponent();
  }

  category(): SearchCategoryComponent {
    return new SearchCategoryComponent();
  }

  map(): SearchMapComponent {
    return new SearchMapComponent();
  }
}

class SearchDistanceComponent {

  assertDistance(value: string) {
    cy.get('[data-cy=selectDistance]').should('have.attr', 'aria-label', value)
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

  private locator: string;

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' img[data-cy-type="position"]';
  }

  assertPosition(lat: number, lon: number) {
    cy.get(this.locator).should('have.attr', 'data-cy-position-lat', lat)
    cy.get(this.locator).should('have.attr', 'data-cy-position-lon', lon)
  }
}

class DistanceMarker {

  private locator: string;

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' path[data-cy-type="distance"]';
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

  private locator: string;

  constructor(parentLocator: string) {
    this.locator = parentLocator + ' img[data-cy-type="poi"]';
  }

  assertEmpty() {
    cy.get(this.locator).should('have.length', 0)
  }

  assertCount(count: number) {
    cy.get(this.locator).should('have.length', count)
  }
}

class MapButton {

  private locator: string;

  constructor(parentLocator: string, title: string) {
    this.locator = parentLocator + ' .leaflet-control [title="' + title + '"]';
  }

  click() {
    cy.get(this.locator).click();
  }
}

class PositionByGeocodeButton {

  constructor(private parentLocator: string) {
  }

  search(value: string) {
    cy.get(this.parentLocator + ' .leaflet-control [aria-label="Initiate a new search"').click();
    cy.get(this.parentLocator + ' .leaflet-control-geocoder input').type(value)
  }

  execute() {
    cy.get(this.parentLocator + ' .leaflet-control-geocoder input').type('{enter}')
  }
}

export { DiscoverPage };
