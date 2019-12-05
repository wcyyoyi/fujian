import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Station, AreaInfo } from '../../models';
import { StationService, AreaService } from '../../services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';

import 'style-loader!./stationChoose.scss';

@Component({
    selector: 'checkbox-view',
    template: `
    <input type="checkbox" (click)="onClick($event)" [checked]="value" />
  `,
})

export class StaCheckboxViewComponent implements ViewCell, OnInit {

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
    selector: 'station-choose',
    templateUrl: './stationChoose.html',
    // styleUrls: ['./stationChoose.scss']
    entryComponents: [StaCheckboxViewComponent]

})

export class StationChoose implements AfterViewInit {
    selectedSta = new Array();

    areaList = new Array();
    areaFilter = new Array();
    typeList = new Array();
    typeFilter = new Array();
    cityList = new Array();
    cityFilter = new Array();

    staSettings;
    staSource: LocalDataSource = new LocalDataSource();
    perPage: number = 20;

    @Input() statList: Station[];
    @Output()
    onSelected = new EventEmitter<Array<Station>>();

    @ViewChild('table') table;

    bsModalRef: BsModalRef;

    constructor(protected staService: StationService,
        private areaService: AreaService, private _sanitizer: DomSanitizer) { }

    ngAfterViewInit() {
        this.staService.stations.then(staList => {
            this.statList = staList;

            this.staSource.setPaging(1, this.perPage, true);
            this.setSettings();

            this.statList.forEach(stat => stat.isChecked = true);
            this.staSource.load(this.statList);

        });
    }

    confirm(){
        let datasoure = this.table.source.filteredAndSorted;
        this.selectedSta = datasoure.filter((stat) => {
            return stat.isChecked;
        });
        this.onSelected.emit(this.selectedSta);
    }

    setSettings() {
        this.statList.forEach(stat => {
            if (this.areaList.indexOf(stat.cAera) < 0) {
                this.areaList.push(stat.cAera);
                this.areaFilter.push({ value: stat.cAera, title: stat.cAera });
            }
            if (this.typeList.indexOf(stat.cTypestation) < 0) {
                this.typeList.push(stat.cTypestation);
                this.typeFilter.push({ value: stat.cTypestation, title: stat.cTypestation });
            }
            if (this.cityList.indexOf(stat.cCity) < 0) {
                this.cityList.push(stat.cCity);
                this.cityFilter.push({ value: stat.cCity, title: stat.cCity });
            }
        });

        this.staSettings = {
            //selectMode: 'multi',
            pager: {
                display: true,
                perPage: this.perPage
            },
            columns: {
                isChecked: {
                    title: '选择',
                    type: 'custom',
                    filter: false,
                    sort: false,
                    renderComponent: StaCheckboxViewComponent,
                    onComponentInitFunction: (instance: any) => {
                        instance.save.subscribe(rowData => {
                            // this.selectStations();
                        });
                    }
                },
                v01000: {
                    title: '站号',
                    class: 'w20 text-center'
                },
                cStatName: {
                    title: '站名',
                    class: 'w15 text-center'
                },
                cTypestation: {
                    title: '类型',
                    class: 'w20 text-center',
                    filter: {
                        type: 'list',
                        config: {
                            selectText: '选择类型',
                            list: this.typeFilter
                        },
                    }
                },
                cCity: {
                    title: '所属城市',
                    class: 'w20 text-center',
                    filter: {
                        type: 'list',
                        config: {
                            selectText: '选择城市',
                            list: this.cityFilter
                        },
                    },
                },
                cAera: {
                    title: '所属区域',
                    class: 'w20 text-center',
                    filter: {
                        type: 'list',
                        config: {
                            selectText: '选择区域',
                            list: this.areaFilter
                        },
                    }
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
