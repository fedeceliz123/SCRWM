import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAroundComponent } from './edit-around.component';

describe('EditAroundComponent', () => {
  let component: EditAroundComponent;
  let fixture: ComponentFixture<EditAroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
