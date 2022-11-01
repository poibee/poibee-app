import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-discover-poi-detail-toolbar',
  templateUrl: './discover-poi-detail-toolbar.component.html',
  styleUrls: ['./discover-poi-detail-toolbar.component.scss'],
})
export class DiscoverPoiDetailToolbarComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit(): void {
    console.log("DiscoverPoiDetailToolbarComponent -> ngOnInit");
  }

  ngOnDestroy(): void {
    console.log("DiscoverPoiDetailToolbarComponent -> ngOnDestroy");
  }

}
