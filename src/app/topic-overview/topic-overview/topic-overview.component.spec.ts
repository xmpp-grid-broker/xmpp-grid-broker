import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {TopicOverviewService} from '../topic-overview-service/topic-overview.service';
import {TopicOverviewComponent} from './topic-overview.component';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {SharedModule} from '../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../core/navigation.service';
import {XmppService} from '../../core/xmpp/xmpp.service';

class MockXmppService {
  // Disabled because it is used via Mock
  // noinspection JSUnusedGlobalSymbols
  getServerTitle() {
    return Promise.resolve('xmpp.hsr.ch');
  }
}

class MockTopicOverviewService {
  constructor(private _rootTopics = [{title: 'a'}, {title: 'b'}],
              private _allTopics = [],
              private _allCollections = []) {
  }

  rootTopics() {
    return Promise.resolve(this._rootTopics);
  }

  allTopics() {
    return Promise.resolve(this._allTopics);
  }

  allCollections() {
    return Promise.resolve(this._allCollections);
  }
}

describe('TopicOverviewComponent', () => {

  let component: TopicOverviewComponent;
  let fixture: ComponentFixture<TopicOverviewComponent>;
  let de: HTMLElement;
  let mockTopicOverviewService: MockTopicOverviewService;
  let mockXmppService: MockXmppService;

  function setup(route: string) {
    mockTopicOverviewService = new MockTopicOverviewService();
    mockXmppService = new MockXmppService();

    const activatedRouteMock = {
      snapshot: {url: [{path: route}], data: {filter: route}}
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TopicWidgetsModule, SharedModule],
      declarations: [TopicOverviewComponent],
      providers: [
        {provide: NavigationService},
        {provide: TopicOverviewService, useValue: mockTopicOverviewService},
        {provide: XmppService, useValue: mockXmppService},
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

    it('should call to rootTopics', async(() => {
      const routeSpy = spyOn(mockTopicOverviewService, 'rootTopics').and.callThrough();
      fixture.detectChanges();
      expect(routeSpy.calls.count()).toBe(1);
    }));

    it('should render topics when resolved', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(de.querySelectorAll('xgb-list-item').length).toBe(2);
    }));

  });

  describe('given /topics/all as path', function () {
    beforeEach(() => {
      setup('all');
    });

    it('should call allTopics', async(() => {
      const routeSpy = spyOn(mockTopicOverviewService, 'allTopics').and.callThrough();
      fixture.detectChanges();
      expect(routeSpy.calls.count()).toBe(1);
    }));
  });

  describe('given /topics/collections as path', function () {
    beforeEach(() => {
      setup('collections');
    });

    it('should call allCollections ', async(() => {
      const routeSpy = spyOn(mockTopicOverviewService, 'allCollections').and.callThrough();

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
