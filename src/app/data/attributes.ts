import {Cuisine} from './cuisine';

export class Attributes {

  constructor(
    public readonly cuisine: Cuisine,
    public readonly openingHours: string,
    public readonly vending: string,
    public readonly isBar: boolean,
    public readonly isCafe: boolean,
    public readonly isBuilding: boolean) {
  }

}
