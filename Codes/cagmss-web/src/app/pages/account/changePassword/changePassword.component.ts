import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from '../../../theme/validators';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
    selector: 'change-password',
    templateUrl: 'changePassword.html'
})

export class ChangePassComponent implements OnInit {

    public currUser: User;
    public form: FormGroup;
    public oldpassword: AbstractControl;
    public newpassword: AbstractControl;
    public repassword: AbstractControl;
    public passwords: FormGroup;

    public submitted: boolean = false;
    constructor(fb: FormBuilder, private accoutServ: UserService) {
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

        let activeUser = JSON.parse(localStorage.getItem('activeUser'));
        this.currUser = new User();
        this.currUser.username = activeUser.username;

        this.accoutServ.getByName(activeUser.username).subscribe(
            quser => {
                this.currUser = quser;
            });
    }

    ngOnInit() { }

    public onSubmit(values: Object): void {
        if (this.form.valid && this.currUser) {
            let pass = {
                oldpass: values['oldpassword'],
                newpass: values['passwords']['newpassword']
            };
            this.accoutServ.changePass(this.currUser.id, pass).subscribe(
                map => {
                    let msg = '';
                    if (!map.result) {
                        msg = '失败：';
                    }
                    alert(msg + map.message);
                });
        }
    }
}
