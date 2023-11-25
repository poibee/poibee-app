class DiscoverPage {

  open(): DiscoverPage {
    cy.visit('/discover')
    return this;
  }

  map(): MapComponent {
    return new MapComponent();
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

  buttons(): ButtonsComponent {
    return new ButtonsComponent(MapComponent.CY_LOCATOR);
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
    this.locator = parentLocator + ' .leaflet-pane.leaflet-marker-pane .leaflet-marker-icon';
  }

  assertPosition(lat: number, lon: number) {
    cy.get(this.locator).should('have.attr', 'data-cy-marker-lat', lat)
    cy.get(this.locator).should('have.attr', 'data-cy-marker-lon', lon)
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
