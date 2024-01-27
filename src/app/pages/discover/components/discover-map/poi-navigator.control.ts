import {Map, Control, ControlOptions, DomUtil} from 'leaflet';
import {EventEmitter} from '@angular/core';

export class PoiNavigatorControl {

  private labelControl: PoiNavigatorLabelControl;

  constructor(discoverMap: Map, selectPreviousPoi: EventEmitter<void>, selectNextPoi: EventEmitter<void>, options?: ControlOptions) {
    new PoiNavigatorNextControl(selectNextPoi, options).addTo(discoverMap);
    this.labelControl = new PoiNavigatorLabelControl(options);
    this.labelControl.addTo(discoverMap);
    new PoiNavigatorPreviousControl(selectPreviousPoi, options).addTo(discoverMap);
  }

  updateLabel(label: string) {
    this.labelControl.updateLabel(label);;
  }
}

class PoiNavigatorLabelControl extends Control {

  private label: HTMLElement;

  constructor(options?: ControlOptions) {
    super(options);
  }

  onAdd(map: Map) {
    const container = DomUtil.create('div', 'leaflet-bar leaflet-control poiNavigatorLeafletControl noMarginRight');
    this.label = DomUtil.create('a', 'labelControl', container);
    this.label.setAttribute('data-cy', 'mapPoiNavigatorText');
    this.label.innerHTML = '0 / 0';
    return container;
  }

  updateLabel(label: string) {
    this.label.innerHTML = label;
  }
}

class PoiNavigatorPreviousControl extends Control {

  constructor(private onClickButton: EventEmitter<void>, options?: ControlOptions) {
    super(options);
  }

  onAdd(map: Map) {
    const onClickButtonLocal = this.onClickButton;
    const container = DomUtil.create('div', 'leaflet-bar leaflet-control poiNavigatorLeafletControl noMarginRight adjustMarginBottom');
    container.setAttribute('data-cy', 'buttonSelectPreviousPoi');
    container.innerHTML = '<a style="background-image: url(svg/play-skip-back-outline.svg); background-size: 20px 20px;" href="#" title="Previous POI" role="button" aria-label="Previous POI"></a>';
    container.onclick = () => {
      onClickButtonLocal.emit();
      return false;
    };
    return container;
  }
}

class PoiNavigatorNextControl extends Control {

  constructor(private onClickButton: EventEmitter<void>, options?: ControlOptions) {
    super(options);
  }

  onAdd(map: Map) {
    const onClickButtonLocal = this.onClickButton;
    const container = DomUtil.create('div', 'leaflet-bar leaflet-control poiNavigatorLeafletControl adjustMarginBottom');
    container.setAttribute('data-cy', 'buttonSelectNextPoi');
    container.innerHTML = '<a style="background-image: url(svg/play.svg); background-size: 20px 20px;" href="#" title="Next POI" role="button" aria-label="Next POI"></a>';
    container.onclick = () => {
      onClickButtonLocal.emit();
      return false;
    };
    return container;
  }
}
