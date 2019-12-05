import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../services/index';

// import 'style-loader!./login.scss';
import { AreaService } from '../services/area.service';
import { UserConfig } from '../models/userConfig/userConfig';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  errMsg;

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  private returnUrl: string;

  constructor(fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pages';
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.login();
    }
  }

  login() {
    this.authenticationService.login(this.email.value, this.password.value)
      .then(token => {
        if (token) {
          this.authenticationService.getUserConfig(this.email.value)
            .then((config) => {
              if (config) this.router.navigate([this.returnUrl]);
            });
        }
      }, error => {
        if (JSON.parse(error['_body'])['error'] === 'invalid_grant') {
          this.errMsg = '用户名或密码错误';
        }
        this.alertService.error(error);
      });
  }
}
