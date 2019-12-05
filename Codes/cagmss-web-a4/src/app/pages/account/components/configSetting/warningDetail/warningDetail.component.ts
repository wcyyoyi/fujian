import { Component, Input, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Warning } from '../../../../models/warning';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { WarningService } from '../../../../services/warning.service';
@Component({
    selector: 'warning-detail',
    templateUrl: 'warningDetail.html',
    styleUrls: ['warningDetail.scss'],
    
})
export class WarningDetailComponent {
    public successChanged = new EventEmitter<any>();  //添加与更新操作完成之后执行
    btnClassLevel: string = 'yz-btn-level1';
    public warning = new Warning();   //预警
    public levelList: Array<number>;      //等级列表
    //书签表单验证
    public form: FormGroup;
    public vAlertLevel: AbstractControl;
    public cDesc: AbstractControl;
    constructor(fb: FormBuilder, public bsModalRef: BsModalRef,
        private yzNgxToastyService: YzNgxToastyService, private warningService: WarningService) {
        this.form = fb.group({
            'vAlertLevel': ['', Validators.compose([Validators.required])],
            'cDesc': ['', Validators.compose([Validators.required])],
        });
        this.vAlertLevel = this.form.controls['vAlertLevel'];
        this.cDesc = this.form.controls['cDesc'];
    }
    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.levelList = new Array();
        for (let i = 0; i < 6; i++) {
            this.levelList.push(i);
        }
    }
    initStationDto(obj) {
        for (let key in obj) {
            this.warning[key] = obj[key];
        }
    }
    //提交
    public onSubmit(values: Object): void {
        if (!this.form.valid) return;
        this.updateWarning();
    }
    //选择预警等级发生改变
    onLevelChange(level) {
        this.warning.vAlertLevel = level;
    }
    updateWarning() {
        this.warningService.updateWarning(this.warning).toPromise().then(data => {
            if (!data) {
                this.yzNgxToastyService.error("修改预警信息失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.success("修改预警信息成功", "", 3000);
            this.bsModalRef.hide();
            this.successChanged.emit(true);
        }).catch(() => {
            this.yzNgxToastyService.error("修改预警信息失败", "", 3000);
        })
    }
}