import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdService } from '../../services/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AreaService } from '../../services';
import { WordService } from '../../services/word.service';
import { AreaInfo } from '../../models';
import { UserConfig } from '../../models/userConfig/userConfig';
import { Config } from '../../models/product/config';
import { ImgViewerModalComponent } from '../../businessComponent/imgView/imgViewer.modal.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { TableViewerModalComponent } from '../../businessComponent/tableView/tableView.modal.component';
import { PdfViewerModalComponent } from '../../businessComponent/pdfView/pdfViewer.modal.component';
@Component({
    selector: 'homePage',
    styleUrls: ['./homePage.scss'],
    templateUrl: 'homePage.html',
})

export class HomePageComponent implements OnInit {
    tagClassLevel: string = "tag-level1"
    public level: number;
    prodListByDataType = new Array<any>();

    makeCompany: AreaInfo = new AreaInfo();

    modalRef: BsModalRef;
    _modalRef: BsModalRef;
    lastParam: string;
    constructor(
        private _prodService: ProdService,
        private _areaService: AreaService,
        private _route: ActivatedRoute,
        private yzNgxToastyService: YzNgxToastyService,
        private modalService: BsModalService,
        private wordService: WordService
    ) { }

    ngOnInit() {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.tagClassLevel = 'tag-level' + this._areaService.level;
        // this.initMain(this._areaService.makeCompany);
        this._route.params.subscribe((params: Params) => {
            let param = window.location.href.split('/');
            this.lastParam = param[param.length - 1];
            this.initMain(params['data']);
        });
    }

    initMain(makeCompany) {
        this.prodListByDataType = new Array();
        this._areaService.getDetailByCpcode(makeCompany).subscribe(data => {
            this.makeCompany = data;
            this._prodService.getUserConfig('').then((userConfig: UserConfig) => {
                let config: Map<string, string> = new Map<string, string>();
                let model = userConfig.models.find(value => { return value.code === 'product'; });
                model.maps.forEach(map => {
                    config.set(map.key, map.value);
                });

                // this.yzNgxToastyService.wait("正在加载", "");
                let initPromiseByDataType = new Array<Promise<any>>();

                let configs: Array<Config> = JSON.parse(config.get('configs'));

                if (configs == undefined || configs.length == 0) {
                    this.yzNgxToastyService.error('未能加载配置', '', 2000);
                    return;
                }
                configs.forEach((config: Config) => {
                    let initPromiseByDataEles = new Array<Promise<any>>();
                    let prodList = new Array();
                    config.children.forEach(child => {
                        initPromiseByDataEles.push(this.initProds(prodList, config.dataType, child));
                    });
                    initPromiseByDataType.push(Promise.all(initPromiseByDataEles).then(() => {
                        this.prodListByDataType.push({ config: config, list: prodList });
                        this.prodListByDataType.sort((a, b) => a.config.id - b.config.id);
                        initPromiseByDataEles = new Array<Promise<any>>();
                    }));
                })
            });
        });
    }

    initProds(list: Array<any>, dataType, config) {
        return this._prodService.getProdList(this.makeCompany.cPCode, dataType, config.dataEles, config.dataFormat)
            .toPromise().then((metaList: Array<string>) => {
                metaList = metaList.reverse();

                this.pushProdList(0, config.count, metaList).then(prodList => {
                    let mainProdItem = {
                        config: config,
                        prodList: prodList,
                        prodMetaList: metaList
                    };
                    list.push(mainProdItem);
                    list.sort((a, b) => { return a.config.id - b.config.id })
                });
            }).catch(() => {
                let mainProdItem = {
                    config: config,
                    prodList: new Array(),
                    prodMetaList: new Array()
                };
                list.push(mainProdItem);
            });
    }

