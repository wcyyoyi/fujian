import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ProdService } from '../../services/product.service';
import { ActivatedRoute, Params } from '@angular/router';

// import 'style-loader!./prodList.scss';

const TEND = ['上旬', '中旬', '下旬'];
@Component({
    selector: 'prodList',
    templateUrl: 'prodList.html',
    styleUrls: ['prodList.scss']
})

export class ProdListComponent implements OnInit {
    prodList = new Array();
    public level: number;

    @Input()
    year: number = 2018;
    prodCount: number = 12;

    dataType: string = '';
    dataEle: string = '';

    yearList = new Array<number>();

    initProd;

    @Output()
    onProdChange = new EventEmitter<any>();


    constructor(private _prodService: ProdService, private _route: ActivatedRoute, ) { }

    ngOnInit() {
        this.level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]["themeLevel"];
        this._route.params.subscribe((params: Params) => {
            let type = params['data'].split(',');
            this.dataType = type[0];
            this.dataEle = type[1];
            this.getYearList();
            this.onYearChange(this.year);
        });
    }

    onYearChange(event) {
        this.prodList = new Array();
        this.year = event;
        let today = new Date();
        switch (this.dataEle) {
            case 'MONT':
                if (this.year === today.getFullYear()) {
                    this.prodCount = today.getMonth();
                } else {
                    this.prodCount = 12;
                }
                break;

            case 'TEND':
                if (this.year === today.getFullYear()) {
                    // let day = Math.floor((today.getDate() - 1) / 10) > 2 ? 2 : Math.floor((today.getDate() - 1) / 10);
                    let tend = 3;
                    if (today.getDate() > 0 && today.getDate() < 11) {
                        tend = 1;
                    } else if (today.getDate() >= 11 && today.getDate() < 21) {
                        tend = 2;
                    }
                    this.prodCount = today.getMonth() * 3 + tend - 1;
                } else {
                    this.prodCount = 36;
                }
                break;
            case 'WEEK':
                let lastDate;
                if (this.year === today.getFullYear()) {
                    lastDate = today;
                } else {
                    let lastDay = new Date(this.year + "/12/31").getDay();
                    if (lastDay == 4) {
                        lastDate = new Date(this.year + "/12/31");
                    } else if (lastDay < 4) {
                        let addNextDay = 5 - lastDay - 1;
                        lastDate = new Date((this.year + 1) + "/1/" + addNextDay).getTime() > today.getTime() ? today : new Date((this.year + 1) + "/1/" + addNextDay);
                    } else {
                        let addNextDay = lastDay - 5 + 4;
                        lastDate = new Date((this.year + 1) + "/1/" + addNextDay).getTime() > today.getTime() ? today : new Date((this.year + 1) + "/1/" + addNextDay);
                    }
                }
                let newDate = new Date(this.year + "/1/1");
                let firstDate = newDate.getDay();
                let dayCount;
                if (firstDate == 5) {
                    dayCount = Math.floor((lastDate.getTime() - newDate.getTime()) / 1000 / 60 / 60 / 24)
                    this.prodCount = this.year == today.getFullYear() ? Math.floor(dayCount / 7) : Math.ceil(dayCount / 7);
                } else {
                    let addDay = 5 - firstDate + 1
                    let newFirstFri = this.year + "/1/" + addDay;
                    let addDate = new Date(newFirstFri)
                    dayCount = Math.floor((lastDate.getTime() - addDate.getTime()) / 1000 / 60 / 60 / 24)
                    this.prodCount = this.year == today.getFullYear() ? Math.floor(dayCount / 7) : Math.ceil(dayCount / 7);
                }
                break;
            default:
                break;
        }
        this.getListByDataType(this.prodList, this.dataType, this.dataEle, 'pdf');

    }

    getListByDataType(list: Array<Object>, dataType, dateEle, dataFormat) {
        this._prodService.getMeta(this._prodService.makeCompany, dataType, dateEle, dataFormat).toPromise().then(metaList => {
            metaList = this.sort(metaList, 'name');
            switch (this.dataEle) {
                case 'MONT':
                    this.setMontList(list, metaList); break;
                case 'TEND':
                    this.setTendList(list, metaList); break;
                case 'WEEK':
                    this.setWeekList(list, metaList); break;
                default:
                    this.setAwfcList(list, metaList); break;
            };
            list.forEach(item => {
                item["active"] = false;
            })
            
            let arr = list.filter(item => item['isIssue'] == true);

            if (this.year == new Date().getFullYear()) {
                if (arr.length == 0) {
                    list[list.length - 1]['active'] = true;
                    this.initProd = list[list.length - 1];
                    this.onProdChange.emit(list[list.length - 1]);
                    return;
                }
                for (let index = list.length - 1; index >= 0; index--) {
                    if (list[index]['isIssue']) {
                        list[index]['active'] = true;
                        this.initProd = list[index];
                        this.onProdChange.emit(list[index]);
                        return;
                    }
                }
            } else {
                if (arr.length == 0) {
                    list[0]['active'] = true;
                    this.initProd = list[0];
                    this.onProdChange.emit(list[0]);
                    return;
                }
                for (let index = list.length - 1; index >= 0; index--) {
                    if (list[index]['isIssue']) {
                        list[index]['active'] = true;
                        this.initProd = list[index];
                        this.onProdChange.emit(list[index]);
                        return;
                    }
                }
            }
        }).catch(err => {
            switch (this.dataEle) {
                case 'MONT':
                    this.setMontList(list, new Array()); break;
                case 'TEND':
                    this.setTendList(list, new Array()); break;
                case 'WEEK':
                    this.setWeekList(list, new Array()); break;
                default:
                    this.setAwfcList(list, new Array()); break;
            }
            list[list.length - 1]['active'] = true;
            this.initProd = list[list.length - 1];
            this.onProdChange.emit(list[list.length - 1]);
        });
    }

    setMontList(list, metaList) {
        for (let i = 0; i < this.prodCount; i++) {
            let prod;
            let isExist = false;
            for (let j = 0; j < metaList.length; j++) {
                isExist = false;
                let fileName: string = metaList[j]['name'];
                let fileNameArr: Array<string> = fileName.split('_');
                let dateStr: string = fileNameArr[4];
                let prodDay = Number(dateStr.slice(6, 8));
                let prodMonth = Number(dateStr.slice(4, 6));
                let prodYear = Number(dateStr.slice(0, 4));
                if (prodMonth === i + 1 && prodYear === this.year) {
                    prod = {
                        cnName: metaList[j]['makeCompany'] + prodMonth + '月报文',
                        fileName: metaList[j]['name'],
                        productDate: dateStr,
                        day: prodDay,
                        month: prodMonth,
                        year: prodYear,
                        dataType: fileNameArr[7],
                        dataElement: fileNameArr[8],
                        isIssue: true
                    };
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                let month = i + 1;
                prod = {
                    cnName: i + 1 + '月未发布报文',
                    fileName: '',
                    productDate: this.year + '' + (month >= 10 ? month : '0' + month) + '01000000',
                    day: 1,
                    month: month,
                    year: this.year,
                    dataType: this.dataType,
                    dataElement: this.dataEle,
                    isIssue: false
                };
            }
            list.push(prod);
        }
    }

    setTendList(list, metaList) {
        for (let i = 0; i < this.prodCount; i++) {
            let prod;
            let isExist = false;
            for (let j = 0; j < metaList.length; j++) {
                isExist = false;
                let fileName: string = metaList[j]['name'];
                let fileNameArr: Array<string> = fileName.split('_');
                let dateStr: string = fileNameArr[4];
                let prodDay = Number(dateStr.slice(6, 8));
                let prodMonth = Number(dateStr.slice(4, 6));
                let prodYear = Number(dateStr.slice(0, 4));
                let tend = 3;
                if (prodDay > 0 && prodDay < 11) {
                    tend = 1;
                } else if (prodDay >= 11 && prodDay < 21) {
                    tend = 2;
                }
                let prodTend = (prodMonth - 1) * 3 + tend;

                if (prodTend === i + 1 && prodYear === this.year) {
                    prod = {
                        cnName: metaList[j]['makeCompany'] + prodMonth + '月' + TEND[tend - 1] + '报文',
                        fileName: metaList[j]['name'],
                        productDate: dateStr,
                        day: prodDay,
                        month: prodMonth,
                        year: prodYear,
                        dataType: fileNameArr[7],
                        dataElement: fileNameArr[8],
                        isIssue: true
                    };
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                let tendDay = (i % 3) * 10 + 1;
                let month = Math.floor(i / 3 + 1);
                prod = {
                    cnName: Math.floor(i / 3 + 1) + '月' + TEND[i % 3] + '未发布报文',
                    fileName: '',
                    productDate: this.year + '' + (month >= 10 ? month : '0' + month) + '' + (tendDay >= 10 ? tendDay : '0' + tendDay) + '000000',
                    day: (i % 3) * 10 + 1,
                    month: month,
                    year: this.year,
                    dataType: this.dataType,
                    dataElement: this.dataEle,
                    isIssue: false
                };
            }
            list.push(prod);
        }
    }
    setWeekList(list, metaList) {
        let firstDayOfYear = new Date(this.year + "/1/1");
        let firstFridayOfYear = new Date(this.year + "/1/1");
        firstFridayOfYear.setDate(firstDayOfYear.getDate() + 5 - firstDayOfYear.getDay());

        for (let i = 0; i < this.prodCount; i++) {
            let prod;
            let isExist = false;
            let week = i + 1; //显示当前的周数
            let clientDate = new Date();
            clientDate.setTime(firstDayOfYear.getTime());
            clientDate.setDate(firstFridayOfYear.getDate() + 7 * i);
            let endWeekDay = new Date(clientDate.getTime() + 6 * 24 * 60 * 60 * 1000);//周结束的日期

            let prodDateStr = clientDate.getFullYear() + "" + ((clientDate.getMonth()+1) < 10 ? "0" + (clientDate.getMonth()+1) : (clientDate.getMonth()+1)) + (clientDate.getDate() < 10 ? "0" + clientDate.getDate() : clientDate.getDate()) + "000000";

            for (let j = 0; j < metaList.length; j++) {
                let fileName: string = metaList[j]['name'];
                let fileNameArr: Array<string> = fileName.split('_');
                let dateStr: string = fileNameArr[4];
                let prodDay = Number(dateStr.slice(6, 8));
                // let prodMonth = Number(dateStr.slice(4, 6));
                let prodYear = Number(dateStr.slice(0, 4));
                if (prodYear === this.year && dateStr == prodDateStr) {
                    prod = {
                        cnName: metaList[j]['makeCompany'] + "第" + week + '周(' + clientDate.toLocaleDateString() + '~' + endWeekDay.toLocaleDateString() + ')报文',
                        fileName: metaList[j]['name'],
                        productDate: prodDateStr,
                        day: prodDay,
                        // month: prodMonth,
                        year: prodYear,
                        dataType: fileNameArr[7],
                        dataElement: fileNameArr[8],
                        isIssue: true
                    }
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                prod = {
                    cnName: '第' + week + '周(' + clientDate.toLocaleDateString() + '~' + endWeekDay.toLocaleDateString() + ')未发布报文',
                    fileName: '',
                    productDate: prodDateStr,
                    day: clientDate.getDate(),
                    month: clientDate.getMonth() + 1,
                    year: this.year,
                    dataType: this.dataType,
                    dataElement: this.dataEle,
                    isIssue: false
                };
            }
            list.push(prod);
        }
    }

    setAwfcList(list, metaList) {
        for (let i = 0; i < metaList.length; i++) {
            let prod;
            let fileName: string = metaList[i]['name'];
            let fileNameArr: Array<string> = fileName.split('_');
            let dateStr: string = fileNameArr[4];
            let prodDay = Number(dateStr.slice(6, 8));
            let prodMonth = Number(dateStr.slice(4, 6));
            let prodYear = Number(dateStr.slice(0, 4));
            if (prodYear === this.year) {
                prod = {
                    cnName: metaList[i]['makeCompany'] + prodMonth + '月' + prodDay + '日' + metaList[i]['dataElement'] + '报文',
                    fileName: metaList[i]['name'],
                    productDate: metaList[i]['productDate'],
                    day: prodDay,
                    month: prodMonth,
                    year: prodYear,
                    dataType: fileNameArr[7],
                    dataElement: fileNameArr[8]
                };
                list.push(prod);
            }
        }
        let date = new Date();
        // date.setDate(date.getDate() + 1);
        // 无产品或最新一期产品时间不等于当前日期时添加新建报文
        if (list.length <= 0 || !(date.getFullYear() === list[0].year && date.getMonth() + 1 === list[0].month && date.getDate() === list[0].day)) {
            let newProd = {
                cnName: '新建报文',
                fileName: '',
                productDate: '00000000000000',
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: this.year,
                dataType: this.dataType,
                dataElement: this.dataEle
            };
            list.push(newProd);
        }
    }

    selProd(item) {
        this.prodList.forEach(ele => {
            ele.active = false;
        });
        item.active = true;
        this.onProdChange.emit(item);
    }

    sort(list: Array<string>, field: string) {
        let newList = new Array();
        list.forEach(item => {
            newList.push(item[field]);
        });
        newList = newList.sort().reverse();
        let resultList = new Array();
        newList.forEach(item => {
            for (let i = 0; i < list.length; i++) {
                if (list[i][field] === item) {
                    resultList.push(list[i]);
                    continue;
                }
            }
        });
        return resultList;
    }

    getYearList() {
        this.yearList = new Array<number>();
        let startDate = new Date(2014, 0, 1);
        let endDate = new Date();
        for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
            this.yearList.push(i);
        }
        this.year = endDate.getFullYear();
    }
}