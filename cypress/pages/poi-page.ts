import {BasePage, ContentComponent} from "./base-page"

class PoiPage extends BasePage {

  url(): string {
    return '/poi'
  }

  header(): HeaderComponent {
    return new HeaderComponent()
  }

  content(): PoiContentComponent {
    return new PoiContentComponent()
  }

}

class HeaderComponent {

  titlePoiLabel(): LabelComponent {
    return new LabelComponent('[data-cy=titlePoiLabel]')
  }

  buttonSelectNextPoi(): ButtonComponent {
    return new ButtonComponent('[data-cy=buttonSelectNextPoi]')
  }

  buttonSelectPreviousPoi(): ButtonComponent {
    return new ButtonComponent('[data-cy=buttonSelectPreviousPoi]')
  }

  buttonNavigateBack(): ButtonComponent {
    return new ButtonComponent('[data-cy=buttonNavigateBack]')
  }

  labelPoiNavigatorText(): LabelComponent {
    return new LabelComponent('[data-cy=labelPoiNavigatorText]')
  }
}

class PoiContentComponent extends ContentComponent {

  assertColumnCategories(categories: string[]): void {
    cy.get('[data-cy=columnCategories]').should('have.text', categories.join(''))
  }

  overviewChipCuisine(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewCuisine]')
  }

  overviewChipOpeningHours(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewOpeningHours]')
  }

  overviewChipVending(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewVending]')
  }

  overviewChipIsBuilding(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewIsBuilding]')
  }

  overviewChipIsBar(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewIsBar]')
  }

  overviewChipIsCafe(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewIsCafe]')
  }

  overviewChipDistance(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewDistance]')
  }

  overviewChipRelevance(): ChipComponent {
    return new ChipComponent('[data-cy=chipOverviewRelevance]')
  }

  referencesChipOsmDataset(): ChipComponent {
    return new ChipComponent('[data-cy=chipOsmDataset]')
  }

  referencesChipOsmLocation(): ChipComponent {
    return new ChipComponent('[data-cy=chipOsmLocation]')
  }

  referencesChipGoogleLocation(): ChipComponent {
    return new ChipComponent('[data-cy=chipGoogleLocation]')
  }

  referencesChipWikipedia(): ChipComponent {
    return new ChipComponent('[data-cy=chipWikipedia]')
  }

  referencesChipWikidata(): ChipComponent {
    return new ChipComponent('[data-cy=chipWikidata]')
  }

  contactItemName(): LabelComponent {
    return new LabelComponent('[data-cy=itemName]')
  }

  contactItemAddress(): LabelComponent {
    return new LabelComponent('[data-cy=itemAddress]')
  }

  contactItemPhone(): LabelComponent {
    return new LabelComponent('[data-cy=itemPhone]')
  }

  contactItemFax(): LabelComponent {
    return new LabelComponent('[data-cy=itemFax]')
  }

  contactItemEmail(): LabelComponent {
    return new LabelComponent('[data-cy=itemEmail]')
  }

  contactItemWebsite(): LabelComponent {
    return new LabelComponent('[data-cy=itemWebsite]')
  }

  map(): MapComponent {
    return new MapComponent()
  }

  osmTags(): OsmTagsComponent {
    return new OsmTagsComponent()
  }

  rawData(): RawDataComponent {
    return new RawDataComponent()
  }
}

class RawDataComponent {

  private static CY_LOCATOR = '[data-cy=cardRawData]'

