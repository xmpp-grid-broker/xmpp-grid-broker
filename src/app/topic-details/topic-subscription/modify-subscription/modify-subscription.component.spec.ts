import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySubscriptionComponent } from './modify-subscription.component';

describe('ModifySubscriptionComponent', () => {
  let component: ModifySubscriptionComponent;
  let fixture: ComponentFixture<ModifySubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifySubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
