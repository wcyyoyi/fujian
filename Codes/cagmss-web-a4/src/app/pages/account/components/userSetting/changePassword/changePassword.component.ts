import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from '../../../../../theme/validators';
import { User } from '../../../../models';
import { UserService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

@Component({
    selector: 'change-password',
    templateUrl: 'changePassword.html',
})

export class ChangePassComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    public currUser: User;
    public form: FormGroup;
    public oldpassword: AbstractControl;
    public newpassword: AbstractControl;
    public repassword: AbstractControl;
    public passwords: FormGroup;

    public newPassword:string;
    public rePassword:string;
    public submitted: boolean = false;
    constructor(fb: FormBuilder, private accoutServ: UserService, private yzNgxToastyService: YzNgxToastyService) {
        this.form = fb.group({
            'oldpassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'passwords': fb.group({
                'newpassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                'repassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
            }, { validator: EqualPasswordsValidator.validate('newpassword', 'repassword') })
        });

        this.passwords = <FormGroup>this.form.controls['passwords'];
        this.oldpassword = this.form.controls['oldpassword'];
        this.newpassword = this.passwords.controls['newpassword'];
        this.repassword = this.passwords.controls['repassword'];


    }

    ngOnInit() {
        this.newPassword="";
        this.rePassword="";
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = level == 0 ? 'yz-btn-level1' : 'yz-btn-level' + level; 'yz-btn-level' + level;
        this.currUser = new User();
        this.currUser.username = this.accoutServ.userName;

        this.accoutServ.getByName(this.currUser.username).subscribe(
            quser => {
                this.currUser = quser;
            });
    }

    public onSubmit(values: Object): void {
        if (this.form.valid && this.currUser) {
            let pass = {
                oldpass: this.accoutServ.encode(values['oldpassword']),
                newpass: this.accoutServ.encode(values['passwords']['newpassword'])
            };
            this.accoutServ.changePass(this.currUser.id, pass).toPromise().then(result => {
                if (result) {
                    this.yzNgxToastyService.success("密码修改成功", "", 1500);
                } else {
                    this.yzNgxToastyService.error("密码修改失败", "未知错误", 1500);

                }
            }).catch(err => {
                if (err._body != undefined) {
                    let msg = JSON.parse(err._body)
                    this.yzNgxToastyService.error("密码修改失败", msg.message, 3000);
                }
            });
        }
    }
}
