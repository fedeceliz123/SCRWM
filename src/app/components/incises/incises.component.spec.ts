import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncisesComponent } from './incises.component';

describe('IncisesComponent', () => {
  let component: IncisesComponent;
  let fixture: ComponentFixture<IncisesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
