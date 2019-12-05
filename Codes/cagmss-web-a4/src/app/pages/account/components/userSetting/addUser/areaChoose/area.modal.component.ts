import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AreaInfo } from '../../../../../models';
import { ApiService } from '../../../../../services';

@Component({
    selector: 'area-modal',
    templateUrl: 'area.modal.html',
    styleUrls: ['./area.modal.scss'],
})

export class UserAreaModal implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';

    public title: string = "区域选择";


    @Output()
    public onAreaChanged = new EventEmitter<AreaInfo>();

    private selArea: AreaInfo;

    constructor(public bsModalRef: BsModalRef,
        private apiService:ApiService) {

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
        this.onAreaChanged.emit(this.selArea);
    }
}