  assertIsVisible(visible: boolean): void {
    cy.get(RawDataComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertTitle(text: string) {
    cy.get(RawDataComponent.CY_LOCATOR + ' ion-card-title').should('have.text', text)
  }

  assertText(text: string) {
    cy.get(RawDataComponent.CY_LOCATOR + ' pre').should('contain', text)
  }
}

class OsmTagsComponent {

  private static CY_LOCATOR = '[data-cy=cardOsmTags]'

  assertIsVisible(visible: boolean): void {
    cy.get(OsmTagsComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertTitle(text: string) {
    cy.get(OsmTagsComponent.CY_LOCATOR + ' ion-card-title').should('have.text', text)
  }

  assertNumberOfRows(numberOfRows: number) {
    cy.get(OsmTagsComponent.CY_LOCATOR + ' ion-row').should('have.length', numberOfRows)
  }

  row(rowNumber: number) {
    return new OsmTagsRowComponent(OsmTagsComponent.CY_LOCATOR, rowNumber)
  }
}

class OsmTagsRowComponent {
  private readonly rowElement: () => Cypress.Chainable<JQuery<HTMLElement>>;

  constructor(parentLocator: string, rowNumber: number) {
    this.rowElement = () => cy.get(parentLocator + ' ion-row').eq(rowNumber);
  }

  key(): OsmTagsRowEntryComponent {
    return new OsmTagsRowEntryComponent(this.rowElement, '[data-cy=columnKey]')
  }

  value(): OsmTagsRowEntryComponent {
    return new OsmTagsRowEntryComponent(this.rowElement, '[data-cy=columnTag]')
  }
}

class OsmTagsRowEntryComponent {
  constructor(private rowElement: () => Cypress.Chainable<JQuery<HTMLElement>>, private dataSelector: string) {
  }

  assertText(text: string) {
    this.rowElement().find(this.dataSelector).should('have.text', text)
  }

  assertWikiLinkUrl(url: string) {
    this.rowElement().find(this.dataSelector + ' a').first().should('have.attr', 'href', url)
  }

  assertTagInfoLinkUrl(url: string) {
    this.rowElement().find(this.dataSelector + ' a').last().should('have.attr', 'href', url)
  }
}

class ChipComponent {

  constructor(private locator: string) {
  }

  assertIsVisible(visible: boolean): ChipComponent {
    cy.get(this.locator).should(visible ? 'exist' : 'not.exist')
    return this;
  }

  click(): void {
    cy.get(this.locator).click()
  }

  assertText(text: string): ChipComponent {
    cy.get(this.locator).should('have.text', text)
    return this;
  }

  assertIcon(text: string): ChipComponent {
    cy.get(this.locator + ' ion-icon').should('have.class', text)
    return this;
  }

  assertLinkUrl(url: string): ChipComponent {
    cy.get(this.locator + ' a').invoke('attr', 'href').should('eq', url)
    return this;
  }
}

class ButtonComponent {

  constructor(private locator: string) {
  }

  assertIsVisible(visible: boolean): void {
    cy.get(this.locator).should(visible ? 'exist' : 'not.exist')
  }

  click(): void {
    cy.get(this.locator).click()
  }
}

class LabelComponent {

  constructor(private locator: string) {
  }

  assertIsVisible(visible: boolean): LabelComponent {
    cy.get(this.locator).should(visible ? 'exist' : 'not.exist')
    return this
  }

  assertText(text: string): LabelComponent {
    cy.get(this.locator).should('have.text', text)
    return this
  }

  assertLinkUrl(url: string): LabelComponent {
    cy.get(this.locator + ' a').invoke('attr', 'href').should('eq', url)
    return this;
  }
}

class MapComponent {

  private static CY_LOCATOR = "[data-cy=divPoiMap]"

  mapMarker(): MapMarkerComponent {
    return new MapMarkerComponent()
  }

  assertIsVisible(visible: boolean) {
    cy.get(MapComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertSpinnerVisible(visible: boolean) {
    cy.get(MapComponent.CY_LOCATOR + ' ion-spinner').should(visible ? 'exist' : 'not.exist')
  }

  assertNumberOfGemetries(numberOfGemetries: number) {
      const number = numberOfGemetries + 3;  // TODO - don't care about the other 3 path at the moment  :-)
      cy.get(MapComponent.CY_LOCATOR).find('path').should('have.length', number)
  }

  assertGeometryColor(color: string) {
    cy.get(MapComponent.CY_LOCATOR).find('path.leaflet-interactive').should('have.attr', 'fill', color)
  }

  assertGeometryValues(values: RegExp) {
    cy.get(MapComponent.CY_LOCATOR).find('path').first().should("have.attr", 'd').and("match", values)
  }
}

class MapMarkerComponent {

  private static CY_LOCATOR = '[data-cy=divPoiMap] .leaflet-pane.leaflet-marker-pane'

  assertIsVisible(visible: boolean) {
    cy.get(MapMarkerComponent.CY_LOCATOR).should(visible ? 'exist' : 'not.exist')
  }

  assertNumberOfElements(numberOfMarkers: number) {
    cy.get(MapMarkerComponent.CY_LOCATOR).first().find('img').should('have.length', numberOfMarkers)
  }

  assertHasCssClass(cssClass: string) {
    cy.get(MapMarkerComponent.CY_LOCATOR).first().find('img').first().should('have.class', cssClass)
  }

  assertHasMarkerImage(imagePath: string) {
    cy.get(MapMarkerComponent.CY_LOCATOR).first().find('img').first().should('have.attr', 'src', imagePath)
  }

  assertHasCategoryImage(imagePath: string) {
    cy.get(MapMarkerComponent.CY_LOCATOR).last().find('img').last().should('have.attr', 'src', imagePath)
  }
}

export { PoiPage }
