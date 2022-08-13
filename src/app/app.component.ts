import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Ein Dank an ...',
      url: '/credit',
      icon: 'heart'
    },
    {
      title: 'Kontakt / Impressum',
      url: '/about',
      icon: 'information'
    }
  ];

  constructor() {
  }

}
