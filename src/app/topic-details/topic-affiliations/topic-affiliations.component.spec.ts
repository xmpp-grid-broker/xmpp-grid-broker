import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAffiliationsComponent } from './topic-affiliations.component';

describe('TopicAffiliationsComponent', () => {
  let component: TopicAffiliationsComponent;
  let fixture: ComponentFixture<TopicAffiliationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicAffiliationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicAffiliationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
