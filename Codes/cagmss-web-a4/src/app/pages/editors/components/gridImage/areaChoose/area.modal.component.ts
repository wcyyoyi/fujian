import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AreaInfo } from '../../../../models';
import { ApiService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
@Component({
    selector: 'area-modal',
    templateUrl: 'area.modal.html',
    styleUrls: ['./area.modal.scss'],
    
})

export class AreaModal implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    public title: string = "区域选择";

    @Output()
    public onAreaChanged = new EventEmitter<AreaInfo>();

    private selArea: AreaInfo;

    constructor(public bsModalRef: BsModalRef,
        private yzNgxToastyService: YzNgxToastyService,
        private apiService: ApiService) {

    }

    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
    }

    selectArea(event) {
        this.selArea = event;
        document.getElementById('confirm')['disabled'] = false;
    }

    confirm() {
        if (this.selArea.vLevel < 2) {
            this.yzNgxToastyService.warning('请选择市或县级单位', "", 3000);
            return;
        }
        this.onAreaChanged.emit(this.selArea);
    }
}