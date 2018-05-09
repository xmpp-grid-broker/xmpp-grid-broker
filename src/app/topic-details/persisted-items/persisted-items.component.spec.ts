import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistedItemsComponent } from './persisted-items.component';

describe('PersistedItemsComponent', () => {
  let component: PersistedItemsComponent;
  let fixture: ComponentFixture<PersistedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersistedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersistedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
