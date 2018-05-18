import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewTopicSubscriptionComponent} from './new-topic-subscription.component';

describe('NewTopicSubscriptionComponent', () => {
  let component: NewTopicSubscriptionComponent;
  let fixture: ComponentFixture<NewTopicSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewTopicSubscriptionComponent]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTopicSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

// TODO: WRITE TESTS
});
