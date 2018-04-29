import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TopicAffiliationsComponent} from './topic-affiliations.component';
import {SharedModule} from '../../shared/shared.module';
import {TopicDetailsService} from '../topic-details.service';
import {DebugElement} from '@angular/core';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';

describe('TopicAffiliationsComponent', () => {
  let component: TopicAffiliationsComponent;
  let fixture: ComponentFixture<TopicAffiliationsComponent>;
  let de: DebugElement;

  let mockService: TopicDetailsService;
  let loadedAffiliations: JidAffiliation[];
  let loadingProblem: {};

  const setup = () => {
    mockService = jasmine.createSpyObj('TopicDetailsService', {
      'loadJidAffiliations': new Promise((resolve, reject) => {
        if (loadingProblem) {
          reject(loadingProblem);
        } else {
          resolve(loadedAffiliations);
        }
      })
    });
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TopicAffiliationsComponent],
      providers: [{provide: TopicDetailsService, useValue: mockService}]
    });

    fixture = TestBed.createComponent(TopicAffiliationsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    tick();
  };

  beforeEach(fakeAsync(() => {
    loadingProblem = undefined;
    loadedAffiliations = [];
  }));

  describe('given some existing affiliations', () => {

    beforeEach(fakeAsync(() => {
      loadedAffiliations = [
        new JidAffiliation('bard@shakespeare.lit', Affiliation.Publisher),
        new JidAffiliation('hamlet@denmark.lit', Affiliation.None)
      ];
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
      expect(component.hasError).toBeFalsy();
    }));

    it('should render all loaded jids', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      // The list is now loaded
      const listItems = de.nativeElement.querySelectorAll('.jid');
      expect(listItems.length).toBe(2);
      expect(listItems[0].innerText).toBe('bard@shakespeare.lit');
      expect(listItems[1].innerText).toBe('hamlet@denmark.lit');

    }));

    it('should render a select box for each jid', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const select = de.nativeElement.querySelectorAll('.actions select');
      expect(select.length).toBe(2);
      expect(select[0].children.length).toBe(6);
      expect(select[0].children.length).toBe(6);

    }));

    it('should render a remove button for each jid', fakeAsync(() => {
      // Get rid of the spinner
      fixture.detectChanges();
      tick();

      const removeButton = de.nativeElement.querySelectorAll('.actions button');
      expect(removeButton.length).toBe(2);
      expect(removeButton[0].innerText).toBe('remove');
      expect(removeButton[0].innerText).toBe('remove');

    }));

  });
  describe('given an empty list of affiliations', () => {

    beforeEach(fakeAsync(() => {
      loadedAffiliations = [];
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

    beforeEach(fakeAsync(() => {
      loadingProblem = {condition: 'bad-request'};
      setup();
    }));

    it('should hide the spinner whe the error is received', fakeAsync(() => {
      // Spinner is currently present...
      fixture.detectChanges();
      tick();

      const spinner = de.nativeElement.querySelector('.loading');
      expect(spinner).toBeFalsy();
      expect(component.isLoaded).toBeTruthy();
      expect(component.hasError).toBeTruthy();
    }));

    it('should render an error box whe the error is received', fakeAsync(() => {
      // Spinner is currently present...
      fixture.detectChanges();
      tick();

      const errorBoxTitle = de.nativeElement.querySelector('.empty-title');
      expect(errorBoxTitle.innerText).toBe('Oops, an error occurred!');
      const errorBoxMessage = de.nativeElement.querySelector('.empty-subtitle');
      expect(errorBoxMessage.innerText).toBe('TODO: Better Message');
    }));

  });
});
