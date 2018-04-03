import {ErrorPageComponent} from './error-page.component';
import {async, TestBed} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs/Observable';

class MockActivatedRoute {
  data: Observable<{ errorCode: string }>;

  constructor(errorCode: string) {
    this.data = Observable.of({errorCode});
  }
}


function setup(activatedRouteMock): {
  component: ErrorPageComponent,
  fixture: ComponentFixture<ErrorPageComponent>,
  de: HTMLElement
} {

  TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [ErrorPageComponent],
    providers: [{provide: ActivatedRoute, useValue: activatedRouteMock}]
  });

  const fixture = TestBed.createComponent(ErrorPageComponent);
  const component = fixture.componentInstance;
  const de = fixture.debugElement.nativeElement;

  return {component, fixture, de};
}

describe('ErrorPageComponent', () => {

  it('should subscribe to router data on init', async(() => {
    const mock = new MockActivatedRoute('404');
    const routeSpy = spyOn(mock.data, 'subscribe').and.callThrough();
    const {component, fixture} = setup(mock);

    fixture.detectChanges();

    expect(routeSpy.calls.count()).toBe(1);
    expect(component.errorCode).toBe('404');
  }));

  it('should contain 404 message when error code is 404', () => {
    const mock = new MockActivatedRoute('404');
    const {fixture, de} = setup(mock);

    fixture.detectChanges();

    expect(de.querySelector('p').textContent).toBe('We can\'t seem to find the page you\'re looking for.');
    expect(de.querySelector('.error-code').textContent).toBe('Error Code: 404');
  });

  it('should contain generic message when error code is not 404', () => {
    const mock = new MockActivatedRoute('500');
    const {component, fixture, de} = setup(mock);

    fixture.detectChanges();

    expect(component.errorCode).toBe('500');
    expect(de.querySelector('p').textContent).toBe('Something didn\'t work out the way we planned!');
    expect(de.querySelector('.error-code').textContent).toBe('Error Code: 500');
  });


  it('should contain show a link to home', () => {
    const mock = new MockActivatedRoute('500');
    const {component, fixture, de} = setup(mock);

    fixture.detectChanges();

    expect(component.errorCode).toBe('500');
    expect(de.querySelectorAll('p').item(2).textContent).toBe('Go back to home');
    expect(de.querySelector('p > a').getAttribute('href')).toBe('/');
  });

});
