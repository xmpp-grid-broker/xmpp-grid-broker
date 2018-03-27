// Straight Jasmine testing without Angular's testing support
import {AuthenticationService} from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  beforeEach(() => {
    service = new AuthenticationService();
  });

  it('#isAuthenticated should return boolean promise that evaluates to false',
    (done: DoneFn) => {
      service.isAuthenticated().then(value => {
        expect(value).toBe(false);
        done();
      });
    });

  it('after login, #isAuthenticated should return boolean promise that evaluates to true',
    (done: DoneFn) => {
      service.login();
      service.isAuthenticated().then(value => {
        expect(value).toBe(true);
        done();
      });
    });

  it('after login+logout, #isAuthenticated should return boolean promise that evaluates to false',
    (done: DoneFn) => {
      service.login();
      service.logout();
      service.isAuthenticated().then(value => {
        expect(value).toBe(false);
        done();
      });
    });

});
