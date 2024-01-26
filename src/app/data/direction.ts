import {LatLon} from './lat-lon';

export enum DirectionTypes {

  N = 'north',
  NE = 'northeast',
  E = 'east',
  SE = 'southeast',
  S = 'south',
  SW = 'southwest',
  W = 'west',
  NW = 'northwest',
}

export function directionToPoi(myPosition: LatLon, poiPosition: LatLon): DirectionTypes {
  const latitudeDifference = (myPosition.lat - poiPosition.lat) * 2;
  const longitudeDifference = myPosition.lon - poiPosition.lon;
  const quotient = Math.abs(latitudeDifference) > Math.abs(longitudeDifference) ? Math.abs(latitudeDifference) : Math.abs(longitudeDifference);
  const latitudeDifferenceNormalized = latitudeDifference / quotient;
  const longitudeDifferenceNormalized = longitudeDifference / quotient;
  const isWest = longitudeDifferenceNormalized > 0;
  const isNorth = latitudeDifferenceNormalized < 0;
  if (Math.abs(latitudeDifferenceNormalized) > Math.abs(longitudeDifferenceNormalized)) {
    if (Math.abs(longitudeDifferenceNormalized) < 0.5) {
      return isNorth ? DirectionTypes.N : DirectionTypes.S;
    } else {
      if (isNorth) {
        return isWest ? DirectionTypes.NW : DirectionTypes.NE;
      } else {
        return isWest ? DirectionTypes.SW : DirectionTypes.SE;
      }
    }
  } else {
    if (Math.abs(latitudeDifferenceNormalized) < 0.5) {
      return isWest ? DirectionTypes.W : DirectionTypes.E;
    } else {
      if (isWest) {
        return isNorth ? DirectionTypes.NW : DirectionTypes.SW;
      } else {
        return isNorth ? DirectionTypes.NE : DirectionTypes.SE;
      }
    }
  }
}
