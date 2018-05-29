import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {NewPersistedItemComponent, PersistedItemsService} from '../..';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../core';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('NewPersistedItemComponent', () => {
  let component: NewPersistedItemComponent;
  let fixture: ComponentFixture<NewPersistedItemComponent>;
  let de: DebugElement;

  let persistedItemsService: jasmine.SpyObj<PersistedItemsService>;
  let navigationService: jasmine.SpyObj<NavigationService>;

  let textArea: HTMLTextAreaElement;
  let submitButton: HTMLButtonElement;


  beforeEach(async(() => {
    persistedItemsService = jasmine.createSpyObj('PersistedItemsService', ['publishItem']);
    navigationService = jasmine.createSpyObj('NavigationService', ['goToPersistedItems']);
    TestBed.configureTestingModule({
      declarations: [NewPersistedItemComponent],
      imports: [SharedModule, FormsModule],
      providers: [
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 'testing'}}}},
        {provide: PersistedItemsService, useValue: persistedItemsService},
        {provide: NavigationService, useValue: navigationService},
      ]


    });
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(NewPersistedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;

    // initialize
    fixture.detectChanges();
    tick();

    submitButton = de.query(By.css('[xgbActionButton]')).nativeElement;
    textArea = de.query(By.css('textarea')).nativeElement;
  }));

  it('should initialize properly', fakeAsync(() => {
    // No error message
    expect(de.query(By.css('[xgbToast]'))).toBeNull();
  }));

  it('should enable the submit button when a value is provided', fakeAsync(() => {
    // provide a value
    textArea.value = '<xml/>';
    textArea.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    tick();

    // Button should be enabled now
    expect(submitButton.hasAttribute('disabled')).toBe(false);

  }));

  it('should call the service on submit', fakeAsync(() => {
    persistedItemsService.publishItem.and.returnValue(Promise.resolve());

    // provide a value
    textArea.value = '<xml/>';
    textArea.dispatchEvent(new Event('input'));

    // Submit
    submitButton.click();

    fixture.detectChanges();
    tick();
    expect(persistedItemsService.publishItem).toHaveBeenCalledTimes(1);
    expect(persistedItemsService.publishItem).toHaveBeenCalledWith('testing', '<xml/>');

  }));

  it('should redirect when update is successful', fakeAsync(() => {
    persistedItemsService.publishItem.and.returnValue(Promise.resolve());

    // provide a value
    textArea.value = '<xml/>';
    textArea.dispatchEvent(new Event('input'));

    // Submit
    submitButton.click();

    fixture.detectChanges();
    tick();
    expect(navigationService.goToPersistedItems).toHaveBeenCalledTimes(1);

  }));

  [
    {error: {}, message: 'an unknown error occurred: {}!'},
    {error: {condition: 'forbidden'}, message: 'You have not sufficient privileges to publish to this node'},
    {error: {condition: 'feature-not-implemented'}, message: 'Node testing does not support item publication'},
    {error: {condition: 'not-acceptable'}, message: 'Payload is too big'},
    {error: {condition: 'bad-request'}, message: 'Bad Payload: The payload is not acceptable with the nodes configuration'},
    {error: {message: 'Incomplete document'}, message: 'The given message is not a valid XML document'},
  ].forEach(({error, message}) => {
      it(`should show an error message when update is unsuccessful (${message})`, fakeAsync(() => {
        persistedItemsService.publishItem.and.returnValue(Promise.reject(error));

        // provide a value
        textArea.value = '<xml/>';
        textArea.dispatchEvent(new Event('input'));

        // Submit
        submitButton.click();

        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(navigationService.goToPersistedItems).toHaveBeenCalledTimes(0);
        expect(de.query(By.css('[xgbToast]')).nativeElement.innerHTML).toBe(message);

      }));
    }
  );
});
