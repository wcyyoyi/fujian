import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataState } from '../../datas.state';
import { LocalDataSource } from 'ng2-smart-table';

import { AreaService } from '../../../services';

import 'style-loader!./smartTables.scss';

@Component({
    selector: 'index-table',
    templateUrl: 'indexTable.html'
})

export class IndexTable implements AfterViewInit {
    customSettings: any;
    service: any;
    source: LocalDataSource = new LocalDataSource();
    cropMap: Map<string, string> = new Map<string, string>();
    areaMap: Map<number, string> = new Map<number, string>();

    constructor(private route: ActivatedRoute,
        private state: DataState,
        private areaServ: AreaService) {

    }

    ngAfterViewInit() {
        this.route.params.subscribe((params: Params) => {
            let tabName = params['name'];
            this.customSettings = this.state[tabName];
            this.source.empty();

            this.service = this.customSettings.service;
            this.service.getCropInfo().subscribe(data => {
                if (!data) return;

                for (let info of data) {
                    this.cropMap.set(info.cCode, info.cCropname);
                }

                this.areaServ.areas.then(areaInfos => {
                    if (!areaInfos) return;
                    areaInfos.forEach(area => {
                        this.areaMap.set(area.cCode, area.cName);
                    });

                    this.getExpEleInfo();
                });
            });
        });
    }

    getExpEleInfo() {
        this.service.getExpEleList().subscribe(data => {
            if (!data) return;

            for (let info of data) {
                // info.cCropcode = this.cropMap.get(info.cCropcode);
                info.cCropname = this.cropMap.get(info.cCropcode);
                info.areaName = this.areaMap.get(+info.v01000);
            }

            this.source.load(data);
        });
    }
}