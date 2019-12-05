import { Component, OnInit, EventEmitter, Output, Input, TemplateRef, ViewChild } from '@angular/core';
import { Station, AreaInfo } from '../../models';
import { StationService, AreaService, ApiService } from '../../services';
// import 'style-loader!./areaChoose.scss';
import { UserConfig } from '../../models/userConfig/userConfig';
import { CropStatService } from '../../services/cropstat.service';

@Component({
    selector: 'area-choose',
    templateUrl: './areaChoose.html',
    styleUrls: ['./areaChoose.scss']
})

export class AreaChoose implements OnInit {
    @Input() isShowAll = false;
    areaChooseClassLevel: string = 'areaChoose-level1'
    proList = new Array();
    cityList = new Array();
    counList = new Array();
    proListShow = new Array();
    cityListShow = new Array();
    counListShow = new Array();

    selArea: AreaInfo;

    areaList = new Array();
    @Input()
    filterType: string = 'default';

    @Output()
    onSelected = new EventEmitter<any>();

    constructor(private areaService: AreaService, private apiService: ApiService
    ) { }

    ngOnInit() {
        this.areaChooseClassLevel = 'areaChoose-level' + this.areaService.level;
        if (this.apiService.level == 1 || this.isShowAll) {
            let codeNum = Math.floor(Number(this.areaService.areaCode) / 10000);
            this.areaService.getByFilter(codeNum, 1).then(data => {
                this.proList = data;
                this.proList[0]['isVailable'] = true;
                this.proListShow = this.proList;
                this.areaService.getByFilter(codeNum, 2).then(data => {
                    this.cityList = data;
                    this.areaService.getByFilter(codeNum, 3).then(data => {
                        this.counList = data;
                        this.areaList = this.cityList.concat(this.counList);
                        this.areaList.forEach(area => { area['isVailable'] = true });
                        this.filter();
                    });
                });
            });
        } else if (this.apiService.level == 2) {
            let codeNum = Math.floor(Number(this.areaService.areaCode) / 100);
            this.areaService.getByFilter(codeNum, 2).then(data => {
                this.cityList = data;
                this.cityList[0]['isVailable'] = true;
                this.cityListShow = [this.cityList[0]];
                this.areaService.getByFilter(codeNum, 3).then(data => {
                    this.counList = data;
                    this.areaList = this.cityList.concat(this.counList);
                    this.areaList.forEach(area => { area['isVailable'] = true });
                    this.filter();
                });
            });
        }
    }

    filter() {
        switch (this.filterType) {
            case 'isHaveCrops':
                this.areaList.forEach(area => {
                    let code = area.cCode.toString();
                    // let code = area.cCode.toString().substring(0, area.vLevel * 2) + '%';
                    this.areaService.getCropsByCode(code).subscribe((data: Array<any>) => {
                        area['isVailable'] = data.length > 0;
                    })
                });
                break;
            case 'jujube':
                let availableArea = ['350100', '350200', '350300', '350500', '350600', '350800', '350900'];
                this.areaList.forEach(area => {
                    let code = area.cCode.toString();
                    // 台湾青枣种植区：宁德（除周宁、寿宁、柘荣）、福州、莆田、泉州、厦门、漳州、龙岩
                    if (availableArea.includes(code.substring(0, 4) + "00") && code != '350925' && code != '350924' && code != '350926') {
                        area['isVailable'] = true;
                    } else {
                        area['isVailable'] = false;
                    }
                });
                console.log(this.areaList);
                break;
            default:
                break;
        }

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
