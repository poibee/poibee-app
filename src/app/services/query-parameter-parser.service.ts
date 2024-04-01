import {Injectable} from '@angular/core';
import {ParamMap} from "@angular/router";
import {DiscoverPageQueryParameter} from "../data/discover-page-query-parameter";
import {LatLon} from "../data/lat-lon";

@Injectable({
  providedIn: 'root'
})
export class QueryParameterParserService {

  // https://poibee.de/discover?category=playground&position=52.908,8.588&distance=5000
  public queryParameters(paramMap: ParamMap): DiscoverPageQueryParameter {
    const distance: number = this.parseValue(() => Number.parseInt(paramMap.get('distance'), 10));
    const category: string = this.parseValue(() => paramMap.get('category'));
    const position: LatLon = this.parseValue(() => LatLon.ofPosition(paramMap.get('position')));
    return {position, category, distance};
  }

  private parseValue<Type>(parseFunction: () => Type): Type {
    try {
      const value: Type = parseFunction()
      if (value) {
        return value;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }
}
