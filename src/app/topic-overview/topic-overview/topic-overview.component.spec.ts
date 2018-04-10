import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {TopicService} from '../topic-service/topic.service';
import {TopicOverviewComponent} from './topic-overview.component';
import {TopicWidgetsModule} from '../../topic-widgets/topicWidgets.module';
import {SharedModule} from '../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NavigationService} from '../../core/navigation.service';

class MockTopicService {
  constructor(private _rootTopics = [{title: 'a'}, {title: 'b'}],
              private _allTopics = [],
              private _allCollections = []) {
  }

  // Disabled because it is used via Mock
  // noinspection JSUnusedGlobalSymbols
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

describe('TopicOverviewComponent', () => {

  let component: TopicOverviewComponent;
  let fixture: ComponentFixture<TopicOverviewComponent>;
  let de: HTMLElement;
  let mock: MockTopicService;

  function setup(route: string) {
    mock = new MockTopicService();

    const activatedRouteMock = {
      snapshot: {url: [{path: route}], data: {filter: route}}
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TopicWidgetsModule, SharedModule],
      declarations: [TopicOverviewComponent],
      providers: [
        {provide: NavigationService},
        {provide: TopicService, useValue: mock},
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    });

    fixture = TestBed.createComponent(TopicOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.nativeElement;
  }


  describe('given /topics/root as path ', function () {
    beforeEach(() => {
      setup('root');
    });

    it('should subscribe to rootTopics', async(() => {
      const routeSpy = spyOn(mock, 'rootTopics').and.callThrough();
      fixture.detectChanges();
      expect(routeSpy.calls.count()).toBe(1);
    }));

    it('should render subscribed topics', async(() => {
      fixture.detectChanges();

      expect(de.querySelectorAll('xgb-list-item').length).toBe(2);
    }));

  });

  describe('given /topics/all as path', function () {
    beforeEach(() => {
      setup('all');
    });

    it('should subscribe to allTopics', async(() => {
      const routeSpy = spyOn(mock, 'allTopics').and.callThrough();
      fixture.detectChanges();
      expect(routeSpy.calls.count()).toBe(1);
    }));
  });

  describe('given /topics/collections as path', function () {
    beforeEach(() => {
      setup('collections');
    });

    it('should subscribe to allCollections ', async(() => {
      const routeSpy = spyOn(mock, 'allCollections').and.callThrough();

      fixture.detectChanges();

      expect(routeSpy.calls.count()).toBe(1);
    }));

    it('should render "loading title" while the title is lazily loaded', async(() => {
      fixture.detectChanges();

      expect(de.querySelector('h2').innerText).toBe('loading...');
    }));

    it('should render the loaded title after it is lazily loaded ', fakeAsync(() => {

      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      expect(de.querySelector('h2').innerText).toBe('xmpp.hsr.ch');
    }));
  });

});
