import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsDatepickerConfig } from 'ngx-bootstrap';
import { SurfaceService, SHourService } from 'app/pages/services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { AgmeRealEleService } from 'app/pages/services/agmeRealEle.service';
import 'style-loader!./surf-detail.scss';
const directArr = ["北", "东北偏北", "东北", "东北偏东", "东", "东南偏东", "东南", "东南偏南", "南",
    "西南偏南", "西南", "西南偏西", "西", "西北偏西", "西北", "西北偏北"];

@Component({
    selector: 'surf-detail',
    templateUrl: 'surf-detail.html',
    providers: [SurfaceService, SHourService, AgmeRealEleService]
})

export class SurfDetailComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1'

    endDate = new Date();
    startDate = new Date(this.endDate.getTime() - 7 * 24 * 3600 * 1000);

    bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD',
    });

    v01000;
    statname: string;
    limitDays = 7;

    selEle = 'v12001';

    hourDate = new Date();
    minHourDate = new Date();
    maxHourDate = new Date();

    dayDatas = new Array();
    hourData = new Object();
    option = new Option();

    constructor(private bsModalRef: BsModalRef,
        private surfaceServ: SurfaceService,
        private yzNgxToastyService: YzNgxToastyService,
        private sHourService: SHourService,
        private agmeEleServ: AgmeRealEleService,
    ) { }

    ngOnInit() {
        this.initHourDate();
        if (this.surfaceServ.level > 1) {
            this.btnClassLevel = 'yz-btn-level' + this.surfaceServ.level;
            this.bsConfig.minDate = new Date(this.endDate.getTime() - 30 * 24 * 3600 * 1000);
        }
    }

    init(v01000, statname) {
        this.statname = statname;
        this.v01000 = v01000;

        this.onLimitDaysChange(7, null);
        this.queryHour(this.v01000);
    }

    queryDay(v01000, startDate, endDate) {
        this.yzNgxToastyService.wait("正在查询...");
        let id = this.yzNgxToastyService.getToastData().id;
        return this.surfaceServ.getByFilter(v01000, startDate, endDate).toPromise().then(datas => {
            this.yzNgxToastyService.closeById(id);
            if (!datas || datas.length <= 0) {
                this.yzNgxToastyService.warning("该日期无数据！", '', 2000);
                this.dayDatas = new Array();
            } else {
                this.dayDatas = datas;
            }
        })
    }

    queryHour(v01000) {
        let id = this.yzNgxToastyService.getToastData().id;
        return this.sHourService.getByFilter(v01000, this.hourDate, this.hourDate).toPromise().then(datas => {
            this.yzNgxToastyService.closeById(id);
            if (!datas || datas.length <= 0) {
                this.yzNgxToastyService.warning("该时间无数据！", '', 2000);
                this.hourData = null;
            } else {
                this.hourData = datas[0];
                if (this.hourData['v11001']) {
                    this.hourData['wind'] = this.windDirectionSwitch(this.hourData['v11001']);
                    document.getElementById('wind').style.transform = 'rotate(' + this.hourData['v11001'] + 'deg)';
                }

                if (this.hourData['v20003']) {
                    this.agmeEleServ.getNameByCode(this.hourData['v20003'], '天气现象').toPromise().then(agmeEle => {
                        this.hourData['weathor'] = agmeEle ? agmeEle.cName : this.hourData['v20003'];
                    }).catch(() => {
                        this.hourData['weathor'] = this.hourData['v20003'];
                    });
                } else {
                    this.hourData['weathor'] = '无'
                }
            }
        })
    }

    customQueryDay() {
        this.queryDay(this.v01000, this.startDate, this.endDate).then(() => {
            this.render();
        });
    }

    plusHour(hour: number) {
        if (this.hourDate.getTime() <= this.minHourDate.getTime() && hour < 0) {
            this.yzNgxToastyService.warning('只能查看近24小时的数据！', '', 2000);
            return;
        }

        if (this.hourDate.getTime() >= this.maxHourDate.getTime() && hour > 0) {
            this.yzNgxToastyService.warning('不能超过当前时间！', '', 2000);
            return;
        }
        this.hourDate.setTime(this.hourDate.getTime() + hour * 3600 * 1000);
        this.queryHour(this.v01000)
    }


    initHourDate() {
        this.hourDate.setMinutes(0, 0, 0);
        this.minHourDate.setTime(this.hourDate.getTime() - 24 * 3600 * 1000);
        this.maxHourDate.setTime(this.hourDate.getTime());
    }

    onEleChange(e) {
        this.selEle = e.target.value;
        this.render();
    }

    onLimitDaysChange(limitDays, e) {
        let div = document.getElementById('dateLimit-choose');
        let buttons = div.getElementsByTagName('button');
        for (let index = 0; index < buttons.length; index++) {
            buttons.item(index).className = 'col-4';
        }

        if (e) {
            e.target.className = 'col-4 active';
        } else {
            buttons.item(0).className = 'col-4 active';
        }


        this.limitDays = limitDays;

        let endDate = new Date();
        let startDate = new Date();
        startDate.setTime(endDate.getTime() - this.limitDays * 24 * 3600 * 1000);
        this.queryDay(this.v01000, startDate, endDate).then(() => {
            this.render();
        });
    }

    render() {
        let option;
        switch (this.selEle) {
            case 'v12001':
                option = this.renderV12001();
                break;
            case 'v13201':
                option = this.renderV13201();
                break;
            case 'v14032':
                option = this.renderV14032();
                break;
            case 'v11002':
                option = this.renderV11002();
                break;

            default:
                break;
        }
        this.option = option;
    }

    renderV12001() {
        let option = {
            title: {
                text: '过去' + this.limitDays + '天气温变化',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let str = (params[0] ? params[0].axisValue : '') + '</br>';
                    params.forEach(param => {
                        str = str + param.seriesName + ' : ' + param.value + '°C</br>'
                    });
                    return str;
                }
            },
            legend: {
                data: ['最高气温', '最低气温', '平均气温']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                },
                min: (value) => {
                    return Math.floor(value.min) - 2;
                }
            },
            series: [
                {
                    name: '最高气温',
                    type: 'line',
                    data: [],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: '最低气温',
                    type: 'line',
                    data: [],
                    label: { formatter: '{value} °C' },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: '平均气温',
                    type: 'line',
                    data: [],
                    label: { formatter: '{value} °C' },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ]
        };

        this.dayDatas.forEach(data => {
            option.xAxis.data.push(data.v04002 + '月' + data.v04003 + '日');
            option.series[0].data.push(data['v12052'] / 10);
            option.series[1].data.push(data['v12053'] / 10);
            option.series[2].data.push(data['v12001'] / 10);
        });
        return option;
    }

    renderV13201() {
        let option = {
            title: {
                text: '过去' + this.limitDays + '天降水量变化',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let str = (params[0] ? params[0].axisValue : '') + '</br>';
                    params.forEach(param => {
                        str = str + param.seriesName + ' : ' + param.value + 'mm</br>'
                    });
                    return str;
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} mm'
                },
                min: (value) => {
                    return Math.floor(value.min);
                }
            },
            color: ['blue'],
            series: [
                {
                    name: '降水量',
                    type: 'line',
                    data: [],
                    label: { formatter: '{value} mm' },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ]
        };

        this.dayDatas.forEach(data => {
            option.xAxis.data.push(data.v04002 + '月' + data.v04003 + '日');
            option.series[0].data.push(data['v13201'] / 10);
        });
        return option;
    }

    renderV11002() {
        let option = {
            title: {
                text: '过去' + this.limitDays + '天风速变化',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let str = (params[0] ? params[0].axisValue : '') + '</br>';
                    params.forEach(param => {
                        str = str + param.seriesName + ' : ' + param.value + 'm/s</br>'
                    });
                    return str;
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} m/s'
                },
                min: (value) => {
                    return Math.floor(value.min);
                }
            },
            color: ['gray'],
            series: [
                {
                    name: '风速',
                    type: 'line',
                    label: { formatter: '{value} m/s' },
                    data: [],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    },
                    lineStyle: {
                        color: 'gray'
                    }
                }
            ]
        };

        this.dayDatas.forEach(data => {
            option.xAxis.data.push(data.v04002 + '月' + data.v04003 + '日');
            option.series[0].data.push(data['v11002'] / 10);
        });
        return option;
    }

    renderV14032() {
        let option = {
            title: {
                text: '过去' + this.limitDays + '天光照变化',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let str = (params[0] ? params[0].axisValue : '') + '</br>';
                    params.forEach(param => {
                        str = str + param.seriesName + ' : ' + param.value + 'hr</br>'
                    });
                    return str;
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} hr'
                },
                min: (value) => {
                    return Math.floor(value.min);
                }
            },
            color: ['orange'],
            series: [
                {
                    name: '光照',
                    type: 'line',
                    data: [],
                    label: { formatter: '{value} hr' },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ]
        };

        this.dayDatas.forEach(data => {
            option.xAxis.data.push(data.v04002 + '月' + data.v04003 + '日');
            option.series[0].data.push(data['v14032'] / 10);
        });
        return option;
    }

    windDirectionSwitch(degrees: number) {
        let index = 0;
        if (348.75 <= degrees && degrees <= 360) {
            index = 0;
        } else if (0 <= degrees && degrees <= 11.25) {
            index = 0;
        } else if (11.25 < degrees && degrees <= 33.75) {
            index = 1;
        } else if (33.75 < degrees && degrees <= 56.25) {
            index = 2;
        } else if (56.25 < degrees && degrees <= 78.75) {
            index = 3;
        } else if (78.75 < degrees && degrees <= 101.25) {
            index = 4;
        } else if (101.25 < degrees && degrees <= 123.75) {
            index = 5;
        } else if (123.75 < degrees && degrees <= 146.25) {
            index = 6;
        } else if (146.25 < degrees && degrees <= 168.75) {
            index = 7;
        } else if (168.75 < degrees && degrees <= 191.25) {
            index = 8;
        } else if (191.25 < degrees && degrees <= 213.75) {
            index = 9;
        } else if (213.75 < degrees && degrees <= 236.25) {
            index = 10;
        } else if (236.25 < degrees && degrees <= 258.75) {
            index = 11;
        } else if (258.75 < degrees && degrees <= 281.25) {
            index = 12;
        } else if (281.25 < degrees && degrees <= 303.75) {
            index = 13;
        } else if (303.75 < degrees && degrees <= 326.25) {
            index = 14;
        } else if (326.25 < degrees && degrees < 348.75) {
            index = 15;
        }
        return directArr[index];
    }
}
