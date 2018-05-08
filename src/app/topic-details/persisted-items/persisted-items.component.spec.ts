import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PersistedItemsComponent} from './persisted-items.component';
import {ActivatedRoute} from '@angular/router';
import {PersistedItemsService} from '../persisted-items.service';

describe('PersistedItemsComponent', () => {
  let component: PersistedItemsComponent;
  let fixture: ComponentFixture<PersistedItemsComponent>;
  let service: jasmine.SpyObj<PersistedItemsService>;

  beforeEach(async(() => {
    service = jasmine.createSpyObj('PersistedItemsService', ['persistedItems']);
    TestBed.configureTestingModule({
      declarations: [PersistedItemsComponent],
      providers: [{provide: ActivatedRoute, useValue: {parent: {snapshot: {params: {id: 'testing'}}}}},
        {provide: PersistedItemsService, useValue: service}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersistedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
