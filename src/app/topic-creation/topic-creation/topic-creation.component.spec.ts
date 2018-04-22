import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {DebugElement} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


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

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: DebugElement;
  let topicCreationService;
  let fakeRoute;

  const waitUntilLoaded = () => {
    fixture.detectChanges();
    tick();
  };


  beforeEach(fakeAsync(() => {
      topicCreationService = new MockTopicCreationService();
      fakeRoute = new FakeActivatedRoute();
      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicCreationComponent],
        providers: [{provide: TopicCreationService, useValue: topicCreationService},
          {provide: NavigationService, useValue: jasmine.createSpyObj('NavigationService', ['goToHome'])},
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

    it('should show an error if it fails (409)', fakeAsync(() => {
      spyOn(topicCreationService, 'createTopic').and.callFake(() => {
        return Promise.reject({error: {code: '409'}});
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
      const errorDiv = de.nativeElement.querySelector('.toast-error');
      expect(component.error).toBe('A topic with the given identifier does already exist');
      expect(errorDiv.innerText).toBe('A topic with the given identifier does already exist');

    }));
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
