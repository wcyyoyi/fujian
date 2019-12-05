import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AreaInfo, Station } from '../../../models';
import { StationService } from '../../../services';

import { AreaChoose } from '../../../businessComponent/areaChoose/areaChoose.component';

@Component({
    selector: 'area-modal',
    templateUrl: 'area.modal.html',
    // styleUrls: ['./modals.scss'],
})

export class AreaModal implements OnInit {
    public title: string = "区域选择";

    @Output()
    public onAreaChanged = new EventEmitter<AreaInfo>();

    private selArea: AreaInfo;
    private statList: Station[]; // 存放区域选择后区域内的站点

    constructor(public bsModalRef: BsModalRef, private stdServ: StationService) {

    }

    ngOnInit() {
        //this.selArea = new AreaInfo(){};
        // this.stdServ.getAll().subscribe(statList => {
        //     this.statList = statList;
        // });
    }

    selectArea(event) {
        this.selArea = event;
    }

    setStations() {
        // 根据所选区域过滤站点
        this.stdServ.getIdsByArea(this.selArea.cCode, this.selArea.vLevel).then(statIds => {
            this.selArea.stationIds = statIds;

            if (this.onAreaChanged) {
                this.onAreaChanged.emit(this.selArea);
            }
        });
    }
}