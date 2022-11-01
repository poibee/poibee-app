import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoverPoiDetailToolbarComponent } from './discover-poi-detail-toolbar.component';

describe('DiscoverPoiDetailToolbarComponent', () => {
  let component: DiscoverPoiDetailToolbarComponent;
  let fixture: ComponentFixture<DiscoverPoiDetailToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverPoiDetailToolbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPoiDetailToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
