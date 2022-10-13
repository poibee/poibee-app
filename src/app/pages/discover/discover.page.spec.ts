import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {DiscoverPage} from './discover.page';
import {of} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {LatLon} from "../../data/lat-lon";
import {Poi} from "../../data/poi";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DiscoverPageRoutingModule} from "./discover-routing.module";
import {DiscoverFilterToolbarComponent} from "./components/discover-filter-toolbar/discover-filter-toolbar.component";
import {DiscoverListComponent} from "./components/discover-list/discover-list.component";
import {DiscoverSearchModalComponent} from "./components/discover-search-modal/discover-search-modal.component";
import {DiscoverSearchToolbarComponent} from "./components/discover-search-toolbar/discover-search-toolbar.component";
import {MyPositionMapComponent} from "./components/my-position-map/my-position-map.component";
import {DiscoverPageModule} from "./discover.module";
import {AppModule} from "../../app.module";
import {PoiPage} from "../poi/poi.page";
import {ActivatedRoute, convertToParamMap} from "@angular/router";
import {INITIAL_SEARCH_ATTRIBUTES} from "../../data/search-attributes";

describe('DiscoverPage', () => {
  let component: DiscoverPage;
  let fixture: ComponentFixture<DiscoverPage>;

  beforeEach(waitForAsync(() => {

    const poisOverpassServiceMock = {
      searchPois: (position: LatLon, distance: number, category: string) => of([
        new Poi('myId', 'myName', ['myCategory'], new LatLon(1.1, 2.2), 1, null, null, null, {}, 1),
        new Poi('otherId', 'otherName', ['otherCategory'], null, 1, null, null, null, {}, 1)
      ])
    };
    spyOn(poisOverpassServiceMock, 'searchPois').and.callThrough();

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    component.executeSearch(INITIAL_SEARCH_ATTRIBUTES);

    expect(component.filteredPois.length).toBe(2);

    expect(component.filteredPois[0].id).toBe('myId');
    expect(component.filteredPois[0].name).toBe('myName');
    expect(component.filteredPois[0].categories).toEqual(['myCategory']);
    expect(component.filteredPois[0].coordinates).toEqual(new LatLon(1.1, 2.2));

    expect(component.filteredPois[1].id).toBe('otherId');
  });
});
