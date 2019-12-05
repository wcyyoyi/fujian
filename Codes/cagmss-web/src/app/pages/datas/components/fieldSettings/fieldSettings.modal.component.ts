import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
    selector: 'field-modal',
    templateUrl: 'fieldSettings.modal.html'
})

export class FieldSettingModal implements OnInit {
    fields;
    @Output()
    public onFieldChanged = new EventEmitter<any>();

    @ViewChild('fieldChoose') fieldChoose;

    constructor(public bsModalRef: BsModalRef,
    ) { }

    ngOnInit() {

    }

    onCheckedFields(event) {
        this.fields = event;
        let selFieldInfo = '共选择' + this.fields.length + '个字段';
        this.onFieldChanged.emit({ fields: this.fields, selFieldInfo: selFieldInfo });
    }

    confirm(): void {
        this.fieldChoose.confirm();
    }
}