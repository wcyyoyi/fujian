import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { User } from '../../../../models';
import { UserService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserAreaModal } from './areaChoose/area.modal.component';
import { Utils } from '../../../../utils/utils';

@Component({
    selector: 'add-user',
    templateUrl: 'addUser.html',
    styleUrls: ['addUser.scss'],
    
})

export class AddUserComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    utils = new Utils();

    modalRef: BsModalRef;

    public currUser: User = new User();
    public level: number;

    public form: FormGroup;
    public username: AbstractControl;
    public password: AbstractControl;
    public cnname: AbstractControl;
    public email: AbstractControl;
    public mobilePhone: AbstractControl;
    public areaCode: AbstractControl;

    passType = 'password';

    constructor(fb: FormBuilder, private userService: UserService,
        private yzNgxToastyService: YzNgxToastyService,
        private modalService: BsModalService) {
        this.form = fb.group({
            'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'cnname': [''],
            'email': [''],
            'mobilePhone': ['', Validators.compose([Validators.minLength(11)])],
            'areaCode': ['', Validators.compose([Validators.required])],
        });

        this.username = this.form.controls['username'];
        this.password = this.form.controls['password'];
        this.cnname = this.form.controls['cnname'];
        this.email = this.form.controls['email'];
        this.mobilePhone = this.form.controls['mobilePhone'];
        this.areaCode = this.form.controls['areaCode'];

    }

    ngOnInit() {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + this.level;
    }

    public onSubmit(values: Object): void {
        if (this.form.valid) {
            let submitUser = new User();
            for (const user in this.currUser) {
                submitUser[user] = this.currUser[user];
            }
            submitUser.password = this.userService.encode(this.currUser.password);
            this.userService.create(submitUser).toPromise().then((data) => {
                this.yzNgxToastyService.success("用户创建成功", "", 1500);
            }).catch((err) => {
                if (err._body != undefined) {
                    let msg = JSON.parse(err._body)
                    this.yzNgxToastyService.error("用户创建失败", msg.message, 3000);
                }
            });
        }
    }

    showAreaInfo(title: string): void {
        this.modalRef = this.modalService.show(UserAreaModal, { class: 'modal-lg' });
        this.modalRef.content.title = title;
        this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
    }

    onAreaChange(area) {
        this.currUser.areaCode = area.cCode;
        this.currUser.cnname = area.cName + '用户';
        let s = '';
        area.cName.split('').forEach(str => {
            s += this.utils.toPinyin(str).split('')[0];
        })
        this.currUser.username = s + 'admin';
        this.modalRef.content.bsModalRef.hide();
    }
}