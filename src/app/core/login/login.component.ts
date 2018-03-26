import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
  }

  onLoginClicked() {
    this.authenticationService.login();
    this.router.navigate(['/topics']);
  }

}
