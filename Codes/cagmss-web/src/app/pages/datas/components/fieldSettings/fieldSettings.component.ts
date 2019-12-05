import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'style-loader!./fieldSettings.scss';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FieldSettingService } from './fieldSettings.service';
import { DataState } from '../../datas.state';
import { Row } from 'ng2-smart-table/src/ng2-smart-table/lib/data-set/row';
import { DataSet } from 'ng2-smart-table/src/ng2-smart-table/lib/data-set/data-set';

@Component({
    selector: 'checkbox-view',
    template: `
    <input type="checkbox" (click)="onClick($event)" [checked]="value" />
  `,
})

export class FieldCheckboxComponent implements ViewCell, OnInit {

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

export class FieldSettings implements AfterViewInit {
    @Input()
    // options: Subject<any[]>;
    fieldsOpt = [];
    optionsChecked = [];

    @Output()
    onSelected = new EventEmitter<any>();

    settings;
    source: LocalDataSource = new LocalDataSource();

    @ViewChild('table') table;

    constructor(private fieldSettingServ: FieldSettingService, private state: DataState) {

    }

    ngAfterViewInit() {
        this.fieldSettingServ.currentPoint().subscribe(tabName => {
            let columns = this.state[tabName].columns;
            let fieldList = [];

            for (let colName in columns) {
                let option = new Object();
                option['name'] = colName;
                option['value'] = columns[colName];
                option['checked'] = false;

                fieldList.push(option);
            }

            this.fieldsOpt = fieldList;
            let list = new Array();
            this.fieldsOpt.forEach((option, index) => {
                let isChecked = false;
                if (index < 10) {
                    isChecked = true;
                }
                list.push({ isChecked: isChecked, fieldName: option.value.title });
            });
            this.source.setPaging(1, list.length);
            this.setting();
            this.source.load(list);
        });
    }

    confirm() {
        let selFieldArr = new Array();
        let datasoure = this.table.source.filteredAndSorted;
        datasoure.filter((field) => {
            return field.isChecked;
        }).forEach(selField => {
            this.fieldsOpt.forEach(item => {
                if (selField.fieldName === item.value.title) {
                    selFieldArr.push(item);
                }
            });
        });
        this.onSelected.emit(selFieldArr);
    }

    setting() {
        this.settings = {
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
        };

    }
}