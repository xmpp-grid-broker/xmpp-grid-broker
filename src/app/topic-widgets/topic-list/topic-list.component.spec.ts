import {async, TestBed} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {TopicList, TopicListComponent} from './topic-list.component';
import {SharedModule} from '../../shared/shared.module';
import {Observable} from 'rxjs/Observable';
import {Topic} from '../../core/models/topic';
import 'rxjs/add/observable/throw';
import {Subject} from 'rxjs/Subject';


function setup(): {
  component: TopicListComponent,
  fixture: ComponentFixture<TopicListComponent>,
  de: HTMLElement
} {

  TestBed.configureTestingModule({
    imports: [SharedModule],
    declarations: [TopicListComponent],
  });

  const fixture = TestBed.createComponent(TopicListComponent);
  const component = fixture.componentInstance;
  const de = fixture.debugElement.nativeElement;

  return {component, fixture, de};
}

describe('TopicListComponent', () => {

  it('should show loading spinner when uninitialized', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();

    fixture.detectChanges();

    expect(de.querySelector('.loading')).toBeTruthy();
    expect(de.querySelector('.loading').innerHTML).toBe('Loading...');
  }));

  it('should hide loading spinner when initialized', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();
    component.topicList.subscribe(Observable.of([]));


    fixture.detectChanges();

    expect(de.querySelector('.loading')).toBeFalsy();
  }));


  it('should show empty screen when no topics are present', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();
    component.topicList.subscribe(Observable.of([]));

    fixture.detectChanges();

    expect(de.querySelector('.empty')).toBeTruthy();
    expect(de.querySelector('.empty-title').innerHTML).toBe('No Topics found');
  }));

  it('should show error screen when failed to load topics', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();
    component.topicList.subscribe(Observable.throw(new Error('a problem')));

    fixture.detectChanges();

    expect(de.querySelector('.empty')).toBeTruthy();
    expect(de.querySelector('.empty-title').innerHTML).toBe('Oops, an error occurred!');
    expect(de.querySelector('.empty-subtitle').innerHTML).toBe('Error: a problem');
  }));

  it('should list topics when topics are provided', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();
    component.topicList.subscribe(Observable.of([new Topic('Topic #1'), new Topic('Topic #2')]));

    fixture.detectChanges();

    expect(de.querySelector('xgb-list')).toBeTruthy();
    expect(de.querySelector('xgb-list').childElementCount).toBe(2);
  }));

  it('should show topic name when topics are provided', async(() => {
    const {component, fixture, de} = setup();
    component.topicList = new TopicList();
    component.topicList.subscribe(Observable.of([new Topic('Topic #1'), new Topic('Topic #2')]));

    fixture.detectChanges();

    const topics = de.querySelectorAll('xgb-list > xgb-list-item');
    expect(topics[0].textContent).toBe('Topic #1');
    expect(topics[1].textContent).toBe('Topic #2');
  }));

  it('should not update after unsubscribe is called', async(() => {
    const {component, fixture, de} = setup();
    const subject = new Subject<Topic[]>();
    component.topicList = new TopicList();
    component.topicList.subscribe(subject);
    subject.next([new Topic('Topic #1'), new Topic('Topic #2')]);

    fixture.detectChanges();
    component.topicList.unsubscribe();
    subject.next([new Topic('Topic #3')]);
    fixture.detectChanges();

    expect(de.querySelector('xgb-list')).toBeTruthy();
    expect(de.querySelector('xgb-list').childElementCount).toBe(2);

  }));

});
