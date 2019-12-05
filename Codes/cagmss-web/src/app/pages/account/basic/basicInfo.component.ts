import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { EmailValidator, EqualPasswordsValidator } from '../../../theme/validators';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'basicInfo',
    templateUrl: './basicInfo.component.html'
})
export class BasicInfoComponent {

    public currUser: User;
    public basicform: FormGroup;
    public username: AbstractControl;
    public name: AbstractControl;
    public email: AbstractControl;
    public phone: AbstractControl;
    public company: AbstractControl;

    public submitted: boolean = false;
    constructor(fb: FormBuilder, private accoutServ: UserService) {
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
        this.currUser.username = activeUser.username;

        this.accoutServ.getByName(activeUser.username).subscribe(
            quser => {
                this.currUser = quser;
            });
    }

    public onSubmit(values: Object): void {
        if (this.basicform.valid && this.currUser) {
            // your code goes here
            // console.log(values);

            this.accoutServ.update(this.currUser).subscribe(
                newuser => {
                    if (newuser) {
                        alert('信息保存成功！');
                    }
                });
        }
    }
}