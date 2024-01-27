import * as L from 'leaflet';

export class PoimaniaLeafletControl extends L.Control {

  constructor(private title: string, private svgImage: string, private onClickButton: () => void, options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map) {
    const onClickButtonLocal = this.onClickButton;
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    container.innerHTML = '<a style="background-image: url(' + this.svgImage + '); background-size: 20px 20px;" href="#" title="' + this.title + '" role="button" aria-label="' + this.title + '"></a>';
    container.onclick = () => {
      onClickButtonLocal();
      return false;
    };
    return container;
  }

  onRemove(map: L.Map) {
    // Nothing to do here
  }
}
