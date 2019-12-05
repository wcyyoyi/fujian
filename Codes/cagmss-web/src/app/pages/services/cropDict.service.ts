import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service'
import { CropItem, CropInfo, IndexInfo, ExpEleInfo, IdxEleInfo } from '../models';

@Injectable()
export class CropDictService extends ApiService {
    total: number = 1;

    constructor(http: Http) {
        super(http);
    }

    createCrop(obj: any) {
        return this.http.post(this.data_url + '/agme/crops', obj, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);;
    }

    updateCrop(obj: any) {
        return this.http.put(this.data_url + '/agme/crops', obj, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    deleteCrop(code: string) {
        return this.http.delete(this.data_url + '/agme/crops/' + code, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    getAllCrops() {
        return this.http.get(this.data_url + '/agme/crops', this.jwt()).map((response: Response) => response.json());
    }

    getCropInfo() {
        return this.http.get(this.data_url + '/agme/crops/group', this.jwt()).map((response: Response) => response.json());
    }

    getDevInfo(cropName: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cCrop', cropName);
        options.search = filter;

        return this.http.get(this.data_url + '/agme/devs/query', options).map((response: Response) => response.json());
    }

    createDev(obj: any) {
        return this.http.post(this.data_url + '/agme/devs', obj, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    updateDev(obj: any) {
        return this.http.put(this.data_url + '/agme/devs', obj, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    deleteDev(code: string) {
        return this.http.delete(this.data_url + '/agme/devs/' + code, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    getDistInfo() {
        return this.http.get(this.data_url + '/agme/dists', this.jwt()).map((response: Response) => response.json());
    }

    getExpEleList() {
        return this.http.get(this.data_url + '/agme/exps', this.jwt()).map((response: Response) => response.json());
    }

    getExpEleByCrop(cropCode: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cCropcode', cropCode);
        options.search = filter;

        return this.http.get(this.data_url + '/agme/exps/query', options).map((response: Response) => response.json());
    }

    getExpEleByArea(areaCode: string) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('v01000', areaCode);
        options.search = filter;

        return this.http.get(this.data_url + '/agme/exps/query', options)
            .toPromise()
            .then((response: Response) => response.json());
    }

    createExpEleBatch(models: Array<ExpEleInfo>) {
        return this.http.post(this.data_url + '/agme/exps/batch', models, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);//.map((response: Response) => response.json());
    }

    updateExpEleBatch(models: Array<ExpEleInfo>) {
        return this.http.put(this.data_url + '/agme/exps/batch', models, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    deleteExpEle(id: string) {
        return this.http.delete(this.data_url + '/agme/exps/' + id, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return true;
                }
                return false;
            })
            .catch(this.handleError);
    }

    getIdxEleByExp(expIds: string[]) {
        let options: RequestOptions = this.jwt();
        let filter: URLSearchParams = new URLSearchParams();

        filter.append('cCropcode', expIds.join(","));
        options.search = filter;

        return this.http.get(this.data_url + '/agme/idxs/query', options).map((response: Response) => response.json());
    }

    createIdxEleBatch(models: Array<IdxEleInfo>) {
        return this.http.post(this.data_url + '/agme/idxs/batch', models, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);//.map((response: Response) => response.json());
    }

    updateIdxEleBatch(models: Array<IdxEleInfo>) {
        return this.http.put(this.data_url + '/agme/idxs/batch', models, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                return false;
            })
            .catch(this.handleError);
    }

    deleteIdxEle(id: string) {
        return this.http.delete(this.data_url + '/agme/idxs/' + id, this.jwt())
            .toPromise()
            .then(res => {
                if (res.status == 200) {
                    return true;
                }
                return false;
            })
            .catch(this.handleError);
    }

    public getExpEleInfoByArea(areaCode: string): Promise<Map<ExpEleInfo, IdxEleInfo[]>> {
        // Get all crop infomation by code
        let expEleMaps = new Map<ExpEleInfo, IdxEleInfo[]>();
        let expKeyMaps = new Map<string, ExpEleInfo>();

        return this.getExpEleByArea(areaCode).then(data => {
            if (!data) return;

            let expIds = new Array<string>();

            for (let expInfo of data) {
                expIds.push(expInfo.cExpcode);
                expEleMaps.set(expInfo, null);
                expKeyMaps.set(expInfo.cExpcode, expInfo);
            }
            return expIds;
        }).then(expIds => {
            return this.getIdxEleByExp(expIds).toPromise().then(idxs => {
                if (!idxs) return;

                for (let idxInfo of idxs) {
                    let fExpInfo = expKeyMaps.get(idxInfo.cExpcode);
                    if (!fExpInfo) continue;

                    let idxList = expEleMaps.get(fExpInfo);
                    if (idxList == null) {
                        idxList = new Array<IdxEleInfo>();
                        expEleMaps.set(fExpInfo, idxList);
                    }

                    idxList.push(idxInfo);
                }
                // console.log(expEleMaps);
                return expEleMaps;
            });
        });
    }

    saveCropInfo(item: CropItem, infos: CropInfo[]) {
        if (!item || !infos) return;

        let insertExpEles = new Array<ExpEleInfo>();
        let insertIdxEles = new Array<IdxEleInfo>();

        let updateExpEles = new Array<ExpEleInfo>();
        let updateIdxEles = new Array<IdxEleInfo>();

        infos.forEach(cropInfo => {
            let splitStr = "";
            let c56002 = "";
            cropInfo.varidevs.forEach(vard => {
                c56002 += splitStr + vard.desc;// vard.variCode + "-" + vard.devCode;
                splitStr = ",";
            });//cropInfo.varidevs[0].variCode

            let expInfo = new ExpEleInfo();
            if (!cropInfo.id) {
                cropInfo.id = this.getUUID("E");
                insertExpEles.push(expInfo);
            }
            else
                updateExpEles.push(expInfo);

            expInfo.cExpcode = cropInfo.id;
            expInfo.cCropcode = item.code;
            expInfo.v01000 = item.stations;
            expInfo.c56002 = c56002;
            expInfo.dStartdate = this.convertDateStr(cropInfo.start);
            expInfo.dEnddate = this.convertDateStr(cropInfo.end);
            expInfo.cAdvise = cropInfo.nadvise;
            expInfo.cDadvise = cropInfo.dadvise;

            cropInfo.dists.forEach(item => {
                let idxItem: IndexInfo = item.indexValue as IndexInfo;
                let idxInfo = new IdxEleInfo();

                if (!item.id) {
                    item.id = this.getUUID("I");
                    insertIdxEles.push(idxInfo);
                }
                else
                    updateIdxEles.push(idxInfo);

                idxInfo.cIdxcode = item.id;
                idxInfo.cExpcode = expInfo.cExpcode
                idxInfo.cDistcode = item.code;
                idxInfo.vIndextype = Number.parseInt(idxItem.type);
                idxInfo.cElecode = idxItem.eleCode;
                idxInfo.vLevel = idxItem.classes;
                idxInfo.cValuerange = JSON.stringify(idxItem.values);
                // idxInfo.cAdvise = cropInfo.dadvise;
            });

            // console.log(idxEles);
        });

        // console.log(expEles);
        let savePromise = new Array<Promise<any>>();

        if (insertExpEles.length > 0) savePromise.push(this.createExpEleBatch(insertExpEles));
        if (updateExpEles.length > 0) savePromise.push(this.updateExpEleBatch(updateExpEles));

        if (insertIdxEles.length > 0) savePromise.push(this.createIdxEleBatch(insertIdxEles));
        if (updateIdxEles.length > 0) savePromise.push(this.updateIdxEleBatch(updateIdxEles));

        return Promise.all(savePromise);
    }

    private getUUID(np: string) {
        return this.userName + "-" + new Date().getTime() + "-" + np + this.PreFixInterge(this.total++, 3);
    }

    public PreFixInterge(num, n) {
        //num代表传入的数字，n代表要保留的字符的长度  
        return (Array(n).join('0') + num).slice(-n);
    }

    private convertDateStr(strDate: string): number {
        if (strDate) {
            let strDates = strDate.split("-");
            let nMon = Number.parseInt(strDates[0]);
            let nDay = Number.parseInt(strDates[1]);

            return nMon * 100 + nDay;
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('CropDictService an error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}