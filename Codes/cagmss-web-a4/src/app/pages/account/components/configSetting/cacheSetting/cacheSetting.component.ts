import { Component, OnInit, ViewChild } from '@angular/core';
import { AreaService } from '../../../../services';
import { StationService } from '../../../../services';
import { DictionaryService } from '../../../../utils/Dictionary.service';
@Component({
    selector: 'cache-setting',
    templateUrl: './cacheSetting.html',
    styleUrls: ['./cacheSetting.scss'],

})
export class CacheSettingComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    constructor(private dictionaryService: DictionaryService, private areaService: AreaService,
        private stationService: StationService) {
    };

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
    }
    clearCache() {
        this.clearForeGroundCache();
        this.dictionaryService.init();
    }
    clearForeGroundCache() {
        localStorage.removeItem('AREA');
        localStorage.removeItem('MANG_STAT');
        localStorage.removeItem('DIST');
        localStorage.removeItem('E009');
        localStorage.removeItem('E001');
    }
}