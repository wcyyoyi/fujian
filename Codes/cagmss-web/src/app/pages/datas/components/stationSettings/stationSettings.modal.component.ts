import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Station } from '../../../models';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'station-modal',
    templateUrl: 'stationSettings.modal.html'
})

export class StationSettingsModal implements OnInit {
    stations: Array<Station> = new Array<Station>();

    @Output()
    public onStaChanged = new EventEmitter<any>();

    @ViewChild('stationChoose') stationChoose;

    constructor(private bsModalRef: BsModalRef,
    ) { }

    ngOnInit() { }

    setStations(event: Array<Station>) {
        this.stations = event;
        let arr = new Array();
        this.stations.forEach(sta => {
            arr.push(sta.v01000);
        });
        let v01000 = arr.join(',');
        let selStationInfo = '共选择' + this.stations.length + '个站点';

        this.onStaChanged.emit({ v01000: v01000, selStationInfo: selStationInfo });
    }

    confirm(): void {
        this.stationChoose.confirm();
    }

}