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
import {LeafTopic} from '../../core/models/topic';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('TopicOverviewComponent', () => {

  let component: TopicOverviewComponent;
  let fixture: ComponentFixture<TopicOverviewComponent>;
  let de: HTMLElement;
  let mockTopicOverviewService: SpyObj<TopicOverviewService>;
  let mockXmppService: SpyObj<XmppService>;

  function setup(route: string) {
    mockTopicOverviewService = createSpyObj('TopicOverviewService', ['rootTopics', 'allTopics', 'allCollections']);
    mockXmppService = createSpyObj('XmppService', ['getServerTitle']);

    mockXmppService.getServerTitle.and.returnValue(Promise.resolve('xmpp.hsr.ch'));

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
      mockTopicOverviewService.rootTopics.and.callFake(function* () {
        yield new LeafTopic('a');
        yield new LeafTopic('b');
      });
    });

    it('should call to rootTopics', async(() => {
      fixture.detectChanges();
      expect(mockTopicOverviewService.rootTopics.calls.count()).toBe(1);
    }));

    it('should render topics when resolved', fakeAsync(() => {
      fixture.detectChanges();
      tick();
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
      mockTopicOverviewService.rootTopics.and.callFake(function* () {
      });
    });

    it('should call allTopics', async(() => {
      fixture.detectChanges();
      expect(mockTopicOverviewService.allTopics.calls.count()).toBe(1);
    }));
  });

  describe('given /topics/collections as path', function () {
    beforeEach(() => {
      setup('collections');
      mockTopicOverviewService.allCollections.and.callFake(function* () {
      });
    });

    it('should call allCollections ', async(() => {
      fixture.detectChanges();

      expect(mockTopicOverviewService.allCollections.calls.count()).toBe(1);
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
