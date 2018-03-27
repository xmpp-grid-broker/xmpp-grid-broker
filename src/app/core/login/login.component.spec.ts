import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';

const authenticationServiceStub: Partial<AuthenticationService> = {};



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [LoginComponent, RouterTestingModule],
      providers: [
        {provide: AuthenticationService, useValue: authenticationServiceStub},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });

  it('should login when the login button is pressed', () => {
    const btn = fixture.nativeElement.querySelector('button');
    //TODO: click button?!
    const router = TestBed.get(Router);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/topics']);
  });

  it('should contain an login message', () => {
    // const p = fixture.nativeElement.querySelector('p');
    // console.log(p);
    // expect(p.innerText).toContain('You are not yet logged in, please authenticate...');
    expect(de.query(By.css('p')).nativeElement.innerText).toBe('You are not yet logged in, please authenticate...');
  });
});
