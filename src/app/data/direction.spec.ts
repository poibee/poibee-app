import {directionToPoi, DirectionTypes} from './direction';
import {LatLon} from './lat-lon';

describe('Direction', () => {

  const harpstedt = new LatLon(52.909, 8.58779);
  const kalletal = new LatLon(52.116667, 8.949722);
  const bremen = new LatLon(53.075878, 8.807311);
  const oldenburg = new LatLon(53.143889, 8.213889);
  const hamburg = new LatLon(53.550556, 9.993333);
  const rostock = new LatLon(54.083333, 12.133333);
  const kiel = new LatLon(54.32321, 10.14019);
  const berlin = new LatLon(52.5170365, 13.3888599);
  const cloppenburg = new LatLon(52.849082550000006, 8.05450945);
  const delmenhorst = new LatLon(53.0524925, 8.6295012);
  const vechta = new LatLon(52.7284701, 8.2855479);
  const hannover = new LatLon(52.3744779, 9.7385532);

  describe('for myPosition', () => {

    it('should be calculated for Harpstedt', () => {
      expect(directionToPoi(harpstedt, delmenhorst)).toBe(DirectionTypes.n);
      expect(directionToPoi(harpstedt, bremen)).toBe(DirectionTypes.ne);
      expect(directionToPoi(harpstedt, kiel)).toBe(DirectionTypes.ne);
      expect(directionToPoi(harpstedt, hamburg)).toBe(DirectionTypes.ne);
      expect(directionToPoi(harpstedt, rostock)).toBe(DirectionTypes.ne);
      expect(directionToPoi(harpstedt, berlin)).toBe(DirectionTypes.e);
      expect(directionToPoi(harpstedt, hannover)).toBe(DirectionTypes.se);
      expect(directionToPoi(harpstedt, kalletal)).toBe(DirectionTypes.s);
      expect(directionToPoi(harpstedt, vechta)).toBe(DirectionTypes.sw);
      expect(directionToPoi(harpstedt, cloppenburg)).toBe(DirectionTypes.w);
      expect(directionToPoi(harpstedt, oldenburg)).toBe(DirectionTypes.nw);
    });
  });
});
