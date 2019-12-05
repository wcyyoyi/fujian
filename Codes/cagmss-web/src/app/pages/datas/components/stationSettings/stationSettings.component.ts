import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { StationService } from '../../../services/station.service';
import { Station } from '../../../models/station';

@Component({
    selector: 'station-settings',
    templateUrl: './stationSettings.html',
    styleUrls: ['./stationSettings.scss']
})

export class StationSettings implements OnInit {

    public statList: Station[];
    public selectedStats;

    statShowList: Station[];

    areaList = new Array();
    cityList = new Array();
    staTypeList = new Array();
    areaOptions = new Array();
    cityOptions = new Array();
    staTypeOptions = new Array();

    @Output()
    onSelected = new EventEmitter<any>();

    constructor(protected service: StationService) { }

    ngOnInit() {
        this.service.getAll().subscribe((data) => {
            this.statList = data;
            this.statShowList = this.statList;
            this.statList.forEach(stat => {
                if (this.areaList.indexOf(stat.cAera) < 0) {
                    this.areaList.push(stat.cAera);
                }
                if (this.cityList.indexOf(stat.cCity) < 0) {
                    this.cityList.push(stat.cCity);
                }
                if (this.staTypeList.indexOf(stat.cTypestation) < 0) {
                    this.staTypeList.push(stat.cTypestation);
                }
            });
        });
    }

    onChange(options) {
        this.selectedStats = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.value);

        this.onSelected.emit(this.selectedStats);
    }

    updateStaTypeCheckedOptions(item, event) {
        if (event.target.checked) {
            this.staTypeOptions.push(item);
        } else {
            this.staTypeOptions.splice(this.staTypeOptions.indexOf(item), 1);
        }

        let area = document.getElementsByName('area');
        for (let i = 0; i < area.length; i++) {
            area[i]['checked'] = false;
        }
        this.areaOptions = new Array();
        let city = document.getElementsByName('city');
        for (let i = 0; i < city.length; i++) {
            city[i]['checked'] = false;
        }
        this.cityOptions = new Array();

        this.selectSta();
        this.areaList = new Array();
        this.cityList = new Array();
        this.statShowList.forEach(stat => {
            if (this.areaList.indexOf(stat.cAera) < 0) {
                this.areaList.push(stat.cAera);
            }
            if (this.cityList.indexOf(stat.cCity) < 0) {
                this.cityList.push(stat.cCity);
            }
        });
    }
    updateAreaCheckedOptions(item, event) {
        if (event.target.checked) {
            this.areaOptions.push(item);
        } else {
            this.areaOptions.splice(this.areaOptions.indexOf(item), 1);
            this.selectSta();
        }

        let city = document.getElementsByName('city');
        for (let i = 0; i < city.length; i++) {
            city[i]['checked'] = false;
        }
        this.cityOptions = new Array();

        this.selectSta();
        this.cityList = new Array();
        this.statShowList.forEach(stat => {
            if (this.cityList.indexOf(stat.cCity) < 0) {
                this.cityList.push(stat.cCity);
            }
        });
    }
    updateCityCheckedOptions(item, event) {
        if (event.target.checked) {
            this.cityOptions.push(item);
        } else {
            this.cityOptions.splice(this.cityOptions.indexOf(item), 1);
        }
        this.selectSta();
    }

    selectSta() {
        this.statShowList = this.statList;
        this.statShowList = this.select(this.statShowList, 'cTypestation', this.staTypeOptions);
        this.statShowList = this.select(this.statShowList, 'cAera', this.areaOptions);
        this.statShowList = this.select(this.statShowList, 'cCity', this.cityOptions);
    }

    select(list, type, params) {
        if (params.length === 0) {
            return list;
        }
        let statList = new Array();
        list.forEach(stat => {
            params.forEach(param => {
                if (stat[type] === param) {
                    statList.push(stat);
                }
            });
        });
        return statList;
    }

    reset() {
        let staType = document.getElementsByName('staType');
        for (let i = 0; i < staType.length; i++) {
            staType[i]['checked'] = false;
        }
        this.staTypeOptions = new Array();
        let area = document.getElementsByName('area');
        for (let i = 0; i < area.length; i++) {
            area[i]['checked'] = false;
        }
        this.areaOptions = new Array();
        let city = document.getElementsByName('city');
        for (let i = 0; i < city.length; i++) {
            city[i]['checked'] = false;
        }
        this.cityOptions = new Array();
        this.statShowList = this.statList;
    }
}