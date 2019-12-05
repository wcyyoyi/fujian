import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import 'style-loader!./timeSettings.scss';

@Component({
    selector: 'time-settings',
    templateUrl: './timeSettings.html',
    //styleUrls: ['./timeSettings.scss']
})

export class TimeSettings implements OnInit {
    bsConfig: Partial<BsDatepickerConfig>;
    startDate = new Date(2017, 7, 1);
    endDate = new Date();
    startHour: number = 0;
    endHour: number = 0;

    @Output()
    onSelected = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
        this.bsConfig = Object.assign({}, { locale: 'zh-cn' });
    }

    onChange(event) {
        this.startDate.setHours(this.startHour);
        this.endDate.setHours(this.endHour);

        let times: any = new Object();
        times.start = this.startDate;
        times.end = this.endDate;

        this.onSelected.emit(times);
    }
}