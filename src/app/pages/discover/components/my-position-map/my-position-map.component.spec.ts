import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyPositionMapComponent } from './discover-map.component';

describe('DiscoverMapComponent', () => {
  let component: MyPositionMapComponent;
  let fixture: ComponentFixture<MyPositionMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPositionMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPositionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
