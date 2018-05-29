import {TestBed} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing/src/component_fixture';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderComponent} from '..';


describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let de: HTMLElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    de = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    return {fixture, de};
  });

  it('should link to / on the title', () => {
    expect(de.querySelector('a').getAttribute('href')).toBe('/');
  });
});
