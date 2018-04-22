import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TopicWidgetsModule} from '../../topic-widgets/topic-widgets.module';
import {TopicCreationComponent} from './topic-creation.component';
import {TopicCreationService} from '../topic-creation.service';
import {NavigationService} from '../../core/navigation.service';
import {DebugElement} from '@angular/core';


class MockTopicCreationService {
  createTopic(topicIdentifier: string): Promise<string> {
    return Promise.resolve(topicIdentifier);
  }
}

describe('TopicCreationComponent', () => {

  let component: TopicCreationComponent;
  let fixture: ComponentFixture<TopicCreationComponent>;
  let de: DebugElement;
  let topicCreationService;

  beforeEach(fakeAsync(() => {
      topicCreationService = new MockTopicCreationService();

      TestBed.configureTestingModule({
        imports: [SharedModule, FormsModule, ReactiveFormsModule, TopicWidgetsModule],
        declarations: [TopicCreationComponent],
        providers: [{provide: TopicCreationService, useValue: topicCreationService},
          {provide: NavigationService, useValue: jasmine.createSpyObj('NavigationService', ['goToHome'])}]
      });

      fixture = TestBed.createComponent(TopicCreationComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;

      fixture.detectChanges();
      tick();
    }
  ));

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
