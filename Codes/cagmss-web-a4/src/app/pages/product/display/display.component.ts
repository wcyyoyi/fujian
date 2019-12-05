import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProdService } from '../../services/product.service';
import { BsModalService, BsModalRef, TabsetComponent } from 'ngx-bootstrap';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { WordService } from '../../services/word.service';
import { AreaService } from '../../services';
import { DisplayMenu } from '../../models/product/displayMenu';
import { ImgViewerModalComponent } from '../../businessComponent/imgView/imgViewer.modal.component';
import { AreaInfo } from '../../models';
// import 'style-loader!./disPlay.scss';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BaGrid } from 'app/theme/components';
import { WordViewerModalComponent } from '../../businessComponent/wordView/wordViewer.modal.component';

import * as menuJson from 'assets/prodDisplay/menu.json';
import { TableViewerModalComponent } from 'app/pages/businessComponent/tableView/tableView.modal.component';
import { ComponentResolver } from 'ag-grid/dist/lib/components/framework/componentResolver';
const menu = (<any>menuJson);

@Component({
    selector: 'display',
    templateUrl: 'display.html',
    styleUrls: ['./disPlay.scss'],
    
})

export class Display implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    radiolabelClassLevel: string = "radio-label-level1";
    croplistClassLevel: string = 'crop-list-level1'
    makeCompany;
    makeComList = new Array<AreaInfo>();

    settings = new Array();
    source = new Array();

    prodList;
    imgList;

    wordProdMenus: DisplayMenu;
    imgProdMenus: DisplayMenu;
    tableProdMenus: DisplayMenu;

    prodDataType = '.*';
    prodDataEleArr = ['.*'];
    imgDataType = '.*';
    imgDataEleArr = ['.*'];
    csvDataType = '.*';
    csvDataEleArr = ['.*'];

    @ViewChild('tabset') tabset: TabsetComponent;
    public value: string;
    modalRef: BsModalRef;
    constructor(
        private wordService: WordService,
        private _route: ActivatedRoute,
        private _prodService: ProdService,
        private _areaService: AreaService,
        private modalService: BsModalService,
        private yzNgxToastyService: YzNgxToastyService
    ) { }
    @ViewChild('grid') grid: BaGrid

    ngOnInit() {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.croplistClassLevel = 'crop-list-level' + this._areaService.level;
        this.radiolabelClassLevel = 'radio-label-level' + this._areaService.level;
        this.setSettings();
        // this.grid.initFieldGrid(this.settings);

        this.wordProdMenus = menu.wordProdMenus;
        this.imgProdMenus = menu.imgProdMenus;
        this.tableProdMenus = menu.tableProdMenus;
        this.tabset.tabs.forEach((tab) => {
            tab.select.subscribe((e) => {
                this.onSelect(e);
            })
        })
        this._route.params.subscribe((params: Params) => {
            this._areaService.getDetailByCpcode(params['data']).subscribe(data => {
                this.makeCompany = data;
                this.makeNav();
            });

        });
    }
    onSelect(data: TabDirective) {
        this.value = data.heading;
        this.source = new Array();
    }
    makeNav() {
        this._areaService.getByFilter(parseInt(this._areaService.areaCode), this._areaService.level).then(data => {
            //无论level是几都需要将福建省先放入到makeComList中
            if (this._areaService.level == 1) {
                this.makeComList.push(data[0])
            } else if (this._areaService.level == 2) {
                let data = this._areaService.getParentByCCode(this._areaService.areaCode, this._areaService.level)
                this.makeComList.push(data)
            } else {
                let data = this._areaService.getParentByCCode(this._areaService.areaCode, this._areaService.level)
                let counData = this._areaService.getParentByCCode(data["cCode"], data["vLevel"])
                this.makeComList.push(counData)
            }
            //根据level决定再加入几个
            if (this.makeCompany["vLevel"] == 1) {

            } else if (this.makeCompany["vLevel"] == 2) {
                this.makeComList.push(this.makeCompany)
            } else {
                let code = this.makeCompany["cPCode"].substr(0, 3)
                this._areaService.getByFilter(3).then(datas => {
                    datas.forEach(element => {
                        if (code == element["cPCode"].substr(0, 3) && element["vLevel"] == 2) {
                            this.makeComList.push(element);
                            this.makeComList.push(this.makeCompany)
                        }
                    });
                })
            }

        })
    }

    changeChecked(event) {
        if (event.target.type === 'checkbox' && event.target.value.indexOf('.*') > -1 && event.target.checked) {
            let obj = document.getElementsByName(event.target.name);
            for (let i = 1; i < obj.length; i++) {
                obj[i]['checked'] = false;
            }
        } else if (event.target.type === 'checkbox' && event.target.value !== '.*' && event.target.checked) {
            let obj = document.getElementsByName(event.target.name);
            obj[0]['checked'] = false;
        }
    }

    createElements(item, childId, dataFormat, prod) {
        if (this.value == '文字产品') {
            this.prodDataEleArr = new Array();
            if (prod === 'dataType') {
                this.prodDataType = item.value;
            } else if (prod === 'dataEle') {
                let obj = document.getElementsByName(childId + dataFormat + 'Name');
                for (let i = 0; i < obj.length; i++) {
                    if (obj[i]['checked']) {
                        this.prodDataEleArr.push(obj[i]['value']);
                    }
                }
            }
        } else if (this.value == '图片产品') {
            this.imgDataEleArr = new Array();
            if (prod === 'dataType') {
                this.imgDataType = item.value;
            } else if (prod === 'dataEle') {
                let obj = document.getElementsByName(childId + dataFormat + 'Name');
                for (let i = 0; i < obj.length; i++) {
                    if (obj[i]['checked']) {
                        this.imgDataEleArr.push(obj[i]['value']);
                    }
                }
            }
        } else {
            this.csvDataEleArr = new Array();
            if (prod === 'dataType') {
                this.csvDataType = item.value;
            } else if (prod === 'dataEle') {
                let obj = document.getElementsByName(childId + dataFormat + 'Name');
                for (let i = 0; i < obj.length; i++) {
                    if (obj[i]['checked']) {
                        this.csvDataEleArr.push(obj[i]['value']);
                    }
                }
            }
        }
        if (prod === 'dataType') {
            this.prodDataType = item.value;

        } else if (prod === 'dataEle') {
            this.prodDataEleArr = new Array();
            let obj = document.getElementsByName(childId + dataFormat + 'Name');
            for (let i = 0; i < obj.length; i++) {
                if (obj[i]['checked']) {
                    this.prodDataEleArr.push(obj[i]['value']);
                }
            }
        }

        let div = document.getElementById(childId + dataFormat);
        div.className = 'w-100';
        div.innerHTML = ``;

        // this.search();

        if (!item.children) {
            return;
        }

        let rowDiv = document.createElement('div');
        rowDiv.className = 'row align-items-center';
        rowDiv.style.margin = '20px 0px'

        let childDiv = document.createElement('div');
        childDiv.id = item.children.id + dataFormat;

        let eleLabel = document.createElement('label');
        eleLabel.className = 'col-md-2 control-label';
        eleLabel.innerHTML = item.children.title;

        let elesDiv = document.createElement('div');
        elesDiv.className = 'col-md-10';

        item.children.elements.forEach((element, index) => {
            let eleDiv = document.createElement('div');
            eleDiv.className = 'float-left w-30';

            let eleInput = document.createElement('input');
            eleInput.type = item.children.type;
            eleInput.value = element.value;
            // eleInput.checked = index === 0;
            eleInput.checked = false;
            eleInput.name = item.children.id + dataFormat + 'Name';
            eleInput.addEventListener('click', (e) => {
                // this.changeChecked(e);
                this.createElements(element, item.children.id, dataFormat, 'dataEle');
            });

            let eleSpan = document.createElement('span');
            eleSpan.innerHTML = element.label;

            let eleLabel = document.createElement('label');
            eleLabel.className = "radio-label radio-label-level" + this._areaService.level;

            eleLabel.appendChild(eleInput);
            eleLabel.appendChild(eleSpan);
            eleDiv.appendChild(eleLabel);
            elesDiv.appendChild(eleDiv);
        });


        rowDiv.appendChild(eleLabel);
        rowDiv.appendChild(elesDiv);
        rowDiv.appendChild(document.createElement('hr'));
        rowDiv.appendChild(childDiv);
        div.appendChild(rowDiv);
    }
    wordSearch(wordDataType, wordDataEle, wordDataFormat) {
        if (wordDataEle === '') {
            // return;
            wordDataEle = '.*';
        }
        this.openLoading();
        this._prodService.getProdList(this.makeCompany.cPCode, wordDataType, wordDataEle, wordDataFormat).toPromise().then(metaList => {
            let initPromise = new Array<Promise<any>>();
            let prodList = new Array();
            for (let i = 0; i < metaList.length; i++) {
                initPromise.push(this._prodService.getMetaByKey(metaList[i]).toPromise().then(meta => {
                    let cnName = meta['dataElement'].split('-')[0] === '' ? meta['dataType'] + '产品' : meta['desc'];
                    let prod = {
                        num: i + 1,
                        cnName: meta['makeCompany'] + cnName + (wordDataType == 'WCRM' ? '报' : '专报'),
                        fileName: meta['name'],
                        url: this._prodService.getUrl(meta['name']),
                        date: meta['productDate'],
                        info: meta['dataElement'].split('-')[1],
                        format: wordDataFormat
                    };
                    prodList.push(prod);
                }));

            }
            Promise.all(initPromise).then(() => {
                this.source = prodList.sort((a, b) => { return a.num - b.num });
                this.closeLoading();
                this.yzNgxToastyService.success('查询成功', '查询成功，共查询到' + prodList.length + '条结果', 3000);
            }).catch(() => {
                this.source = new Array();
                this.closeLoading();
                this.yzNgxToastyService.error('查询失败，没有对应产品', '', 3000);
            });
        }).catch(err => {
            this.source = new Array();
            this.closeLoading();
            this.yzNgxToastyService.error('查询失败，没有对应产品', '', 3000);
        });
    }

    csvSearch(csvDataType, csvDataEle, csvDataFormat) {
        if (csvDataEle === '') {
            csvDataEle = '.*';
        }
        this.openLoading();
        this._prodService.getProdList(this.makeCompany.cPCode, csvDataType, csvDataEle, csvDataFormat).toPromise().then(metaList => {
            let initPromise = new Array<Promise<any>>();
            let prodList = new Array();
            for (let i = 0; i < metaList.length; i++) {
                initPromise.push(this._prodService.getMetaByKey(metaList[i]).toPromise().then(meta => {
                    let cnName = meta['dataElement'].split('-')[0] === '' ? meta['dataType'] + '产品' : meta['desc'];
                    let prod = {
                        num: i + 1,
                        cnName: meta['makeCompany'] + cnName,
                        fileName: meta['name'],
                        url: this._prodService.getUrl(meta['name']),
                        date: meta['productDate'],
                        info: meta['dataElement'].split('-')[1],
                        format: csvDataFormat
                    };
                    prodList.push(prod);
                }));

            }
            Promise.all(initPromise).then(() => {
                this.source = prodList.sort((a, b) => { return a.num - b.num });
                this.closeLoading();
                this.yzNgxToastyService.success('查询成功', '查询成功，共查询到' + prodList.length + '条结果', 3000);
            }).catch(() => {
                this.source = new Array();
                this.closeLoading();
                this.yzNgxToastyService.error('查询失败，没有对应产品', '', 3000);
            });
        }).catch(err => {
            this.source = new Array();
            this.closeLoading();
            this.yzNgxToastyService.error('查询失败，没有对应产品', '', 3000);
        });
    }


    imgSearch(imgDataType, imgDataEle, imgDataFormat) {
        if (imgDataEle === '') {
            // return;
            imgDataEle = '.*';
        }
        this.openLoading();
        this._prodService.getMeta(this.makeCompany.cPCode, imgDataType, imgDataEle, imgDataFormat).toPromise().then(metaList => {
            this.imgList = new Array();
            for (let i = 0; i < metaList.length; i++) {
                let prod = {
                    num: i + 1,
                    cnName: metaList[i]['desc'],
                    fileName: metaList[i]['name'],
                    url: this._prodService.getUrl(metaList[i]['name'])
                };
                this.imgList.push(prod);
            }
            this.closeLoading();
            this.yzNgxToastyService.success('查询成功', '查询成功，共查询到' + this.imgList.length + '条结果', 3000);
        }).catch(err => {
            this.imgList = new Array();
            this.closeLoading();
            this.yzNgxToastyService.error('查询失败，没有对应产品', '', 3000);
        });
    }


    imgDetail(num) {
        let arr = new Array<{ url: string, label: string }>();
        this.imgList.forEach(img => {
            let obj = {
                url: img.url,
                label: img.cnName
            }
            arr.push(obj);
        });

        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(ImgViewerModalComponent, { class: 'modal-lg img-modal-dialog' });
        this.modalRef.content.imgList = arr;
        this.modalRef.content.num = num - 1;
        this.modalRef.content.view();
    }

    setSettings() {
        this.settings = new Array();
        this.settings = [
            {
                headerName: '序号',
                field: "num",
            },
            {
                headerName: '文件名',
                field: "cnName",

            },
            {
                headerName: '操作',
                cellRenderer: "customComponent",
                cellRendererParams: [
                    {
                        value: '查看',
                        callBackFunction: (prod) => {
                            if (prod.format.toLocaleUpperCase() == 'PDF') {
                                this.htmlDetail(prod)
                            } else if (prod.format.toLocaleUpperCase() == 'CSV') {
                                this.csvDetail(prod)
                            }
                        }
                    },
                    {
                        value: '下载',
                        callBackFunction: (prod) => this.download(prod)
                    },
                ]
            },

        ]
    }

    changeShade(value) {
        if (document.getElementById('shade') === null) return;
        if (value) {
            document.getElementById('shade').style.display = 'block';
        } else {
            document.getElementById('shade').style.display = 'none';

        }
    }

    closeLoading() {
        this.yzNgxToastyService.close();
        this.changeShade(false)
    }

    openLoading() {
        this.yzNgxToastyService.wait("正在查询，请稍后…", "");
        this.changeShade(true);
    }

    htmlDetail(prod) {
        let arr = new Array<{ fileName: string, label: string }>();
        this.source.forEach(prod => {
            let obj = {
                fileName: prod['fileName'],
                label: prod['cnName']
            }
            arr.push(obj);
        });

        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(WordViewerModalComponent, { class: 'modal-lg' });
        this.modalRef.content.prodList = arr;
        this.modalRef.content.num = prod.num - 1;
        this.modalRef.content.viewInit();
    }

    csvDetail(prod) {
        let arr = new Array<{ fileName: string, label: string }>();
        this.source.forEach(prod => {
            let obj = {
                fileName: prod['fileName'],
                label: prod['cnName']
            }
            arr.push(obj);
        });
        this.modalService.config.ignoreBackdropClick = true;
        this.modalRef = this.modalService.show(TableViewerModalComponent, { class: 'modal-lg csv-modal-dialog' });
        this.modalRef.content.prodList = arr;
        this.modalRef.content.num = prod.num - 1;
        this.modalRef.content.viewInit();
    }

    download(prod) {
        let paramArr = prod["fileName"].split("_");
        let dataType = paramArr[7];
        let dataEleCode = paramArr[8];
        let productDate = prod["date"];
        let url = this.wordService.downloadByIssue(dataType, dataEleCode, productDate);
        window.open(url);
    }
}
