import {async, TestBed} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderComponent} from './header.component';

function setup(): {
  fixture: ComponentFixture<HeaderComponent>,
  de: HTMLElement
} {

  TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [HeaderComponent]
  });

  const fixture = TestBed.createComponent(HeaderComponent);
  const de = fixture.debugElement.nativeElement;

  return {fixture, de};
}

describe('HeaderComponent', () => {

  it('should link to / on the title', async(() => {
    const {fixture, de} = setup();

    fixture.detectChanges();

    expect(de.querySelector('a').getAttribute('href')).toBe('/');
  }));

});
