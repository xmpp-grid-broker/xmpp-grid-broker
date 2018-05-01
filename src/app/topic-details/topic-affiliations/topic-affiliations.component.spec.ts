import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TopicAffiliationsComponent} from './topic-affiliations.component';
import {SharedModule} from '../../shared/shared.module';
import {AffiliationManagementErrorCodes, TopicDetailsService} from '../topic-details.service';
import {DebugElement} from '@angular/core';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {XmppService} from '../../core/xmpp/xmpp.service';

describe('TopicAffiliationsComponent', () => {
  let component: TopicAffiliationsComponent;
  let fixture: ComponentFixture<TopicAffiliationsComponent>;
  let de: DebugElement;

  let mockService;
  let loadJidAffiliationsResult: Promise<JidAffiliation[]>;
  let modifyJidAffiliationResult: Promise<void>;
  let isJidCurrentUserResult: Promise<boolean>;

  const setup = () => {
    mockService = jasmine.createSpyObj('TopicDetailsService', {
      'loadJidAffiliations': loadJidAffiliationsResult,
      'modifyJidAffiliation': modifyJidAffiliationResult
    });
    const mockXmppService = jasmine.createSpyObj('XmppService', {
      'isJidCurrentUser': isJidCurrentUserResult
    });
    TestBed.configureTestingModule({
      imports: [SharedModule, FormsModule],
      declarations: [TopicAffiliationsComponent],
      providers: [
        {provide: TopicDetailsService, useValue: mockService},
        {provide: XmppService, useValue: mockXmppService},
        {provide: ActivatedRoute, useValue: {parent: {snapshot: {params: {id: 'testing'}}}}}
      ]
    });

    fixture = TestBed.createComponent(TopicAffiliationsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    tick();
  };

  beforeEach(fakeAsync(() => {
    loadJidAffiliationsResult = undefined;
    modifyJidAffiliationResult = undefined;
    isJidCurrentUserResult = Promise.resolve(false);
  }));

  describe('given some existing affiliations', () => {

    beforeEach(fakeAsync(() => {
      loadJidAffiliationsResult = Promise.resolve([
        new JidAffiliation('bard@shakespeare.lit', Affiliation.Publisher),
        new JidAffiliation('hamlet@denmark.lit', Affiliation.Owner)
      ]);
      modifyJidAffiliationResult = Promise.resolve();
      setup();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the spinner until fully loaded', fakeAsync(() => {
      const spinner = de.nativeElement.querySelector('.loading');
      expect(spinner).toBeTruthy();
    }));

    it('should hide the spinner when fully loaded', fakeAsync(() => {
      // Spinner is currently present...
      fixture.detectChanges();
      tick();

      const spinner = de.nativeElement.querySelector('.loading');
      expect(spinner).toBeFalsy();
      expect(component.isLoaded).toBeTruthy();
      expect(component.errorMessage).toBeFalsy();
    }));

    it('should render all loaded jids', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // The list is now loaded
      const listItems = de.nativeElement.querySelectorAll('.jid-affiliation .jid');
      expect(listItems.length).toBe(2);
      expect(listItems[0].innerText).toBe('bard@shakespeare.lit');
      expect(listItems[1].innerText).toBe('hamlet@denmark.lit');

    }));

    it('should render a select box for each jid', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const select = de.nativeElement.querySelectorAll('.jid-affiliation .actions select');
      expect(select.length).toBe(2);
      expect(select[0].children.length).toBe(5);
      expect(select[0].children.length).toBe(5);

    }));

    it('should render a remove button for each jid', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const removeButton = de.nativeElement.querySelectorAll('.jid-affiliation .actions button');
      expect(removeButton.length).toBe(2);
      expect(removeButton[0].innerText).toBe('remove');
      expect(removeButton[0].innerText).toBe('remove');

    }));

    it('should render the input fields for a new affiliation', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const inputField = de.nativeElement.querySelector('.new-jid .jid input');
      const addButton = de.nativeElement.querySelector('.new-jid .actions button');
      expect(addButton.innerText).toBe('add');
      expect(inputField.innerText).toBeDefined();
    }));

    describe('when adding a new jid', () => {
      let inputField;
      let addButton;
      let selectBox;

      beforeEach(fakeAsync(() => {
        // Get rid of the spinner
        fixture.detectChanges();
        tick();

        // Trigger validation
        fixture.detectChanges();
        tick();

        inputField = de.nativeElement.querySelector('.new-jid .jid input');
        addButton = de.nativeElement.querySelector('.new-jid .actions button');
        selectBox = de.nativeElement.querySelector('.new-jid .actions select');
      }));

      it('should disable the add button when no jid is provided', fakeAsync(() => {
        expect(addButton.getAttribute('disabled')).toBe('');
      }));

      it('should enable the add button when a valid jid and affiliation is provided', fakeAsync(() => {
        inputField.value = 'foo@baa.lit';
        inputField.dispatchEvent(new Event('input'));

        selectBox.selectedIndex = 2;
        selectBox.dispatchEvent(new Event('change'));

        // Trigger validation
        fixture.detectChanges();
        tick();

        expect(addButton.getAttribute('disabled')).toBe(null);
      }));

      it('should disable the add button & show error when a adding a duplicate jid', fakeAsync(() => {
        // Set input
        inputField.value = 'hamlet@denmark.lit';
        inputField.dispatchEvent(new Event('input'));

        // Select affiliation
        selectBox.selectedIndex = 2;
        selectBox.dispatchEvent(new Event('change'));

        // Trigger validation
        fixture.detectChanges();
        tick();

        const hintBox = de.nativeElement.querySelector('.new-jid .jid p');
        expect(addButton.getAttribute('disabled')).toBe('');
        expect(hintBox.innerText).toBe('Duplicates are not allowed');
      }));

      it('should show a spinner when adding a new value', fakeAsync(() => {
        // Set input
        inputField.value = 'foo@baa.lit';
        inputField.dispatchEvent(new Event('input'));

        // Select affiliation
        selectBox.selectedIndex = 2;
        selectBox.dispatchEvent(new Event('change'));

        // Validate
        fixture.detectChanges();
        tick();

        // Click add button
        addButton.click();
        fixture.detectChanges();
        tick();

        // Expect the spinner
        let spinner = de.nativeElement.querySelector('.loading');
        expect(spinner).toBeTruthy();

        // result is here
        fixture.detectChanges();
        tick();

        // Expect spinner to be gone
        spinner = de.nativeElement.querySelector('.loading');
        expect(spinner).toBeFalsy();

      }));

    });
  });
  describe('given the user hamlet and changing the affiliation of hamlet', () => {

    beforeEach(fakeAsync(() => {
      loadJidAffiliationsResult = Promise.resolve([
        new JidAffiliation('hamlet@denmark.lit', Affiliation.Owner)
      ]);
    }));

    it('shoudl display a confirm dialog and call the service if confirmed', fakeAsync(() => {
      // Setup spies and responses
      isJidCurrentUserResult = Promise.resolve(true);
      modifyJidAffiliationResult = Promise.resolve();
      setup();
      const confirm = spyOn(window, 'confirm').and.returnValue(true);

      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // Change the value of the select box
      const selectBox = de.nativeElement.querySelectorAll('.jid-affiliation .actions select')[0];
      selectBox.value = Affiliation.Member;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(mockService.modifyJidAffiliation).toHaveBeenCalledTimes(1);
      const args = mockService.modifyJidAffiliation.calls.mostRecent().args;
      expect(args[0]).toBe('testing');
      expect(args[1].affiliation).toBe(Affiliation.Member);
      expect(args[1].jid).toBe('hamlet@denmark.lit');
    }));

    it('shoudl display a confirm dialog and cancel if aborted', fakeAsync(() => {
      // Setup spies and responses
      isJidCurrentUserResult = Promise.resolve(true);
      modifyJidAffiliationResult = Promise.resolve();
      setup();
      const confirm = spyOn(window, 'confirm').and.returnValue(false);

      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // Change the value of the select box
      const selectBox = de.nativeElement.querySelectorAll('.jid-affiliation .actions select')[0];
      selectBox.value = Affiliation.Member;
      selectBox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      tick();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(mockService.modifyJidAffiliation).toHaveBeenCalledTimes(0);
    }));


  });

  describe('given the user hamlet and removing hamlet', () => {

    beforeEach(fakeAsync(() => {
      loadJidAffiliationsResult = Promise.resolve([
        new JidAffiliation('hamlet@denmark.lit', Affiliation.Owner)
      ]);
    }));

    it('should display a confirm dialog and call the service if confirmed', fakeAsync(() => {
      // Setup spies and responses
      isJidCurrentUserResult = Promise.resolve(true);
      modifyJidAffiliationResult = Promise.resolve();
      setup();
      const confirm = spyOn(window, 'confirm').and.returnValue(true);

      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // Click the remove butotn
      const removeButton = de.nativeElement.querySelectorAll('.jid-affiliation .actions button')[0];
      removeButton.click();
      fixture.detectChanges();
      tick();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(mockService.modifyJidAffiliation).toHaveBeenCalledTimes(1);
      const args = mockService.modifyJidAffiliation.calls.mostRecent().args;
      expect(args[0]).toBe('testing');
      expect(args[1].affiliation).toBe(Affiliation.None);
      expect(args[1].jid).toBe('hamlet@denmark.lit');
    }));

    it('should display a confirm dialog and cancel if aborted', fakeAsync(() => {
      // Setup spies and responses
      isJidCurrentUserResult = Promise.resolve(true);
      modifyJidAffiliationResult = Promise.resolve();
      setup();
      const confirm = spyOn(window, 'confirm').and.returnValue(false);

      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // Click the remove butotn
      const removeButton = de.nativeElement.querySelectorAll('.jid-affiliation .actions button')[0];
      removeButton.click();
      fixture.detectChanges();
      tick();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(mockService.modifyJidAffiliation).toHaveBeenCalledTimes(0);
    }));


  });

  describe('given an empty list of affiliations', () => {

    beforeEach(fakeAsync(() => {
      loadJidAffiliationsResult = Promise.resolve([]);
      setup();
    }));

    it('should render "No Affiliations found"', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const emptyTitle = de.nativeElement.querySelector('.empty-title');
      expect(emptyTitle.innerText).toBe('No Affiliations found');
    }));

  });
  describe('given an error when loading the affiliations', () => {

    it('should hide the spinner whe the error is received', fakeAsync(() => {
      loadJidAffiliationsResult = Promise.reject({condition: AffiliationManagementErrorCodes.Forbidden});
      setup();

      // Spinner is currently present...
      fixture.detectChanges();
      tick();

      const spinner = de.nativeElement.querySelector('.loading');
      expect(spinner).toBeFalsy();
      expect(component.isLoaded).toBeTruthy();
      expect(component.errorMessage).toBeTruthy();
    }));
    [
      {condition: AffiliationManagementErrorCodes.ItemNotFound, message: 'Node testing does not exist'},
      {condition: AffiliationManagementErrorCodes.Unsupported, message: 'Node or service does not support affiliation management'},
      {
        condition: AffiliationManagementErrorCodes.Forbidden,
        message: 'You are not allowed to modify the affiliations because you are not owner'
      },
    ].forEach(({condition, message}) => {
      it('should render an error box whe the error is received', fakeAsync(() => {

        loadJidAffiliationsResult = Promise.reject({condition});
        setup();

        // Spinner is currently present...
        fixture.detectChanges();
        tick();

        const errorBoxMessage = de.nativeElement.querySelector('.toast-error');
        expect(errorBoxMessage.innerText).toBe(message);
      }));
    });
  });
});
