import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationErrors, TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {DebugElement} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {ToastDirective} from '../../shared/toast.directive';


class MockTopicCreationService {
  createTopic(topicIdentifier: string): Promise<string> {
    return Promise.resolve(topicIdentifier);
  }
}

class FakeActivatedRoute {

  type = undefined;

  // noinspection JSUnusedGlobalSymbols
  get snapshot() {
    return {data: {type: this.type}};
  }
}

class FakeNavigationService {
  goToTopic() {}
}

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: DebugElement;
  let topicCreationService;
  let fakeRoute;
  let navigationService;

  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
  };


  beforeEach(fakeAsync(() => {
      topicCreationService = new MockTopicCreationService();
      fakeRoute = new FakeActivatedRoute();
      navigationService = new FakeNavigationService();

      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicCreationComponent],
        providers: [{provide: TopicCreationService, useValue: topicCreationService},
          {provide: NavigationService, useValue: navigationService},
          {provide: ActivatedRoute, useValue: fakeRoute}]
      });

      fixture = TestBed.createComponent(TopicCreationComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

    }
  ));
  describe('when creating a new collection', () => {

    beforeEach(fakeAsync(() => {
      fakeRoute.type = 'collection';
      waitUntilLoaded();
    }));

    it('should render "Create New Collection" as title', () => {
      const heading = de.nativeElement.querySelector('h2');
      expect(heading.innerText).toBe('Create New Collection');
    });

    it('should call the service if the form is filled out', fakeAsync(() => {
      spyOn(topicCreationService, 'createTopic').and.callThrough();

      // Fill in node id
      const inputField = de.nativeElement.querySelector('#nodeID');
      inputField.value = 'myNewTopic';
      inputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      // Click submit
      const submit = de.nativeElement.querySelector('button[type=submit]');
      submit.click();
      fixture.detectChanges();
      tick();

      expect(topicCreationService.createTopic).toHaveBeenCalledTimes(1);
      const args = topicCreationService.createTopic.calls.first().args;
      expect(args.length).toBe(1);
      expect(args[0]).toBe('myNewTopic');
    }));

    it('should redirect when creation was successful', fakeAsync(() => {
      spyOn(navigationService, 'goToTopic').and.callThrough();

      // Fill in node id
      const inputField = de.nativeElement.querySelector('#nodeID');
      inputField.value = 'myNewTopic';
      inputField.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      component.submit();

      tick();
      tick();
      tick();

      expect(component.error).toBeFalsy();
      expect(navigationService.goToTopic).toHaveBeenCalledTimes(1);
      const args = navigationService.goToTopic.calls.first().args;
      expect(args.length).toBe(1);
      expect(args[0]).toBe('myNewTopic');
    }));

    [
      {condition: TopicCreationErrors.FeatureNotImplemented, message: 'Service does not support node creation'},
      {condition: TopicCreationErrors.RegistrationRequired, message: 'Service requires registration'},
      {condition: TopicCreationErrors.Forbidden, message: 'Requesting entity is prohibited from creating nodes'},
      {condition: TopicCreationErrors.Conflict, message: 'A topic with the given identifier does already exist'},
      {condition: TopicCreationErrors.NodeIdRequired, message: 'Service does not support instant nodes'},
      {condition: '?!?!', message: 'Failed to create new topic: (unknown: ?!?!)'}
    ].forEach((testParams) => {
      it(`should show an error if it fails (${testParams.condition})`, fakeAsync(() => {
        spyOn(topicCreationService, 'createTopic').and.callFake(() => {
          return Promise.reject({condition: testParams.condition, type: 'unknown'});
        });
        // Fill in node id
        const inputField = de.nativeElement.querySelector('#nodeID');
        inputField.value = 'myNewTopic';
        inputField.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        tick();

        // Click submit
        const submit = de.nativeElement.querySelector('button[type=submit]');
        submit.click();
        fixture.detectChanges();
        tick();

        // Ensure the service has been called
        expect(topicCreationService.createTopic).toHaveBeenCalledTimes(1);

        fixture.detectChanges();
        tick();
        const errorDiv = de.query(By.directive(ToastDirective)).nativeElement;
        expect(component.error).toBe(testParams.message);
        expect(errorDiv.innerText).toBe(testParams.message);

      }));
    });

  });
  describe('when creating a new collection', () => {

    beforeEach(fakeAsync(() => {
      fakeRoute.type = 'leaf';
      waitUntilLoaded();
    }));

    it('should render "Create New Topic" as title', () => {
      const heading = de.nativeElement.querySelector('h2');
      expect(heading.innerText).toBe('Create New Topic');
    });

  });

});
