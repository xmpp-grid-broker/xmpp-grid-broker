import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootTopicsComponent } from './root-topics.component';

describe('RootTopicsComponent', () => {
  let component: RootTopicsComponent;
  let fixture: ComponentFixture<RootTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
