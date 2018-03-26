import {Injectable} from '@angular/core';

/**
 * This service is used for user authentication and to check if
 * the user is currently logged in.
 * It is also used by routing guards to redirect unauthorized users.
 *
 * As for now, this is a simple mock implementation until the actual XMPP implementation is ready.
 */
@Injectable()
export class AuthenticationService {
  /**
   * Flag to indicate if the user is currently logged in.
   */
  loggedIn = false;

  /**
   * Checks if the user is authenticated (delayed).
   * @returns {Promise<boolean>}
   */
  isAuthenticated(): Promise<boolean> {
    return new Promise(
      (resolve) => {
        setTimeout(() => {
          resolve(this.loggedIn);
        }, 800);
      }
    );
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}

