import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CurrentTopicDetailService, SubtopicsOrParentsComponent, SubtopicsOrParentsService} from '..';
import {ActivatedRoute} from '@angular/router';
import {CollectionTopic, Topic} from '../../core';
import {NavigationService} from '../../core';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {IteratorListPager} from '../../shared';
import createSpyObj = jasmine.createSpyObj;


describe(SubtopicsOrParentsComponent.name, () => {
  let component: SubtopicsOrParentsComponent;
  let fixture: ComponentFixture<SubtopicsOrParentsComponent>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let service: jasmine.SpyObj<SubtopicsOrParentsService>;
  let detailsService: jasmine.SpyObj<CurrentTopicDetailService>;
  let iterator: IteratorListPager<Topic>;

  beforeEach(fakeAsync(() => {
    const route = {
      snapshot: {
        data: {subtopics: false}
      }
    };

    navigationService = createSpyObj(NavigationService.name, ['goToTopic']);
    service = createSpyObj(SubtopicsOrParentsService.name, ['subtopics', 'parents']);
    detailsService = createSpyObj(CurrentTopicDetailService.name, ['currentTopic']);

    TestBed.configureTestingModule({
      imports: [TopicWidgetsModule],
      declarations: [SubtopicsOrParentsComponent],
      providers: [
        {provide: ActivatedRoute, useValue: route},
        {provide: NavigationService, useValue: navigationService},
        {provide: SubtopicsOrParentsService, useValue: service},
        {provide: CurrentTopicDetailService, useValue: detailsService}
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicsOrParentsComponent);
    component = fixture.componentInstance;
    iterator = component.iterator;
  });

  it('should use subtopics service method for subtopics', fakeAsync(() => {
    const iteratorSpy = spyOn(iterator, 'useIterator').and.callThrough();
    detailsService.currentTopic.and.returnValue(new CollectionTopic('testing'));

    fixture.detectChanges();
    tick();

    expect(iteratorSpy).toHaveBeenCalledTimes(1);
    expect(service.subtopics).toHaveBeenCalledTimes(0);
    expect(service.parents).toHaveBeenCalledTimes(1);
    expect(service.parents).toHaveBeenCalledWith('testing');
  }));

  it('should use parents service method for parent collections', fakeAsync(() => {
    TestBed.get(ActivatedRoute).snapshot.data.subtopics = true;
    const iteratorSpy = spyOn(iterator, 'useIterator').and.callThrough();
    detailsService.currentTopic.and.returnValue(new CollectionTopic('testing'));


    fixture.detectChanges();
    tick();

    expect(iteratorSpy).toHaveBeenCalledTimes(1);
    expect(service.subtopics).toHaveBeenCalledTimes(1);
    expect(service.subtopics).toHaveBeenCalledWith('testing');
    expect(service.parents).toHaveBeenCalledTimes(0);
  }));

  it('should redirect when topic is clicked', fakeAsync(() => {
    const iteratorSpy = spyOn(iterator, 'useIterator').and.callThrough();
    detailsService.currentTopic.and.returnValue(new CollectionTopic('testing'));
    service.parents.and.callFake(async function* () {
      yield new CollectionTopic('coll1');
      yield new CollectionTopic('coll2');
    });

    // Wait until loaded
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();

    // Click on the first element
    const listItem = fixture.debugElement.nativeElement.querySelectorAll('xgb-list-item')[1];
    listItem.click();

    // Wait until processed
    fixture.detectChanges();
    tick();

    expect(navigationService.goToTopic).toHaveBeenCalledTimes(1);
    expect(navigationService.goToTopic).toHaveBeenCalledWith(new CollectionTopic('coll2'));

  }));
});