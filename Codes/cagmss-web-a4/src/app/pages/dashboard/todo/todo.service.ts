import { Injectable } from '@angular/core';
import { Station } from '../../models';
import { StationService, AreaService, YieldService, C01Service } from '../../services';
import { AreaInfo } from '../../models';

import * as city from 'assets/data/geo/city.json';
import * as county from 'assets/data/geo/county.json';
import { DictionaryService } from 'app/pages/utils/Dictionary.service';
import { Utils } from 'app/pages/utils/utils';
import { E001 } from 'app/pages/utils/models/e001';

const cityGeo = (<any>city);
let countyGeo = (<any>county);

@Injectable()
export class TodoService {
  utils = new Utils();
  newCountyGeo = {
    "type": "FeatureCollection",
    "features": []
  };
  constructor(private stdServ: StationService,
    private areaServ: AreaService,
    private yieldServ: YieldService,
    private dictionaryService: DictionaryService
  ) {
  }

  initGeoJson() {
    this.newCountyGeo.features = [];
    let jeoArr = [];
    if (this.areaServ.level == 2) {
      cityGeo.features.forEach(geo => {
        if (geo.properties.GEO_CODE == this.areaServ.areaCode) {
          jeoArr.push(geo);
        }
      });
    } else if (this.areaServ.level == 3) {
      countyGeo.features.forEach(geo => {
        if (geo.properties.GEO_CODE == this.areaServ.areaCode) {
          jeoArr.push(geo);
        }
      });
    } else {
      countyGeo.features.forEach(geo => {
        jeoArr.push(geo);
      });
    }
    this.newCountyGeo.features = jeoArr;
  }
  getJeoArr(){
    return this.newCountyGeo.features;
  }
  private _todoList = [
    // { text: '水稻', name: 'shuidao', code: '010001' },
    // { text: '枇杷', name: 'pipa', code: '012301' },
    // { text: '龙眼', name: 'longyan', code: '012201' },
    // { text: '香蕉', name: 'xiangjiao', code: '015101' },
    // { text: '莲雾', name: 'lianwu', code: '014001' },
    // { text: '茶叶', name: 'chaye', code: '011601' },
    // { text: '烤烟', name: 'kaoyan', code: '011101' },
    // // { text: '荔枝', name: 'lizhi', code: '999999' },
    // { text: '李果', name: 'liguo', code: '015001' },
    // { text: '葡萄', name: 'putao', code: '011201' },
    // { text: '西红柿', name: 'xihongshi', code: '012501' },
    // { text: '火龙果', name: 'huolongguo', code: '014601' },
    // { text: '胡萝卜', name: 'huluobo', code: '014101' },
    // { text: '杨梅', name: 'yangmei', code: '013401' },
    // { text: '大葱', name: 'dacong', code: '011901' },
    // { text: '芦柑', name: 'lugan', code: '013901' },
    // { text: '花生', name: 'huasheng', code: '010605' }
  ];

  getTodoList() {
    this._todoList = new Array();
    let cropArr = new Array();
    //作物名称相同时取得第一个
    // this.dictionaryService.E001.forEach(list => {
    //   let item = cropArr.find(ele => ele["cCropname"] == list["cCropname"]);
    //   if (!item) {
    //     cropArr.push(list)
    //   }
    // })

    // cropArr = this.distinct(this.dictionaryService.E001, "cCropname");
    cropArr = this.distinct(this.dictionaryService.E001, "cCrop");

    cropArr.forEach(e001 => {
      let pin = this.utils.toPinyin(e001.cCropname);
      let text = e001.cCrop
      let crops = this.dictionaryService.E001.filter(e001 => { return e001.cCrop == text });
      this._todoList.push({
        text: text,
        name: pin,
        code: e001.cCode,
        crops: crops
      });
    })
    return this._todoList;
  }

  getStationPoints(crop) {

    let promiseArr = new Array<Promise<any>>();

    let pointList = new Array();
    crop.crops.forEach((e001: E001) => {
      promiseArr.push(this.stdServ.getByCropName(e001.cCropname).then((statList: Array<Station>) => {
        statList.forEach(stat => {
          let point = new Object({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [stat.v06001, stat.v05001]
            },
            properties: {
              "站号": stat.v01000,
              "站名": stat.cStatName,
              "测站高度": stat.v07001,
              "经度": stat.v06001,
              "纬度": stat.v05001,
              "所在地": stat.cCity,
              "作物名称": crop.text,
              // "作物编码": crop.code,
            }
          });
          pointList.push(point);
        });
      }));
    });


    return Promise.all(promiseArr).then(() => {
      return pointList;
    })
  }

  // getProvYieldPoints(year: number, cropName: string) {
  //   // let year = 2014;
  //   // if (cropName == '水稻')
  //   //   year = 2016;

  //   return this.yieldServ.getByFilter(year, cropName)
  //     .then(yields => this.getAreaByCrop(yields))
  //     .then(areas => {
  //       let pointList: Object[] = new Array<Object>();
  //       areas.forEach(area => {
  //         let point = new Object({
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [area.v06001, area.v05001]
  //           },
  //           properties: {
  //             "区域代码": area.cCode,
  //             "区域名": area.cName,
  //             "年份": area.year,
  //             "产量(wt)": area.value,
  //             "面积(kha)": area.size
  //           }
  //         });

  //         pointList.push(point);
  //       });

  //       return pointList;
  //     });
  // }

  getProvYieldPolygon(year: number, cropName: string) {
    // let year = 2014;
    // if (cropName == '水稻')
    //   year = 2016;
    let geo = this.newCountyGeo;

    // 获取产量
    let yieldPromise = this.yieldServ.getByFilter(year, cropName);

    // 查找对应区域产量信息
    return yieldPromise.then(yields => {
      if (!geo) return null;

      if (yields == undefined || yields.length <= 0) {
        return;
      }
      for (let index = 0; index < geo.features.length; index++) {
        let cityName = geo.features[index].properties["CNAME"];
        let yieldInfo = yields.find(yInfo => yInfo.cProvince == cityName);
        if (!yieldInfo) {
          geo.features[index].properties["年份"] = year;
          geo.features[index].properties["产量"] = 0;
          geo.features[index].properties["面积"] = 0;
        } else {
          geo.features[index].properties["年份"] = yieldInfo.vYear;
          geo.features[index].properties["产量"] = yieldInfo.v56180;
          geo.features[index].properties["面积"] = yieldInfo.v56181;
        }

      }

      return geo;
    });
  }

  getAreaByCrop(yieldList: Array<any>) {
    return this.areaServ.getByFilter(35, 2).then(areas => {
      let areaList: AreaInfo[] = areas;
      if (!areaList) return;

      areaList.forEach(info => {
        let yieldInfo = yieldList.find(yInfo => yInfo.cProvince == info.cName);
        info.year = yieldInfo.vYear;
        info.value = yieldInfo.v56180;
        info.size = yieldInfo.v56181;
      });

      return areaList;
    });
  }

  distinct(list: Array<any>, field: string): Array<any> {
    let result = []
    let obj = {}

    for (let i of list) {
      if (!obj[i[field]]) {
        result.push(i)
        obj[i[field]] = 1
      }
    }

    return result
  }
}
