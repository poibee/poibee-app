import {LatLon} from './lat-lon';

export enum DirectionTypes {

  n = 'north',
  ne = 'northeast',
  e = 'east',
  se = 'southeast',
  s = 'south',
  sw = 'southwest',
  w = 'west',
  nw = 'northwest',
}

export const directionToPoi = (myPosition: LatLon, poiPosition: LatLon): DirectionTypes => {
  const latitudeDifference = (myPosition.lat - poiPosition.lat) * 2;
  const longitudeDifference = myPosition.lon - poiPosition.lon;
  const quotient = Math.abs(latitudeDifference) > Math.abs(longitudeDifference) ? Math.abs(latitudeDifference) : Math.abs(longitudeDifference);
  const latitudeDifferenceNormalized = latitudeDifference / quotient;
  const longitudeDifferenceNormalized = longitudeDifference / quotient;
  const isWest = longitudeDifferenceNormalized > 0;
  const isNorth = latitudeDifferenceNormalized < 0;
  if (Math.abs(latitudeDifferenceNormalized) > Math.abs(longitudeDifferenceNormalized)) {
    if (Math.abs(longitudeDifferenceNormalized) < 0.5) {
      return isNorth ? DirectionTypes.n : DirectionTypes.s;
    } else {
      if (isNorth) {
        return isWest ? DirectionTypes.nw : DirectionTypes.ne;
      } else {
        return isWest ? DirectionTypes.sw : DirectionTypes.se;
      }
    }
  } else {
    if (Math.abs(latitudeDifferenceNormalized) < 0.5) {
      return isWest ? DirectionTypes.w : DirectionTypes.e;
    } else {
      if (isWest) {
        return isNorth ? DirectionTypes.nw : DirectionTypes.sw;
      } else {
        return isNorth ? DirectionTypes.ne : DirectionTypes.se;
      }
    }
  }
};
