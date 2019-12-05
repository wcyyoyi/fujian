import { Component, OnInit } from '@angular/core';
import { CliService } from 'app/pages/services/cli.service';
import { ConverterService } from 'app/pages/utils/Converter/converter.service';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { AreaService } from 'app/pages/services';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operator/map';
import { Utils } from 'app/pages/utils/utils';

@Component({
    selector: 'agme-cli',
    templateUrl: 'agmeCli.html',
    styleUrls: ['agmeCli.scss'],
    providers: [YzNgxToastyService]
})

export class AgmeCliComponent implements OnInit {
    private datePipe = new DatePipe("en-US");

    private queryFinsh = true;

    private dicMap = new Map<string, any>();

    private source: Array<any>;
    private settings = [
        {
            headerName: '所属地市',
            field: "cAreaCode",
            valueFormatter: (data) => {
                if (data.cAreaCode == "350983") {
                    //霞浦县三沙镇特殊处理
                    return "霞浦县三沙镇";
                } else {
                    return this.converterServ.areaCodeToName(data.value)
                }
            },
            // filter: "agSelectColumnFilter",
            // filterParams: { selectItems: [] }
        },
        {
            headerName: '站点',
            field: "vSink",
            valueFormatter: (data) => {
                if (this.dicMap.has(data.value)) {
                    return this.dicMap.get(data.value).stationnm
                }
            }
        },
        {
            headerName: '站号',
            field: "vSink",
        },
        {
            headerName: '作物',
            field: "vSink",
            valueFormatter: (data) => {
                if (this.dicMap.has(data.value)) {
                    return this.dicMap.get(data.value).cropnm
                }
            }
        },
        {
            headerName: '数据是否正常',
            field: "vSource",
            valueFormatter: (data) => data.value == 1 ? "是" : "否",
            filter: "agSelectColumnFilter",
            filterParams: { selectItems: ["是", "否"] }
        },
        {
            headerName: '最新资料时次',
            field: "vTimeStamp",
            valueFormatter: (data) => {
                let date = new Date(data.value);
                return this.getDateTimeStr(date)
            },
            filter: "agDateColumnFilter"
        },
        {
            headerName: '操作',
            filter: false,
            cellRenderer: "customComponent",
            cellRendererParams: [
                {
                    value: '查看区域详情',
                    callBackFunction: (data) => {
                        this.yzNgxToastyService.wait("正在统计...");
                        this.cliServ.getMonitorByFilter(data.cAreaCode, new Date(this.date.getTime() - 1 * 3600 * 1000), this.date).toPromise().then(datas => {
                            this.setOption(datas);
                            this.yzNgxToastyService.close();
                            $('.carousel').carousel('prev');
                        })
                    }
                }
            ]
        },
    ]
    private originalSource: Array<any>; // 储存原始数据

    private date = new Date();
    private timeUnit: number = 5;

    private option;

    constructor(private cliServ: CliService, private converterServ: ConverterService,
        private yzNgxToastyService: YzNgxToastyService, private areaServ: AreaService) { }

    ngOnInit() {
        this.cliServ.getMonitorLastDate().toPromise().then((date) => {
            if (date) {
                this.date = new Date(date);
            } else {
                let min = new Date().getMinutes();
                min = min - min % 5;
                this.date.setMinutes(min, 0, 0);
            }
            this.query();
        });
    }

    plusMinute(minute: number) {
        if (!this.queryFinsh) {
            return;
        }
        let date = new Date(this.date.getTime() + this.timeUnit * minute * 60 * 1000);
        if (date.getTime() >= new Date().getTime()) {
            this.yzNgxToastyService.warning('不能超过当前时间！', '', 2000);
            return;
        }
        this.date.setTime(date.getTime());
        this.query();
    }


