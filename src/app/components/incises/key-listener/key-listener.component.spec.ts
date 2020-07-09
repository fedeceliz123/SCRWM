import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyListenerComponent } from './key-listener.component';

describe('KeyListenerComponent', () => {
  let component: KeyListenerComponent;
  let fixture: ComponentFixture<KeyListenerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyListenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
