import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicsOrParentsComponent } from './subtopics-or-parents.component';

describe('SubtopicsOrParentsComponent', () => {
  let component: SubtopicsOrParentsComponent;
  let fixture: ComponentFixture<SubtopicsOrParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtopicsOrParentsComponent ]
    });
    // TODO: WRITE TEST
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicsOrParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
