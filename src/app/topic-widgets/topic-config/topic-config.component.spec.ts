import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicConfigComponent } from './topic-config.component';

describe('TopicConfigComponent', () => {
  let component: TopicConfigComponent;
  let fixture: ComponentFixture<TopicConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
