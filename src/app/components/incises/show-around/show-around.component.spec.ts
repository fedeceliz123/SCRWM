import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAroundComponent } from './show-around.component';

describe('ShowAroundComponent', () => {
  let component: ShowAroundComponent;
  let fixture: ComponentFixture<ShowAroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
