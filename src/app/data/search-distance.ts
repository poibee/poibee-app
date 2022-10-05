export class Distance {
  constructor(public km: number, public zoomLevel: number) {
  }

  asMeter() {
    return this.km * 1000;
  }

  asString() {
    return this.km.toString().replace('.', ',') + ' km';
  }
}

export class SearchDistance {
  static ALL = [
    new Distance(0.1, 17),
    new Distance(0.25, 16),
    new Distance(0.5, 15),
    new Distance(1, 14),
    new Distance(2.5, 13),
    new Distance(5, 12),
    new Distance(10, 10),
    new Distance(25, 9),
    new Distance(50, 8),
    new Distance(100, 7),
    new Distance(250, 6)
  ];

  static kmAsZoomLevel(km: number): number {
    const distance: Distance = SearchDistance.ALL.find(d => d.km === km / 1000);
    return distance.zoomLevel;
  }
}


