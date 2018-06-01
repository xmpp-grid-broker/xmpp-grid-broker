import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {TopicListComponent} from './topic-list.component';
import {IteratorListPager} from '../../shared';
import {SharedModule} from '../../shared/shared.module';
import {LeafTopic, Topic} from '../../core';


describe('TopicListComponent', () => {

  let component: TopicListComponent;
  let fixture: ComponentFixture<TopicListComponent>;
  let de: HTMLElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TopicListComponent],
    });

    fixture = TestBed.createComponent(TopicListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.nativeElement;
  }));

  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  };

  it('should show loading spinner when uninitialized', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();

    fixture.detectChanges();
    tick();

    expect(de.querySelector('.loading')).toBeTruthy();
    expect(de.querySelector('.loading').innerHTML).toBe('Loading...');
  }));

  it('should hide loading spinner when initialized', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();
    component.topicList.useIterator(async function* (): AsyncIterableIterator<Topic> {
    }());

    waitUntilLoaded();
    expect(de.querySelector('.loading')).toBeFalsy();
  }));


  it('should show empty screen when no topics are present', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();
    component.topicList.useIterator(async function* (): AsyncIterableIterator<Topic> {
    }());

    waitUntilLoaded();

    expect(de.querySelector('.empty')).toBeTruthy();
    expect(de.querySelector('.empty-title').innerHTML).toBe('No Topics found');
  }));

  it('should show error screen when failed to load topics', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();
    component.topicList.useIterator(async function* (): AsyncIterableIterator<Topic> {
      throw new Error('a problem');
    }());


    waitUntilLoaded();

    expect(de.querySelector('[toast-error]')).toBeTruthy();
    expect(de.querySelector('[toast-error]').innerHTML).toBe('An unknown error has occurred: a problem');
  }));

  it('should list topics when topics are provided', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();
    component.topicList.useIterator(async function* (): AsyncIterableIterator<Topic> {
      yield new LeafTopic('Topic #1');
      yield new LeafTopic('Topic #2');
    }());
    waitUntilLoaded();

    expect(de.querySelector('xgb-list')).toBeTruthy();
    expect(de.querySelector('xgb-list').childElementCount).toBe(2);
  }));

  it('should show topic name when topics are provided', fakeAsync(() => {
    component.topicList = new IteratorListPager<Topic>();
    component.topicList.useIterator(async function* (): AsyncIterableIterator<Topic> {
      yield new LeafTopic('Topic #1');
      yield new LeafTopic('Topic #2');
    }());

    waitUntilLoaded();

    const topics = de.querySelectorAll('xgb-list xgb-list-item .list-item-title');
    expect(topics[0].textContent).toBe('Topic #1');
    expect(topics[1].textContent).toBe('Topic #2');
  }));
});
