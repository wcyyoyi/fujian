import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { EmailValidator, EqualPasswordsValidator } from '../../../../../theme/validators';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'basicInfo',
    templateUrl: './basicInfo.component.html',
    
})
export class BasicInfoComponent implements OnInit {

    btnClassLevel: string = 'yz-btn-level1';

    public currUser: User;
    public basicform: FormGroup;
    public username: AbstractControl;
    public name: AbstractControl;
    public email: AbstractControl;
    public phone: AbstractControl;
    public company: AbstractControl;

    public submitted: boolean = false;
    constructor(private yzNgxToastyService: YzNgxToastyService, fb: FormBuilder, private accoutServ: UserService) {
        this.basicform = fb.group({
            'username': [''],
            'name': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
            'phone': ['', Validators.compose([Validators.required, Validators.minLength(11)])],
            'company': ['']
        });

        this.username = this.basicform.controls['username'];
        this.name = this.basicform.controls['name'];
        this.email = this.basicform.controls['email'];
        this.phone = this.basicform.controls['phone'];
        this.company = this.basicform.controls['company'];

        let activeUser = JSON.parse(localStorage.getItem('activeUser'));
        this.currUser = new User();
        this.currUser.username = activeUser.name;

        this.accoutServ.getByName(activeUser.name).subscribe(
            quser => {
                this.currUser = quser;
            });
    }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
    }

    public onSubmit(values: Object): void {
        if (this.basicform.valid && this.currUser) {
            this.yzNgxToastyService.wait("正在保存信息请稍后", "");
            this.accoutServ.update(this.currUser).toPromise().then(newuser => {
                this.yzNgxToastyService.close();
                if (!newuser) return;
                this.yzNgxToastyService.success("信息保存成功", "", 3000);
            }).catch(e => {
                this.yzNgxToastyService.close();
                this.yzNgxToastyService.error("信息保存失败", "", 3000);
            })
        }
    }
}