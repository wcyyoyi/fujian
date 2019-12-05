import { Injectable } from '@angular/core';
import { DictionaryService } from '../Dictionary.service';
import { E001 } from '../models/e001';
import { E009 } from '../models/e009';
import { MangStat } from '../models/mang_stat';
import { AreaInfo } from '../../models';

@Injectable()
export class ConverterService {

    constructor(private dictionaryService: DictionaryService) { }

    // 正乘负除，默认除10
    multipleConv(value: number, multiple: number = -10) {
        if (multiple > 0) {
            return value * Math.abs(multiple);
        } else {
            return Number((value / Math.abs(multiple)).toFixed(2));
        }
    }

    // 时间戳转date
    timestampToFormateDate(value) {
        if (typeof (value) !== 'number') {
            return value;
        }
        let dateValue = new Date(value);
        return dateValue.toLocaleDateString();
    }

    // 时间戳转date
    timestampToFormateDate2(value) {
        if (typeof (value) !== 'number') {
            return value;
        }
        let dateValue = new Date(value);
        return dateValue;
    }

    // 数字转时间 eg：609 => 6月9日
    numberToDate(value: number) {
        let sMon = Math.floor(value / 100) + "月";
        let sDay = value % 100 + "日";
        return sMon + sDay;
    }

    numToDate(value: number) {
        let year = value.toString().substr(0, 4);
        let month = value.toString().substr(4, 2);
        let day = value.toString().substr(6, 2);
        return year + "/" + month + "/" + day;
    }
    // cropCode为作物编码，cCode为发育期编码
    devCodeToName(cropCode: string, cCode: string) {
        let E001List: Array<E001> = this.dictionaryService.E001;
        let E009List: Array<E009> = this.dictionaryService.E009;
        let e001 = E001List.find(e001 => e001.cCode === cropCode);
        let e009 = E009List.find(e009 => e009.cCrop === e001.cCrop && e009.cCode === cCode);
        if (e009) {
            return e009.cCorpdev;
        } else {
            return '无';
        }
    }

    // 站号转站名
    statCodToName(value: number) {
        let statList: Array<MangStat> = this.dictionaryService.MANG_STAT;
        let stat = statList.find(stat => stat.v01000 === value);

        if (stat) {
            return stat.cStatName;
        } else {
            return '无';
        }
    }

    // 发育期编码转汉字
    cropCodeToName(value: string) {
        let e001List: Array<E001> = this.dictionaryService.E001;
        let e001 = e001List.find(e001 => e001.cCode === value);

        if (e001) {
            return e001.cCropname;
        } else {
            return '无';
        }
    }

    // 区域编码转汉字 350000
    areaCodeToName(value: number) {
        let areaList: Array<AreaInfo> = this.dictionaryService.AREA;
        let area = areaList.find(area => area.cCode === value);
        if (area) {
            return area.cName;
        } else {
            return '无';
        }
    }

    // 区域产品编码转汉字 BEFZ
    areaCPCodeToName(value: string) {
        let areaList: Array<AreaInfo> = this.dictionaryService.AREA;
        let area = areaList.find(area => area.cPCode === value);
        if (area) {
            return area.cName;
        } else {
            return '无';
        }
    }

    // 灾害代码转汉字
    distCPCodeToName(value: string): string {
        let distList = this.dictionaryService.DIST;
        let dist = distList.find(dist => dist.code === value);
        if (dist) {
            return dist.desc;
        } else {
            return '无';
        }
    }
}