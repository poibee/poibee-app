import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
/*
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
*/
  // TODO #105 during migration - necessary ?

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have menu labels', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(3);
    expect(menuItems[0].textContent).toContain('Entdecken');
    expect(menuItems[1].textContent).toContain('Ein Dank an ...');
    expect(menuItems[2].textContent).toContain('Kontakt / Impressum');
  }));

  it('should have urls', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(3);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/discover');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/credit');
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/about');
  }));

});
