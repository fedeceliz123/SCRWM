import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscrwmComponent } from './newscrwm.component';

describe('NewscrwmComponent', () => {
  let component: NewscrwmComponent;
  let fixture: ComponentFixture<NewscrwmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewscrwmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewscrwmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
