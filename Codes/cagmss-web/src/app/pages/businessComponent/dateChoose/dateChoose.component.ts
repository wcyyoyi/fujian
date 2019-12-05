import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'date-choose',
    templateUrl: 'dateChoose.html'
})

export class DateChooseComponent implements OnInit {
    @Input()
    initDate: Date;
    @Input()
    minDate: Date;
    @Input()
    maxDate: Date;


    @Output()
    onChange = new EventEmitter<any>();

    date;
    month;
    day;
    months = new Array();
    constructor() { }

    ngOnInit() {
        this.init();
    }

    init() {
        for (let index = 1; index < 13; index++) {
            this.months.push(index);
        }
        let date;
        if (this.initDate) {
            date = this.initDate;
        } else {
            date = new Date();
        }
        this.month = this.months[date.getMonth()];
        this.day = date.getDate();
    }

    changeMonthByWheel(event) {
        let value = 0;
        let level = 15;
        if (event.wheelDelta > level) {
            value = Number(event.target.value) + 1;
        } else if (event.wheelDelta < -level) {
            value = Number(event.target.value) - 1;
        } else {
            value = Number(event.target.value);
        }
        this.setMonth(value);
    }

    changeMonthByClick(index) {
        this.setMonth(Number(this.month) + index);
    }

    changeMonthByInput(event) {
        this.setMonth(event.target.value);
    }

    setMonth(value) {
        if (value > 12) {
            this.month = 12;
        } else if (value < 1) {
            this.month = 1;
        } else {
            this.month = value;
        }
        this.setDate();
    }

    changeDayByWheel(event) {
        let value = 0;
        let level = 15;

        if (event.wheelDelta > level) {
            value = Number(event.target.value) + 1;
        } else if (event.wheelDelta < -level) {
            value = Number(event.target.value) - 1;
        } else {
            value = Number(event.target.value);
        }
        this.setDay(value);
    }

    changeDayByClick(index) {
        this.setDay(Number(this.day) + index);
    }

    changeDayByInput(event) {
        this.setDay(event.target.value);
    }

    setDay(value) {
        let date = new Date(new Date().getFullYear(), this.month, 0);

        if (value > date.getDate()) {
            this.day = date.getDate();
        } else if (value < 1) {
            this.day = 1;
        } else {
            this.day = value;
        }
        this.setDate();
    }

    setDate() {
        this.date = new Date(new Date().getFullYear(), this.month - 1, this.day);
        if (this.date > this.maxDate) {
            this.date = this.maxDate;
            this.day = this.maxDate.getDate();
            this.month = this.maxDate.getMonth() + 1;
        }
        if (this.date < this.minDate) {
            this.date = this.minDate;
            this.day = this.minDate.getDate();
            this.month = this.minDate.getMonth() + 1;
        }
        this.onChange.emit(this.date);
    }
}
