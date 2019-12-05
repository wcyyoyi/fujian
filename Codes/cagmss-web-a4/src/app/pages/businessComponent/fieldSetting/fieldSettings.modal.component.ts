import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'field-modal',
    templateUrl: 'fieldSettings.modal.html'
})

export class FieldSettingModalComponent {
    @Input()
    public fieldList: Array<any>;
    @Input()
    public fieldChecked: Array<number>;

    @Output()
    public onFieldChanged = new EventEmitter<any>();

    @ViewChild('fieldChoose') fieldChoose;

    constructor(public bsModalRef: BsModalRef,
    ) { }

    initFieldTable(fieldList: Array<any>, fieldChecked?: Array<number>) {
        this.fieldList = fieldList;
        this.fieldChecked = fieldChecked;
        this.fieldChoose.initFieldTable(this.fieldList, this.fieldChecked);
    }

    onCheckedFields(event) {
        this.onFieldChanged.emit(event);
    }

    confirm(): void {
        this.fieldChoose.confirm();
    }
}