import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TopicAffiliationsComponent} from './topic-affiliations.component';
import {SharedModule} from '../../shared/shared.module';
import {TopicDetailsService} from '../topic-details.service';
import {DebugElement} from '@angular/core';
import {Affiliation, JidAffiliation} from '../../core/models/Affiliation';
import {By} from '@angular/platform-browser';

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
      const listItems = de.nativeElement.querySelectorAll('xgb-list-item');
      expect(listItems.length).toBe(2);
      expect(listItems[0].innerText).toBe('bard@shakespeare.lit');
      expect(listItems[1].innerText).toBe('hamlet@denmark.lit');

    }));


  });
  describe('given an error when loading the affiliations', () => {

    beforeEach(fakeAsync(() => {
      loadingProblem = {error: {}};
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
  });
});
