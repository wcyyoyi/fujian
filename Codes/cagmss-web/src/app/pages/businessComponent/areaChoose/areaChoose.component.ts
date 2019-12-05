import { Component, OnInit, EventEmitter, Output, Input, TemplateRef, ViewChild } from '@angular/core';
import { Station, AreaInfo } from '../../models';
import { StationService, AreaService } from '../../services';
import 'style-loader!./areaChoose.scss';
import { UserConfig } from '../../models/userConfig/userConfig';

@Component({
    selector: 'area-choose',
    templateUrl: './areaChoose.html',
    // styleUrls: ['./areaChoose.scss']
})

export class AreaChoose implements OnInit {
    proList = new Array();
    cityList = new Array();
    counList = new Array();
    proListShow = new Array();
    cityListShow = new Array();
    counListShow = new Array();

    selArea: AreaInfo;

    @Output()
    onSelected = new EventEmitter<any>();

    constructor(private areaService: AreaService,
    ) { }

    ngOnInit() {
        this.areaService.getUserConfig('fjadmin').then((userConfig: UserConfig) => {
            let codeNum = Math.floor(Number(userConfig.area.code) / 10000);
            this.areaService.getByFilter(codeNum, 1).then(data => {
                this.proList = data;
                this.proListShow = this.proList;
            });
            this.areaService.getByFilter(codeNum, 2).then(data => {
                this.cityList = data;
            });
            this.areaService.getByFilter(codeNum, 3).then(data => {
                this.counList = data;
            });
        });
    }

    selectDistrict(item) {
        this.selArea = item;
        let code = item.cCode.toString().substring(0, item.vLevel * 2);

        if (item.vLevel === 1) {
            this.cityListShow = new Array();
            this.cityList.forEach(city => {
                if (city.cCode.toString().startsWith(code) && city.vLevel === 2) {
                    this.cityListShow.push(city);
                }
            });
            this.counListShow = new Array();
        } else if (item.vLevel === 2) {
            this.counListShow = new Array();
            this.counList.forEach(coun => {
                if (coun.cCode.toString().startsWith(code) && coun.vLevel === 3) {
                    this.counListShow.push(coun);
                }
            });
        }
        this.onSelected.emit(this.selArea);
    }

}
