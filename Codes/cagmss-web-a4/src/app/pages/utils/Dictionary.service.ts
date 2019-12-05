import { Injectable } from '@angular/core';
import { CropDictService, StationService, AreaService } from '../services';
import { E009 } from './models/e009';
import { E001 } from './models/e001';
import { MangStat } from './models/mang_stat';
import { AreaInfo, SelectItem } from '../models';

@Injectable()
export class DictionaryService {
    // private _MANG_STATV01000TocStatName: Map<object, object>;

    constructor(
        private cropDictService: CropDictService,
        private staService: StationService,
        private areaService: AreaService,
    ) {
    }

    init() {
        let initPromise = new Array<Promise<any>>();
        initPromise.push(this.setE009());
        initPromise.push(this.setE001());
        initPromise.push(this.setMANG_STAT());
        initPromise.push(this.setArea());
        initPromise.push(this.setDist());
        Promise.all(initPromise).then(() => {
            console.log('DictionaryService success!')
        });
    }
    // 发育期
    private setE009() {
        return this.cropDictService.getDevInfo('').toPromise().then((e009List: Array<E009>) => {
            localStorage.setItem('E009', JSON.stringify(e009List));
        });
    }

    // 作物
    private setE001() {
        return this.cropDictService.getAllCrops().toPromise().then((e001List: Array<E001>) => {
            localStorage.setItem('E001', JSON.stringify(e001List));
        });
    }

    // 站点
    private setMANG_STAT() {
        return this.staService.getAll().toPromise().then((statList: Array<MangStat>) => {
            let code = this.staService.areaCode.toString().substring(0, this.staService.level * 2);
            let filter = statList.filter(stat => { return stat.cCode != null && stat.cCode.startsWith(code) });
            filter.forEach(stat => {
                if (stat.cTypestation !== '区域站') {
                    stat.cTypestation = '国家站';
                }
            });
            localStorage.setItem('MANG_STAT', JSON.stringify(filter));
        });
    }

    // 区域
    private setArea() {
        return this.areaService.getAll().toPromise().then((areaList: Array<AreaInfo>) => {
            localStorage.setItem('AREA', JSON.stringify(areaList));
        })
    }

    // 灾害
    private setDist() {
        return this.cropDictService.getDistInfo().toPromise().then(data => {
            let distList = new Array<SelectItem>();
            for (let info of data) {
                let item = new SelectItem();
                item.code = info.cCode;
                item.desc = info.cDisastername;
                distList.push(item);
            }
            localStorage.setItem('DIST', JSON.stringify(distList));
        });
    }


    // get MANG_STATV01000TocStatName() {
    //     return this._MANG_STATV01000TocStatName;
    // }

    get E001(): Array<E001> {
        return JSON.parse(localStorage.getItem('E001'));
    }

    get E009(): Array<E009> {
        return JSON.parse(localStorage.getItem('E009'));
    }

    get MANG_STAT() {
        return JSON.parse(localStorage.getItem('MANG_STAT'));
    }

    get AREA(): Array<AreaInfo> {
        return JSON.parse(localStorage.getItem('AREA'));
    }

    get DIST(): Array<SelectItem> {
        return JSON.parse(localStorage.getItem('DIST'));
    }
}