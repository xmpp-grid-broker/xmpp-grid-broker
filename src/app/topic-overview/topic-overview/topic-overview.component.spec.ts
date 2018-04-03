import {async, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {TopicService} from '../topic-service/topic.service';
import {TopicOverviewComponent} from './topic-overview.component';
import {TopicWidgetsModule} from '../../topic-widgets/topicWidgets.module';
import {SharedModule} from '../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

class MockTopicService {
  constructor(private _rootTopics = [],
              private _allTopics = [],
              private _allCollections = []) {
  }

  getServerTitle() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('xmpp.hsr.ch');
      }, 500);
    });
  }

  rootTopics() {
    return Observable.of(this._rootTopics);
  }

  allTopics() {
    return Observable.of(this._allTopics);
  }

  allCollections() {
    return Observable.of(this._allCollections);
  }
}


function setup(serviceMock, route): {
  component: TopicOverviewComponent,
  fixture: ComponentFixture<TopicOverviewComponent>,
  de: HTMLElement
} {

  const activatedRouteMock = {
    snapshot: {url: [{path: route}]}
  };
  TestBed.configureTestingModule({
    imports: [RouterTestingModule, TopicWidgetsModule, SharedModule],
    declarations: [TopicOverviewComponent],
    providers: [
      {provide: TopicService, useValue: serviceMock},
      {provide: ActivatedRoute, useValue: activatedRouteMock}
    ]
  });

  const fixture = TestBed.createComponent(TopicOverviewComponent);
  const component = fixture.componentInstance;
  const de = fixture.debugElement.nativeElement;

  return {component, fixture, de};
}

describe('TopicOverviewComponent', () => {

  it('should subscribe to rootTopics when navigating to /topics/root', async(() => {
    const mock = new MockTopicService();
    const routeSpy = spyOn(mock, 'rootTopics').and.callThrough();
    const {fixture} = setup(mock, 'root');

    fixture.detectChanges();

    expect(routeSpy.calls.count()).toBe(1);
  }));

  it('should subscribe to allTopics when navigating to /topics/all', async(() => {
    const mock = new MockTopicService();
    const routeSpy = spyOn(mock, 'allTopics').and.callThrough();
    const {fixture} = setup(mock, 'all');

    fixture.detectChanges();

    expect(routeSpy.calls.count()).toBe(1);
  }));

  it('should render subscribed topics', async(() => {
    const mock = new MockTopicService([{title: 'a'}, {title: 'b'}]);
    const {de, fixture} = setup(mock, 'root');

    fixture.detectChanges();

    expect(de.querySelectorAll('xgb-list-item').length).toBe(2);
  }));


  it('should subscribe to allCollections when navigating to /topics/collections', async(() => {
    const mock = new MockTopicService();
    const routeSpy = spyOn(mock, 'allCollections').and.callThrough();
    const {fixture} = setup(mock, 'collections');

    fixture.detectChanges();

    expect(routeSpy.calls.count()).toBe(1);
  }));

  it('should show loading title while the title is lazily loaded', async(() => {
    const {de, fixture} = setup(new MockTopicService(), 'collections');

    fixture.detectChanges();

    expect(de.querySelector('h2').innerText).toBe('loading...');
  }));

  it('should title after being loaded lazily', fakeAsync(() => {
    const {de, fixture} = setup(new MockTopicService(), 'collections');

    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(de.querySelector('h2').innerText).toBe('xmpp.hsr.ch');
  }));
});
