import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from './api.service'
import { Station } from '../models';
@Injectable()
export class StationService extends ApiService {

    private _stations: Station[];

    get stations() {
        if (this._stations && this._stations.length > 0) {
            return Promise.resolve(this._stations);
        }
        else {
            return this.getAll().toPromise();
        }
    }

    constructor(http: Http) {
        super(http);
    }

    getAll() {
        return this.http.get(this.metas_url + '/mang/stat', this.jwt())
            .map((response: Response) => response.json());
    }
    addnewStation(station) {
        return this.http.post(this.metas_url + '/mang/stat', station, this.jwt())
            .map((response: Response) => response.json());
    }
    getStaByAreaCode(areaCode) {
        return this.http.get(this.metas_url + '/mang/stat/query?cCode=' + areaCode, this.jwt())
            .toPromise()
            .then((response: Response) => response.json());
    }

    //根据区域获取站点
    getStasByAreaCode(areaCode: number | string, areaLevel: number) {
        return this.http.get(this.metas_url + '/mang/stat/getByCCdode?cCode=' + areaCode + "&areaLevel=" + areaLevel, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    //根据作物名称获取站点
    getByCropName(cropName: string) {
        return this.http.get(this.data_url + '/meteostat/getByCropName?cropName=' + cropName, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }
    //根据作物名称和站点删除
    deleteStationCrop(stations, cropname) {
        return this.http.post(this.data_url + '/mang/cropstat/deleteByCropnameAndV01000?cropname=' + cropname, stations, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }
    getCrops(stations) {
        return this.http.post(this.data_url + '/mang/cropstat/getByStatNums', stations, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get(this.metas_url + '/mang/stat/' + id, this.jwt()).map((response: Response) => response.json());
    }
    //获取站点类型枚举
    getStationType() {
        return this.http.get(this.metas_url + '/mang/stat/enum/statType', this.jwt()).map((response: Response) => response.json());
    }
    getIdsByArea(areaCode: number, areaLevel: number): Promise<Array<number>> {
        // 根据所选区域过滤站点
        let stations = new Array<number>();
        let code = areaCode.toString().substring(0, areaLevel * 2);

        return this.stations.then(stats => {
            stats.forEach(sta => {
                if (sta.cCode != null) {
                    if (sta.cCode.startsWith(code)) {
                        stations.push(sta.v01000);
                    }
                }

            });
            return stations;
        });
    }
    clearCache() {
        return this.http.delete(this.metas_url + '/mang/stat/deleteCache', this.jwt()).map((response: Response) => response.json());
    }
    //站点选择模块获取站点
    getStations(areaCode: string, areaLevel: number){
        return this.http.get(this.metas_url + '/mang/stat/getStations?cCode=' + areaCode + "&vLevel=" + areaLevel, this.jwt())
        .toPromise()
        .then((response: Response) => response.json())
        .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('StationService an error occurred', error); // for demo purposes only
        //return Promise.reject(error.message || error);
        return Promise.resolve(null);
    }
}