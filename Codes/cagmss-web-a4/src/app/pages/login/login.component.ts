import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../services/index';

import { DictionaryService } from '../utils/Dictionary.service';
import { UserConfig } from '../models/userConfig/userConfig';
import { UserService } from '../services';
import { Model } from '../models/userConfig/Model';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  errMsg: string = "";
  infoMsg: string = "";
  userConfig = new UserConfig();
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  private returnUrl: string;

  constructor(fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dictionaryService: DictionaryService,
    private alertService: AlertService,
    private userService: UserService) {
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

  public onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.login();
    }
  }

  login() {
    this.authenticationService.login(this.email.value, this.password.value)
      .then(token => {
        if (token) {
          this.errMsg = "";
          this.infoMsg = "正在跳转...";
          this.authenticationService.getUserConfig(this.email.value)
            .then((userConfig) => {
              if (userConfig) {
                let config: Map<string, string> = new Map<string, string>();
                let model = userConfig.models.find(value => { return value.code === 'dashboard'; });
                model.maps.forEach(map => {
                  config.set(map.key, map.value);
                });
                if (config.get('attention') == undefined || config.get('attention') == "{}") {
                  this.setAttention(userConfig);
                } else {
                  this.dictionaryService.init();
                  this.router.navigate([this.returnUrl]);
                }
              }
            });
        }
      }, error => {
        if (JSON.parse(error['_body'])['error'] === 'invalid_grant') {
          this.errMsg = '用户名或密码错误';
        }
        this.alertService.error(error);
      });
  }
  setAttention(_config) {
    this.userConfig = _config;
    let config: Map<string, string> = new Map<string, string>();
    let model = this.userConfig.models.find(value => { return value.code === 'dashboard'; });
    model.maps.forEach(map => {
      config.set(map.key, map.value);
    });
    let makeCompany = this.userConfig["area"]["pCode"];
    let attention = { "positions": [[17, -2]], "dataElementCode": "MONT", "dataType": "WCRM", "makeCompany": makeCompany, "productDate": "00000000" }
    config.set('attention', JSON.stringify(attention));
    model = new Model();
    config.forEach((value, key) => {
      model.maps.push({ key: key, value: value });
    });
    for (let index = 0; index < this.userConfig.models.length; index++) {
      if (this.userConfig.models[index].code === "dashboard") {
        this.userConfig.models[index].maps = model.maps;
      }
    }
    localStorage.setItem('activeUser', JSON.stringify(this.userConfig));
    this.userService.updateSetting(this.userConfig).toPromise().then(result => {
      this.dictionaryService.init();
      this.router.navigate([this.returnUrl]);
    })
  }
}
