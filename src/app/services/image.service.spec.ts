import {TestBed} from '@angular/core/testing';

import {ImageService} from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    const actualMarkerIcon = service.loadMarkerIcon();

    expect(actualMarkerIcon).toBeTruthy();
    expect(actualMarkerIcon.options).toBeTruthy();
    expect(actualMarkerIcon.options.iconUrl).toBe('assets/marker/marker-icon.png');
    expect(actualMarkerIcon.options.shadowUrl).toBe('assets/marker/marker-shadow.png');
  });
});
