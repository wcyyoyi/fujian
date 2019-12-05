import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ANALS_MENU } from '../../analyses.menu'
@Component({
    selector: 'chart',
    templateUrl: './chart.html',
    styleUrls: ['./chart.scss'],
})
export class ChartComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public option: any;
    @Input() result: Array<any>;
    @Input() vStart: Date;   //开始时间
    @Input() vEnd: Date;    //结束时间
    @Input() type: number;
    @Input() fieldName: string;
    @Input() tabSelectValue: number;
    @Input() startYear: number;
    @Input() endYear: number;
    @Input() startMonthDay: string;
    @Input() endMonthDay: string;
    constructor() {
    };
    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.result = new Array()
    }
    ngOnChanges() {
        this.setting();
    }
    setting() {
        if (!this.result || this.result.length == 0) return;
        let dateArr = new Array();
        let allYearArr = new Array();
        let num = 0;
        let stationName = new Array();
        let stationData = new Array();
        this.result.forEach(item => {
            if (!stationName.includes(item["stationName"])) {
                stationName.push(item["stationName"]);
                if (this.type == 1 || this.type == 6 || this.type == 4 || this.type == 5) {
                    let param = item["statValue"] ? item["statValue"] : null;
                    stationData.push(param);
                } else if (this.type == 2 || this.type == 3) {
                    let param = item["statValue"] ? new Date(item["statValue"]).getTime() : null;
                    stationData.push(param);
                }
            }
        })
        let menu = ANALS_MENU;
        let itemArr = new Array();
        menu[0]["children"].forEach(item => {
            item.children.forEach(list => {
                itemArr.push(list);
            })
        })
        let string = this.fieldName + "/" + this.type;
        let name = ""
        name = itemArr.find(item => item["path"] == string) ? itemArr.find(item => item["path"] == string)["data"]["menu"]["title"] : "";
        if (this.tabSelectValue == 0) {
            if (!this.vStart) return;
            if (!this.vEnd) return;
            num = (this.vEnd.getTime() - this.vStart.getTime()) / (24 * 60 * 60 * 1000) + 1;
            dateArr = this.beforeDays(this.vEnd, num);
        } else {
            if (!this.startYear) return;
            if (!this.startMonthDay) return;
            if (!this.endMonthDay) return;
            let month = this.startMonthDay.slice(0, 2);
            let day = this.startMonthDay.slice(2, 4);
            let date = this.startYear + "/" + month + "/" + day;
            let _month = this.endMonthDay.slice(0, 2);
            let _day = this.endMonthDay.slice(2, 4);
            let _date = this.startYear + "/" + _month + "/" + _day;
            num = (new Date(_date).getTime() - new Date(date).getTime()) / (24 * 60 * 60 * 1000) + 1;
            let allYear = new Array();
            for (let i = this.startYear; i <= this.endYear; i++) {
                let _month = this.endMonthDay.slice(0, 2);
                let _day = this.endMonthDay.slice(2, 4);
                let _date = i + "/" + _month + "/" + _day;
                allYear.push(this.beforeDays(new Date(_date), num))
            }
            allYear.forEach(year => {
                year.forEach(item => {
                    allYearArr.push(item)
                })
            })
        }
        switch (+this.type) {
            case 2:
            case 3:
                let legend = new Array();
                legend.push('Growth');
                legend.push(name);
                let series = new Array();
                if (this.tabSelectValue == 0) { //连续常规统计
                    let obj = new Object();
                    obj = {
                        name: name,
                        type: 'scatter',
                        data: stationData
                    }
                    series.push(obj);
                    this.setPointOption(stationName, series, legend, this.tabSelectValue, this.startYear, this.startMonthDay, name);
                } else {      //非连续常规统计
                    for (let i = this.startYear; i <= this.endYear; i++) {
                        legend.push(i.toString());
                        let obj = new Object();
                        obj = {
                            name: i,
                            type: 'scatter',
                        }
                        obj["data"] = new Array();
                        stationName.forEach(name => {
                            let item = this.result.find(data => data["stationName"] == name && Number(new Date(data["stationStartDate"]).toLocaleDateString().split("/")[0]) == i);
                            if (!item) {
                                obj["data"].push(null)
                                return;
                            }
                            let _data = item["statValue"] ? new Date(item["statValue"]).getTime() : null;
                            obj["data"].push(_data)
                        })
                        series.push(obj)
                    }
                    this.setPointOption(stationName, series, legend, this.tabSelectValue, this.startYear, this.startMonthDay, name);
                }
                break;
            case 1:
            case 6:
            case 4:
            case 5:
                if (this.fieldName.includes("v12052") || this.fieldName.includes("v12053") || this.fieldName.includes("v13201")) {
                    let legend = new Array();
                    legend.push('Growth');
                    let _series = new Array();
                    if (this.tabSelectValue == 0) {//连续常规统计
                        _series.push({
                            name: name,
                            type: 'bar',
                            data: stationData
                        })
                        legend.push(name);
                        this.setOption(stationName, _series, legend, this.result, this.type, this.tabSelectValue, name);
                    } else {         //非连续常规统计
                        for (let i = this.startYear; i <= this.endYear; i++) {
                            legend.push(i.toString());
                            let obj = new Object();
                            obj = {
                                name: i,
                                type: 'bar',
                            }
                            obj["data"] = new Array();
                            stationName.forEach(name => {
                                let item = this.result.find(data => data["stationName"] == name && Number(new Date(data["stationStartDate"]).toLocaleDateString().split("/")[0]) == i);
                                let _data = item ? item["statValue"] : null;
                                obj["data"].push(_data)
                            })
                            _series.push(obj)
                        }
                        this.setOption(stationName, _series, legend, this.result, this.type, this.tabSelectValue, name);
                    }
                }
                break;
            case 7:
                if (this.fieldName.includes("v12052") || this.fieldName.includes("v12053") || this.fieldName.includes("v12001")
                    || this.fieldName.includes("v13201") || this.fieldName.includes("v14032")) {
                    if (this.tabSelectValue == 0) {     //连续常规统计
                        if (this.fieldName == 'v12001') {
                            let legend = new Array();
                            legend.push('Growth');
                            legend.push(name);
                            let dataArr = new Array()
                            this.result.forEach(data => {
                                let item = data["statValue"] ? (Number(data["statValue"]) / 10).toFixed(2) : null;
                                dataArr.push(item);
                            })
                            let _series = new Array();
                            _series.push({
                                name: name,
                                type: 'bar',
                                data: dataArr
                            })
                            this.setOption(stationName, _series, legend, this.result, this.type, this.tabSelectValue, name);
                            return;
                        }
                        this.setLineOption(dateArr, stationName, name);
                    } else {       //非连续常规统计
                        if (this.fieldName == 'v12001') {
                            let allYear = new Array();
                            allYearArr = new Array();
                            for (let i = this.startYear; i <= this.endYear; i++) {
                                let _month = this.startMonthDay.slice(0, 2);
                                let _day = this.startMonthDay.slice(2, 4);
                                let _date = i + "/" + _month + "/" + _day;
                                allYear.push(this.beforeDays(new Date(_date), 1))
                            }
                            allYear.forEach(year => {
                                year.forEach(item => {
                                    allYearArr.push(item)
                                })
                            })
                            this.setLineOption(allYearArr, stationName, name);
                            return;
                        }
                        let legend = new Array();
                        legend.push('Growth');
                        let series = new Array();
                        stationName.forEach(name => {
                            let obj = new Object();
                            legend.push(name);
                            obj["name"] = name;
                            obj["data"] = new Array();
                            obj["type"] = 'bar';
                            allYearArr.forEach(time => {
                                let _data = this.result.find(data => new Date(data["stationDate"]).toLocaleDateString() == new Date(time).toLocaleDateString() && data["stationName"] == name);
                                let result = _data ? _data["statValue"] : null;
                                obj["data"].push(result);
                            })
                            series.push(obj)
                        })
                        this.setOption(allYearArr, series, legend, this.result, this.type, this.tabSelectValue, name);
                    }
                }
                break;
        }
    }
    //柱状图
    setOption(xData, series, legendData, result, type, tabSelectValue, name) {
        if (type == 4 || type == 5) {
            series.forEach(item => {
                let arr = new Array();
                arr = item['data'];
                item['data'] = new Array();
                arr.forEach(list => {
                    let param = list == null ? null : (list / 10).toFixed(2);;
                    item['data'].push(param)
                })
            })
        }
        this.option = {
            title: {
                text: name
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                },
                formatter: function (a) {
                    let string = "";
                    a.forEach(list => {
                        let data;
                        if (type == 4 || type == 5) {
                            let item;
                            data = list["data"] == null ? "无" : list["data"];
                            if (tabSelectValue == 0) {
                                item = result.find(data => data["stationName"] == list["axisValue"]);
                            } else {
                                item = result.find(data => data["stationName"] == list["axisValue"] && list["seriesName"] == new Date(data["stationDate"]).toLocaleDateString().split("/")[0]);
                            }
                            if (!item) return;
                            let timeString = data == "无" ? "" : "---" + new Date(item["stationDate"]).toLocaleDateString();
                            string += list == a[list.length - 1] ? list["seriesName"] + "<br>" + list["name"] + ":" + data + timeString : list["seriesName"] + "<br>" + list["name"] + ":" + data + timeString + "<br>"
                            return;
                        }
                        data = list["data"] == null ? "无" : list["data"];
                        string += list == a[list.length - 1] ? list["seriesName"] + "<br>" + list["name"] + ":" + data : list["seriesName"] + "<br>" + list["name"] + ":" + data + "<br>";
                    })
                    return string;
                }
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            legend: {
                data: legendData,
                itemGap: 5
            },
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: type == 7 ? 100 : 1
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: series
        };
    }
    //折线图
    setLineOption(xData, legendData, name) {
        let objArr = new Array();
        legendData.forEach(statName => {
            let result = this.result.filter(item => item["stationName"] == statName);
            let obj = new Object();
            obj["name"] = statName;
            obj["value"] = result;
            obj["data"] = new Array();
            obj["type"] = 'line';
            objArr.push(obj)
        })
        xData.forEach(date => {
            objArr.forEach(_obj => {
                let item = _obj["value"].find(list => new Date(list["stationDate"]).toLocaleDateString() == date);
                let data = item ? (item["statValue"] / 10).toFixed(2) : null;
                _obj["data"].push(data)
            })
        })
        objArr.forEach(_obj => {
            delete _obj.value;
        })
        this.option = {
            title: {
                text: name
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: objArr
        };
    }
    //散点图
    setPointOption(xData, seriesData, legend, tabSelectValue, startYear, startMonthDay, name) {
        let num = (this.vEnd.getTime() - this.vStart.getTime()) / (24 * 60 * 60 * 1000);
        this.option = {
            title: {
                text: name
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                },
                formatter: function (a) {
                    let string = "";
                    a.forEach(list => {
                        let data = list["data"] == null ? "无" : new Date(list["data"]).toLocaleDateString();
                        string += list == a[list.length - 1] ? list["seriesName"] + "<br>" + list["name"] + ":" + data : list["seriesName"] + "<br>" + list["name"] + ":" + data + "<br>";
                    })
                    return string;
                }
            },
            toolbox: {
                show: true,
            },
            calculable: true,
            legend: {
                data: legend,
                itemGap: 5
            },
            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: function (value) {
                        let result = tabSelectValue == 0 ? value.max - (1000 * 60 * 60 * 24 * num) : new Date(startYear + "/" + startMonthDay.slice(0, 2) + "/" + startMonthDay.slice(2, 4)).getTime();
                        return result;
                    },
                    axisLabel: {
                        formatter: function (a) {
                            return new Date(a).toLocaleDateString()
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 5
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    showDetail: false,
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: seriesData
        };
    }
    //获取当前日期的前几天
    beforeDays(day: Date, num: number) {
        let days = new Array<string>();
        for (let i = 0; i < num; i++) {
            let date = new Date();
            date.setTime(day.getTime());
            date.setDate(day.getDate() - (num - 1 - i));
            days[i] = date.toLocaleDateString();
        }
        return days;
    }
}