    query() {
        this.queryFinsh = false;
        this.yzNgxToastyService.wait("正在查询...");
        this.cliServ.getMonitorByDate(this.date.getTime()).toPromise().then((source: Array<any>) => {
            // 根据站号整理站名、作物名等信息
            this.cliServ.getByFilter("", this.date, this.date).toPromise().then(datas => {
                if (datas) {
                    datas.forEach(data => {
                        if (!this.dicMap.has(data.v01000)) {
                            this.dicMap.set(data.v01000, data);
                        }
                    });
                }

                this.areaServ.areas.then(areas => {
                    let selectArr = [];
                    this.source = this.originalSource = source.filter(s => {
                        let area = areas.find(area => area.cCode == s.cAreaCode);
                        if (area != undefined) {
                            selectArr.push(area.cName)
                        } else if (s.cAreaCode == "350983") {
                            //霞浦县三沙镇特殊处理
                            selectArr.push("霞浦县三沙镇")
                        } else {
                            console.error(s.cAreaCode + "区域未找到");
                        }
                        return true;
                    }).sort((a, b) => b.vSource - a.vSource);

                    // this.settings[0]["filterParams"]["selectItems"] = selectArr;

                    let correct = this.source.filter(s => s.vSource == 1);
                    document.getElementById("total").innerHTML = " " + this.source.length + " ";
                    document.getElementById("correct").innerHTML = " " + correct.length + " ";
                    document.getElementById("incorrect").innerHTML = " " + (this.source.length - correct.length) + " ";

                    this.queryFinsh = true;
                    this.yzNgxToastyService.close();
                })


            })
        });
    }

    filter(value) {
        switch (value) {
            case 0:
                this.source = this.originalSource.filter(s => s.vSource != 1);
                break;
            case 1:
                this.source = this.originalSource.filter(s => s.vSource == 1);
                break;
            default:
                this.source = this.originalSource;
                break;
        }
    }

    private getDateTimeStr(date: Date) {
        let hour = date.getHours();
        let minute = date.getMinutes();
        let sec = date.getSeconds();

        let hourStr = ("0" + hour).substring(("0" + hour).length - 2);
        let minuteStr = ("0" + minute).substring(("0" + minute).length - 2);
        let secStr = ("0" + sec).substring(("0" + sec).length - 2);

        return date.toLocaleDateString() + " " + hourStr + ":" + minuteStr + ":" + secStr;
    }

    setOption(datas: Array<any>) {
        let xAxis = {
            type: 'category',
            boundaryGap: false,
            data: []
        }

        // 根据时间分组，纵轴为该区域下站点数量
        let map = new Map<string, Array<any>>();
        datas.forEach(data => {
            let date = new Date(data.vTimeStamp);
            let key = this.datePipe.transform(date, "HH:mm")
            if (!map.has(key)) {
                map.set(key, new Array())
            }
            map.get(key).push(data);
        })

        let correctSerie = {
            name: "合格率",
            data: [],
            type: 'line'
        }

        map.forEach((v, k) => {
            xAxis.data.push(k);

            let correct = 0;
            v.forEach(item => {
                if (item.vSource == 1) {
                    correct++;
                }
            })
            correctSerie.data.push(Math.round(correct / v.length * 10000) / 100);
        })

        let series = [correctSerie];

        this.option = {
            xAxis: xAxis,
            // legend: {
            //     data: ['合格', '不合格']
            // },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let datas = map.get(params[0].name);
                    let correctSata = '合格的站点：<br>';
                    let incorrectSata = '不合格的站点：<br>';
                    datas.forEach(data => {
                        let statInfo = this.dicMap.get(data.vSink)
                        if (data.vSource == 1) {
                            correctSata += statInfo ? (statInfo.stationnm + "(" + data.vSink + ")<br>") : (data.vSink + "<br>");
                        } else {
                            incorrectSata += statInfo ? (statInfo.stationnm + "(" + data.vSink + ")<br>") : (data.vSink + "<br>");
                        }
                    })
                    let str = "合格率：" + params[0].data + "%<br>" + correctSata + incorrectSata
                    return str;
                }
            },
            yAxis: {
                name: "合格率",
                type: 'value',
                // minInterval: 1,//坐标轴间隔
                axisLine: {
                    onZero: false
                },
                min: (value) => Math.floor(value.min),
                max: 100
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
            ],
            color: ['green'],
            series: series
        };

    }

}