    pushProdList(begin: number, count: number, metaList: Array<any>): Promise<any> {
        let prodList = new Array<any>();
        let initPromise = new Array<Promise<any>>();
        for (let index = begin; index < begin + count; index++) {
            if (!metaList[index]) break;
            initPromise.push(this._prodService.getMetaByKey(metaList[index]).toPromise().then(meta => {
                let format = meta['name'].split('.')[1].toUpperCase();


                //计算产品结束日期
                let dataEle: string = meta['name'].split('_')[8].split('-')[0];
                let dateStr: string = meta['name'].split('_')[4];
                let date = new Date(dateStr.substring(0, 4) + "/" + dateStr.substring(4, 6) + "/" + dateStr.substring(6, 8));
                let endDate = new Date(date.getTime());
                if (dataEle.toUpperCase() == "WEEK") {
                    endDate.setTime(date.getTime() + 6 * 24 * 60 * 60 * 1000);
                } else if (dataEle.toUpperCase() == "TEND") {
                    let day = date.getDate();
                    if (day == 1) {
                        endDate.setDate(10);
                    } else if (day == 11) {
                        endDate.setDate(20);
                    } else if (day == 21) {
                        endDate.setMonth(date.getMonth() + 1);
                        endDate.setDate(0);
                    }

                } else if (dataEle.toUpperCase() == "MONT") {
                    endDate.setMonth(date.getMonth() + 1);
                    endDate.setDate(0);
                }

                let prodDateStr = dateStr == "00000000000000" ? "" : date.toLocaleDateString() + "至" + endDate.toLocaleDateString();

                let prodName = format === 'PDF' ? meta['dataElement'] + '报' : meta['dataElement'];
                let prod = {
                    num: index + 1,
                    cnName: meta['makeCompany'],
                    prodName: '【' + prodName + '】',
                    year: meta['productDate'].split('年')[0],
                    fileName: meta['name'],
                    url: this._prodService.getUrl(meta['name']),
                    thumbnail: this.getThumbnail(meta['name']),
                    date: prodDateStr,
                    info: meta['dataElement'].split('-')[1],
                    format: format,
                    dataEle: meta['name'].split('_')[8]
                };
                prodList[index] = prod;
            }));
        }

        return Promise.all(initPromise).then(() => {
            return prodList;
        });
    }

    showMoreProd(dataTypeId: number, id: number) {
        let mainProdList = this.prodListByDataType[dataTypeId].list;
        for (let index = 0; index < mainProdList.length; index++) {
            if (mainProdList[index].config.id === id) {
                this.pushProdList(mainProdList[index].prodList.length, 10, mainProdList[index].prodMetaList).then(prodList => {
                    prodList.forEach(prod => {
                        mainProdList[index].prodList.push(prod);
                    });
                });
                break;
            }
        }

    }

    imgDetail(list: Array<Object>, num) {
        let arr = new Array<{ url: string, label: string }>();
        list.forEach(img => {
            let obj = {
                url: img['url'],
                label: img['prodName']
            }
            arr.push(obj);
        });

        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent, { class: 'modal-lg img-modal-dialog' });
        this.modalRef.content.imgList = arr;
        this.modalRef.content.num = num;
        this.modalRef.content.view();
    }

    wordDetail(list: Array<Object>, num) {
        let arr = new Array<{ fileName: string, label: string }>();
        list.forEach(prod => {
            let obj = {
                fileName: prod['fileName'],
                label: prod['prodName']
            }
            arr.push(obj);
        });
        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(PdfViewerModalComponent, { class: 'modal-lg' });
        this.modalRef.content.prodList = arr;
        this.modalRef.content.num = num;
        this.modalRef.content.viewInit();
    }
    csvDetail(list: Array<Object>, num) {
        let arr = new Array<{ fileName: string, label: string }>();
        list.forEach(prod => {
            let obj = {
                fileName: prod['fileName'],
                label: prod['prodName']
            }
            arr.push(obj);
        });
        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(TableViewerModalComponent, { class: 'modal-lg csv-modal-dialog' });
        this.modalRef.content.prodList = arr;
        this.modalRef.content.num = num;
        this.modalRef.content.viewInit();
    }
    viewProd(list, dataFormat, num) {
        switch (dataFormat) {
            case 'JPG':
                this.imgDetail(list, num);
                break;
            case 'PDF':
                this.wordDetail(list, num);
                break;
            case 'CSV':
                this.csvDetail(list, num);
                break;
            default:
                break;
        }
    }
    download(list, dataFormat, num) {
        let prod = list[num];
        if (!prod) return;
        this.downloadFile(this._prodService.getUrl(prod["fileName"]), prod["prodName"], dataFormat)
    }
    downloadFile(url, fileName, type) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.setRequestHeader('Content-Type', `application/${type}`);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            if (e.target.status == 200) {
                var blob = e.target.response;
                this.downloadExportFile(blob, fileName)
            }
        }.bind(this)
        xhr.send();
    }
    downloadExportFile(blob, tagFileName) {
        let downloadElement = document.createElement('a');
        let href = blob;
        downloadElement.target = '_blank';
        if (typeof blob == 'string') {
            downloadElement.target = '_blank';
        } else {
            href = window.URL.createObjectURL(blob); //创建下载的链接
        }
        downloadElement.href = href;
        downloadElement.download = tagFileName; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        if (typeof blob != 'string') {
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }

    }
    scrollto(i) {
        document.getElementsByClassName("container")[0].scrollTo(0, document.getElementById(i).offsetTop + 10);   //锚点
    }
    getThumbnail(fileName) {
        return this._prodService.getThumbnail(fileName);
    }
    //页面刷新
    refresh() {
        this.initMain(this.lastParam);
    }
}
