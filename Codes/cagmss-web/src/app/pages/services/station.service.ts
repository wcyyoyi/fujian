import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ApiService } from './api.service'
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
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
        return this.http.get(this.data_url + '/mang/stat', this.jwt())
            .map((response: Response) => response.json());
    }

    getStaByAreaCode(areaCode) {
        return this.http.get(this.data_url + '/mang/stat/query?cCode=' + areaCode, this.jwt())
            .toPromise()
            .then((response: Response) => response.json());
    }

    getByCropName(cropName: string) {
        return this.http.get(this.data_url + '/mang/stat/query/' + cropName, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    getCrops(stations) {
        return this.http.post(this.data_url + '/dict/crops/stations/', stations, this.jwt())
            .toPromise()
            .then((response: Response) => response.json())
            .catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get(this.data_url + '/mang/stat/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getIdsByArea(areaCode: number, areaLevel: number): Promise<Array<number>> {
        // 根据所选区域过滤站点
        let stations = new Array<number>();
        let code = areaCode.toString().substring(0, areaLevel * 2);

        return this.stations.then(stats => {
            stats.forEach(sta => {
                if (sta.cCode.startsWith(code)) {
                    stations.push(sta.v01000);
                }
            });
            return stations;
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('StationService an error occurred', error); // for demo purposes only
        //return Promise.reject(error.message || error);
        return Promise.resolve(null);
    }
}