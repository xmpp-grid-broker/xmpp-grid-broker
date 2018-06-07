import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {TopicOverviewComponent, TopicOverviewService} from '..';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {SharedModule} from '../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {Config, ConfigService, NavigationService, XmppService} from '../../core';
import {LeafTopic} from '../../core';

describe(TopicOverviewComponent.name, () => {

  let component: TopicOverviewComponent;
  let fixture: ComponentFixture<TopicOverviewComponent>;
  let de: HTMLElement;
  let mockTopicOverviewService: jasmine.SpyObj<TopicOverviewService>;
  let mockXmppService: jasmine.SpyObj<XmppService>;

  function setup(route: string) {
    mockTopicOverviewService = jasmine.createSpyObj('TopicOverviewService', ['rootTopics', 'allTopics', 'allCollections']);
    mockXmppService = jasmine.createSpyObj('XmppService', ['getServerTitle']);

    mockXmppService.getServerTitle.and.returnValue('xmpp.hsr.ch');

    const activatedRouteMock = {
      snapshot: {url: [{path: route}], data: {filter: route}}
    };
    const configService = jasmine.createSpyObj(ConfigService.name, ['getConfig']);
    configService.getConfig.and.returnValue(new Config(undefined, 10));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TopicWidgetsModule, SharedModule],
      declarations: [TopicOverviewComponent],
      providers: [
        {provide: NavigationService},
        {provide: TopicOverviewService, useValue: mockTopicOverviewService},
        {provide: XmppService, useValue: mockXmppService},
        {provide: ActivatedRoute, useValue: activatedRouteMock},
        {provide: ConfigService, useValue: configService},
      ]
    });

    fixture = TestBed.createComponent(TopicOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.nativeElement;
  }


  describe('given /topics/root as path ', () => {
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

  describe('given /topics/all as path', () => {
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

  describe('given /topics/collections as path', () => {
    beforeEach(() => {
      setup('collections');
      mockTopicOverviewService.allCollections.and.callFake(function* () {
      });
    });

    it('should call allCollections ', async(() => {
      fixture.detectChanges();

      expect(mockTopicOverviewService.allCollections.calls.count()).toBe(1);
    }));
  });

});
