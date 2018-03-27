import {AuthenticationService} from './authentication.service';
import {AuthenticationGuard} from './authentication-guard.service';
import {Router} from '@angular/router';


describe('AuthenticationGuardService', () => {
  let service: AuthenticationService;
  let guard: AuthenticationGuard;
  let router: Router;

  beforeEach(() => {
    service = new AuthenticationService();
    router = jasmine.createSpyObj('router', ['navigate']);
    guard = new AuthenticationGuard(service, router);
  });

  it('after login, #canActivate should return boolean promise that evaluates to true',
    (done: DoneFn) => {
      service.login();
      guard.canActivate().then(value => {
        expect(value).toBe(true);
        done();
      });
    });

  it('#canActivate should redirect to /login by default',
    (done: DoneFn) => {
      guard.canActivate().then(value => {
        expect(value).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

  it('after login+logout, #canActivate should redirect to /login',
    (done: DoneFn) => {
      service.login();
      service.logout();
      guard.canActivate().then(value => {
        expect(value).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
});
