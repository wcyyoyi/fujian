import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import 'style-loader!./timeSettings.scss';

@Component({
    selector: 'time-settings',
    templateUrl: './timeSettings.html',
    //styleUrls: ['./timeSettings.scss']
})

export class TimeSettings implements OnInit {
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });
    public minDate: Date;
    startDate = new Date(new Date().toLocaleDateString());
    endDate = new Date(new Date().toLocaleDateString());
    startHour: number = 0;
    endHour: number = 0;
    @Output()
    onSelected = new EventEmitter<any>();
    @Input() hourShow: boolean;
    @Input() tabName: string;
    public level:number;
    public now = new Date();
    constructor() { }

    ngOnInit() {
        this.startDate.setMonth(this.endDate.getMonth() - 1);
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        let dateArr = new Date().toLocaleDateString().split("/");
        this.minDate = new Date(Number(dateArr[0]) - 1 + "/" + dateArr[1] + "/" + dateArr[2]);
    }
    ngOnChanges() {
        this.timeSetting();
    }
    onChange(event) {
        this.timeSetting();
    }
    timeSetting() {
        this.startDate.setHours(this.startHour);
        this.endDate.setHours(this.endHour);
        let times: any = new Object();
        times.start = this.startDate;
        times.end = this.endDate;
        this.onSelected.emit(times);
    }
}