import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AreaInfo } from 'app/pages/models';
import { StationService } from 'app/pages/services';


@Component({
    selector: 'area-modal',
    templateUrl: 'area.modal.html',
    // styleUrls: ['./modals.scss'],
})

export class AreaModal implements OnInit {
    public title: string = "区域选择";

    btnClassLevel: string = 'yz-btn-level1';
    @Output()
    public onAreaChanged = new EventEmitter<AreaInfo>();

    private selArea: AreaInfo;

    constructor(public bsModalRef: BsModalRef, private stdServ: StationService) {

    }

    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = level == 0 ? 'yz-btn-level1' : 'yz-btn-level' + level; 'yz-btn-level' + level;
    }

    selectArea(event) {
        this.selArea = event;
    }

    confirm() {
        this.onAreaChanged.emit(this.selArea);
    }
}