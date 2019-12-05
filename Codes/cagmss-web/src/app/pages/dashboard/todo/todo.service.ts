import { Injectable } from '@angular/core';
import { Station } from '../../models';
import { StationService, AreaService, YieldService } from '../../services';
import { AreaInfo } from '../../models';

import * as cityGeo from '../../../../assets/data/geo/city.json';

@Injectable()
export class TodoService {
  constructor(private stdServ: StationService,
    private areaServ: AreaService,
    private yieldServ: YieldService) {

  }

  private _todoList = [
    { text: '水稻', name: 'shuidao', code: '010001' },
    { text: '枇杷', name: 'pipa', code: '012301' },
    { text: '龙眼', name: 'longyan', code: '012201' },
    { text: '香蕉', name: 'xiangjiao', code: '999999' },
    { text: '莲雾', name: 'lianwu', code: '014001' },
    { text: '茶叶', name: 'chaye', code: '011601' },
    { text: '烤烟', name: 'kaoyan', code: '011101' },
    { text: '荔枝', name: 'lizhi', code: '999999' },
    { text: '李果', name: 'liguo', code: '999999' },
    { text: '葡萄', name: 'putao', code: '011201' },
    { text: '西红柿', name: 'xihongshi', code: '012501' },
    { text: '火龙果', name: 'huolongguo', code: '014601' },
    { text: '胡萝卜', name: 'huluobo', code: '014101' },
    { text: '杨梅', name: 'yangmei', code: '013401' },
    { text: '大葱', name: 'dacong', code: '011901' },
    { text: '芦柑', name: 'lugan', code: '013901' },
    { text: '花生', name: 'huasheng', code: '010605' }
  ];

  getTodoList() {
    return this._todoList;
  }

  getStationPoints(cropName: string) {
    return this.stdServ.getByCropName(cropName).then(data => {
      if (data) {
        let statList: Station[] = data;
        let pointList: Object[] = new Array<Object>();

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
              "所在地": stat.cCity
            }
          });

          pointList.push(point);
        });

        return pointList;
      }
    });
  }

  getProvYieldPoints(cropName: string) {
    let year = 2014;
    if (cropName == '水稻')
      year = 2016;

    return this.yieldServ.getByFilter(year, cropName)
      .then(yields => this.getAreaByCrop(yields))
      .then(areas => {
        let pointList: Object[] = new Array<Object>();

        areas.forEach(area => {
          let point = new Object({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [area.v06001, area.v05001]
            },
            properties: {
              "区域代码": area.cCode,
              "区域名": area.cName,
              "年份": area.year,
              "产量(wt)": area.value,
              "面积(kha)": area.size
            }
          });

          pointList.push(point);
        });

        return pointList;
      });
  }

  getProvYieldPolygon(cropName: string) {
    let year = 2014;
    if (cropName == '水稻')
      year = 2016;

    // 获取产量
    let yieldPromise = this.yieldServ.getByFilter(year, cropName);

    // 查找对应区域产量信息
    return yieldPromise.then(yields => {
      if(!cityGeo) return null;
      
      cityGeo.features.forEach(feat => {
        let cityName = feat.properties["CNAME"];
      
        let yieldInfo = yields.find(yInfo => yInfo.cProvince == cityName);
        feat.properties["年份"] = yieldInfo.vYear;
        feat.properties["产量"] = yieldInfo.v56180;
        feat.properties["面积"] = yieldInfo.v56181;
      });

      return cityGeo;
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
}
