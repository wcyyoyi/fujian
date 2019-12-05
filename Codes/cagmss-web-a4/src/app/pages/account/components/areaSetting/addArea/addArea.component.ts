import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { User } from '../../../../models';
import { AreaCod } from '../../../../models/code/AreaCod';
import { UserService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserAreaModal } from '../../../components/userSetting/addUser/areaChoose/area.modal.component';
import { AreaService } from '../../../../services';
import { from } from 'rxjs/observable/from';
import { AreaInfo } from '../../../../models';
@Component({
    selector: 'add-area',
    templateUrl: 'addArea.html',
    styleUrls: ['addArea.scss'],
    
})
export class AddAreaComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    modalRef: BsModalRef;

    public currUser: User = new User();

    public currArea: AreaCod = new AreaCod()

    public form: FormGroup;

    public cCode: AbstractControl;
    public cName: AbstractControl;
    public vLevel: AbstractControl;
    public v05001: AbstractControl;
    public v06001: AbstractControl;
    public cPCode: AbstractControl;
    public serviceUrl: AbstractControl;
    public mapUrl: AbstractControl;
    public levelList: Array<any>;
    public currentLevel: number;
    passType = 'password';

    constructor(private areaService: AreaService, fb: FormBuilder,
        private userService: UserService,
        private yzNgxToastyService: YzNgxToastyService,
        private modalService: BsModalService) {
        this.form = fb.group({
            'cCode': ['', Validators.compose([Validators.required])],
            'cName': ['', Validators.compose([Validators.required])],
            'vLevel': ['', Validators.compose([Validators.required])],
            'v05001': ['', Validators.compose([Validators.required])],
            'v06001': ['', Validators.compose([Validators.required])],
            'cPCode': ['', Validators.compose([Validators.required])],
            'serviceUrl': ['', Validators.compose([Validators.required])],
            'mapUrl': ['', Validators.compose([Validators.required])],
        });

        this.cCode = this.form.controls['cCode'];
        this.cName = this.form.controls['cName'];
        this.vLevel = this.form.controls['vLevel'];
        this.v05001 = this.form.controls['v05001'];
        this.v06001 = this.form.controls['v06001'];
        this.cPCode = this.form.controls['cPCode'];
        this.serviceUrl = this.form.controls['serviceUrl'];
        this.mapUrl = this.form.controls['mapUrl'];
    }

    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.currentLevel = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
        this.getAllLevels();
    }
    getAllLevels() {
        this.levelList = new Array();
        this.userService.getRoleLevel().subscribe(data => {
            if (!data) return;
            data.forEach(element => {
                element["value"] = element["value"] - 1;
                if (element["value"] > this.currentLevel) {
                    this.levelList.push(element);
                }
            });
            this.currArea.vLevel = this.levelList[0]["value"]
        })
    }
    public onSubmit(values: Object): void {
        if (this.form.valid) {
            let areaList = new Array();
            areaList = JSON.parse(localStorage.getItem("AREA"));
            let cCode = JSON.parse(localStorage.getItem("activeUser"))["area"]["code"];
            let area = areaList.find(item => item["cCode"] == cCode);
            let level = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
            if (level == 1) {
                if (String(values["cCode"]).substr(0, 2) != String(cCode).substr(0, 2)) {
                    this.yzNgxToastyService.error("区域代码必须为" + area["cName"] + "范围内的区域代码", "", 3000);
                    return;
                }
            } else if (level == 2) {
                if (String(values["cCode"]).substr(0, 4) != String(cCode).substr(0, 4)) {
                    this.yzNgxToastyService.error("区域代码必须为" + area["cName"] + "范围内的区域代码", "", 3000);
                    return;
                }
            }
            values["serviceUrl"] = "http://" + values["serviceUrl"] + ":8090/api";
            values["mapUrl"] = "http://" + values["mapUrl"] + ":81/styles/outdoors/style.json";
            this.createNewArea(values)
        }
    }
    createNewArea(values) {
        this.yzNgxToastyService.wait("正在添加区域请稍后", "");
        return this.areaService.createNewArea(values).toPromise().then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("添加区域失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.success("添加区域成功", "", 3000);
            this.setArea();
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("添加区域失败", "", 3000)
        })
    }
    setArea() {
        localStorage.removeItem('AREA');
        return this.areaService.getAll().toPromise().then((areaList: Array<AreaInfo>) => {
            localStorage.setItem('AREA', JSON.stringify(areaList));
        })
    }
    showAreaInfo(title: string): void {
        this.modalRef = this.modalService.show(UserAreaModal, { class: 'modal-lg' });
        this.modalRef.content.title = title;
        this.modalRef.content.onAreaChanged.subscribe(this.onAreaChange.bind(this));
    }

    onAreaChange(areaCode) {
        this.currUser.areaCode = areaCode;
        this.modalRef.content.bsModalRef.hide();
    }
}