import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import 'style-loader!./fieldSettings.scss';
import { LocalDataSource } from 'ng2-smart-table';
import { NgViewCell } from '../../interfaces/ng-view-cell';
import { DataState } from '../../datas/datas.state';
// import { Row } from 'ng2-smart-table/src/ng2-smart-table/lib/data-set/row';
// import { DataSet } from 'ng2-smart-table/src/ng2-smart-table/lib/data-set/data-set';

@Component({
    selector: 'checkbox-view',
    template: `
    <input type="checkbox" (click)="onClick($event)" [checked]="value" />
  `,
})

export class FieldCheckboxComponent implements NgViewCell, OnInit {

    @Input() value: string | number | boolean;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {

    }

    onClick(event) {
        this.value = !this.value;
        this.rowData['isChecked'] = this.value;
        this.save.emit(this.rowData);
    }
}

@Component({
    selector: 'field-settings',
    templateUrl: './fieldSettings.html',
    entryComponents: [FieldCheckboxComponent],
    styleUrls: ['./fieldSettings.scss']
})

export class FieldSettingsComponent implements AfterViewInit {
    @Input()
    fieldsOpt = [];
    @Input()
    optionsChecked = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];//选中项

    @Output()
    onSelected = new EventEmitter<any>();

    settings = {
        pager: {
            perPage: this.fieldsOpt.length
        },
        columns: {
            isChecked: {
                title: '选择',
                type: 'custom',
                filter: false,
                sort: false,
                renderComponent: FieldCheckboxComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.save.subscribe(rowData => {
                    });
                }
            },
            fieldName: {
                title: '字段名称',
            },
        },
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        noDataMessage: '没有数据'
        // hideSubHeader: false
    };
    source: LocalDataSource = new LocalDataSource();

    @ViewChild('table') table;
    constructor() {

    }

    ngAfterViewInit() {
    }

    initFieldTable(fieldList: Array<any>, fieldChecked?: Array<number>) {
        if (fieldChecked) {
            this.optionsChecked = fieldChecked;
        }

        let columns = fieldList['columns'];
        let newfieldList = [];

        for (let colName in columns) {
            let option = new Object();
            option['name'] = colName;
            option['value'] = columns[colName];
            option['checked'] = false;

            newfieldList.push(option);
        }

        this.fieldsOpt = newfieldList;
        let list = new Array();
        this.fieldsOpt.forEach((option, index) => {
            let isChecked = this.optionsChecked.indexOf(index) >= 0;
            list.push({ isChecked: isChecked, fieldName: option.value.title });
        });
        this.source.setPaging(1, list.length);
        // this.setting();
        this.source.load(list);
    }

    confirm() {
        let selFieldArr = new Array();
        let selFieldIndex = new Array();
        let datasoure = this.table.source.filteredAndSorted;
        datasoure.filter((field) => {
            return field.isChecked;
        }).forEach(selField => {
            this.fieldsOpt.forEach((item, index) => {
                if (selField.fieldName === item.value.title) {
                    selFieldArr.push(item);
                    selFieldIndex.push(index);
                }
            });
        });
        this.onSelected.emit({ selFieldArr, selFieldIndex });
    }
    

}