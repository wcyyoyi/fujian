import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WebSysConf } from './pages/models/sysConfig/WebSysConf';
import { Http, Response } from '@angular/http';
import { environment } from 'environments/environment';
import { SelectItem } from './pages/models';

@Injectable()
export class GlobalState {

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor(private http: Http) {
    this._dataStream$.subscribe((data) => {
      this._onEvent(data);
    });

    let url = this.getWebUrl() + '/assets/sysConfig/sysConf.json';
    this.http.get(url).toPromise().then((response: Response) => {
      environment.webSysConf = response.json();
      // localStorage.setItem('webSysConf', JSON.stringify(response.json()));
      // return response.json();
    });
    environment.mosList = this.initMosList();
    environment.dayList = this.initDayList();
    environment.gridLocaleText = this.initGridLocaleText();
  }

  initGridLocaleText():any{
    return  {
      page: "页",
      more: "更多",
      to: "To",
      of: "Of",
      next: "下一个",
      last: "最后一个",
      first: "第一个",
      previous: "预览",
      loadingOoo: "加载中...",
      selectAll: "全选",
      searchOoo: "查找中...",
      blanks: "空白",
      filterOoo: "筛选...",
      applyFilter: "应用条件",
      clearFilter: "清除条件",
      equals: "相等",
      notEqual: "不相等",
      lessThanOrEqual: "小于等于",
      greaterThanOrEqual: "大于等于",
      inRange: "范围",
      lessThan: "小于",
      greaterThan: "大于",
      contains: "包含",
      notContains: "不包含",
      startsWith: "起始于",
      endsWith: "结束于",
      group: "分组",
      columns: "列",
      rowGroupColumns: "Pivot Cols",
      rowGroupColumnsEmptyMessage: "please drag cols to group",
      valueColumns: "Value Cols",
      pivotMode: "Pivot-Mode",
      groups: "Groups",
      values: "Values",
      pivots: "Pivots",
      valueColumnsEmptyMessage: "drag cols to aggregate",
      pivotColumnsEmptyMessage: "drag here to pivot",
      noRowsToShow: "无数据",

      copy: "复制",
      ctrlC: "ctrl + C",
      paste: "粘贴",
      ctrlV: "ctrl + V",
    };
  }

  initMosList():Array<SelectItem>{
    let eleList = new Array<SelectItem>();
    eleList.push({ code: 'v12016', desc: '最高气温' });
    eleList.push({ code: 'v12017', desc: '最低气温' });
    eleList.push({ code: 'v13006', desc: '最大相对湿度' });
    eleList.push({ code: 'v13007', desc: '最小相对湿度' });
    eleList.push({ code: 'v11042', desc: '最大风速' });
    eleList.push({ code: 'v11202', desc: '最大风向' });
    eleList.push({ code: 'v11002', desc: '风速' });
    eleList.push({ code: 'v11001', desc: '风向' });
    eleList.push({ code: 'v13019', desc: '24小时降水量' });
    eleList.push({ code: 'v13204', desc: '08-20时降水量' });
    eleList.push({ code: 'v13203', desc: '20-08时降水量' });
    eleList.push({ code: 'v12001', desc: '24小时平均温度' });
    eleList.push({ code: 'v20051', desc: '12小时低云量' });
    eleList.push({ code: 'v20010', desc: '12小时总云量' });

    return eleList;
  }

  initDayList():Array<SelectItem>{
    let eleList = new Array<SelectItem>();

    eleList.push({ code: 'v11002', desc: '风速' });
    eleList.push({ code: 'v12001', desc: '平均气温' });
    eleList.push({ code: 'v12003', desc: '露点温度' });
    eleList.push({ code: 'v12052', desc: '最高气温' });
    eleList.push({ code: 'v12053', desc: '最低气温' });
    eleList.push({ code: 'v12213', desc: '最高地温' });
    eleList.push({ code: 'v12214', desc: '最低地温' });
    eleList.push({ code: 'v12240', desc: '0厘米地温' });
    eleList.push({ code: 'v13003', desc: '相对湿度' });
    eleList.push({ code: 'v13004', desc: '水汽压' });
    eleList.push({ code: 'v13006', desc: '最大相对湿度' });
    eleList.push({ code: 'v13007', desc: '最小相对湿度' });
    eleList.push({ code: 'v13201', desc: '20至20时降水量' });
    eleList.push({ code: 'v13202', desc: '08至08时降水量' });
    eleList.push({ code: 'v13203', desc: '20至8时降水量' });
    eleList.push({ code: 'v13204', desc: '8至20时降水量' });
    eleList.push({ code: 'v13241', desc: '日蒸发量小型' });
    eleList.push({ code: 'v13242', desc: '日蒸发量大型' });
    eleList.push({ code: 'v14032', desc: '日照时数' });
    eleList.push({ code: 'v20010', desc: '总云量' });
    eleList.push({ code: 'v20051', desc: '低云量' });
    eleList.push({ code: 'v20235', desc: '积雪深度' });
    return eleList;
  }

  notifyDataChanged(event, value) {

    let current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  subscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }

  private getWebUrl() {
    let host = window.location.hostname || '127.0.0.1';
    let port = window.location.port || 81;

    return 'http://' + host + ':' + port;
  }
}
