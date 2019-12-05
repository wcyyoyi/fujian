import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { SurfaceService, StationService, AreaService } from 'app/pages/services';
import { Jujube } from './Jujube';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { DictionaryService } from 'app/pages/utils/Dictionary.service';
import { MangStat } from 'app/pages/utils/models/mang_stat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AreaInfo } from 'app/pages/models';

const availableArea = ['350100', '350200', '350300', '350500', '350600', '350800', '350900'];

@Component({
    selector: 'indicator-jujube',
    templateUrl: 'jujube.html',
    styleUrls: ['./jujube.scss'],
    providers: [DictionaryService, YzNgxToastyService, AreaService]
})

export class JujubeComponent implements OnInit {
    private jujube = new Jujube();

    @Output()
    onComplete = new EventEmitter<any>();

    @Input()
    date: Date;
    @Input()
    areaCode: string;
    @Input()
    areaLevel: number = 2;
    @Input()
    isSettingMode = false; //指标设置模式

    endDate = new Date();
    startDate = new Date();

    jujubeDatas = new Array<JujubeData>();
    settings = new Array();

    bsModalRef: BsModalRef;
    constructor(private surfaceServ: SurfaceService, private statServ: StationService, private areaService: AreaService,
        private yzNgxToastyService: YzNgxToastyService, private dicServ: DictionaryService,
        private modalService: BsModalService) { }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.surfaceServ.getAssetsFile('quality/jujube/indicator.json').subscribe((jujube: Jujube) => {
            this.jujube = jujube;
        });
    }

    execute() {
        this.yzNgxToastyService.wait("正在准备数据", "");

        let resultMap = new Map<string, number>();


        this.statServ.getStasByAreaCode(this.areaCode, this.areaLevel).then(stats => {
            let stations = new Array<MangStat>();
            let statCodeArr = new Array();
            stats.forEach(stat => {
                // 根据区域获取站点并按照国家站过滤
                if (stat.cTypestation == "一般站" || stat.cTypestation == "基本站" || stat.cTypestation == "基准站") {

                    // 台湾青枣种植区：宁德（除周宁、寿宁、柘荣）、福州、莆田、泉州、厦门、漳州、龙岩
                    if (availableArea.includes(stat.cCode.substring(0, 4) + "00") && stat.cCode != '350925' && stat.cCode != '350924' && stat.cCode != '350926') {
                        statCodeArr.push(stat.v01000);
                        stations.push(stat);

                        resultMap.set(stat.cCode, null);
                    }
                }
            });

            if (statCodeArr.length < 1) {
                this.yzNgxToastyService.close();
                this.yzNgxToastyService.warning("该地区没有国家站，停止制图", '', 2000);
                return;
            }

            this.endDate = new Date(this.date.getTime() - 1 * 24 * 3600 * 1000);
            this.startDate = new Date(this.date.getTime() - this.jujube.tavgDays * 24 * 3600 * 1000);

            this.surfaceServ.getByFilter(statCodeArr.toString(), this.startDate, this.endDate).toPromise().then((datas: Array<any>) => {
                // 按日期分组
                let dateMap = new Map<number, Array<any>>();
                datas.forEach(data => {
                    let arr = dateMap.get(data.vdate) ? dateMap.get(data.vdate) : new Array();
                    arr.push(data);
                    dateMap.set(data.vdate, arr);
                });

                this.yzNgxToastyService.close();
                if (dateMap.size < (this.jujube.tavgDays * 0.8)) {
                    this.yzNgxToastyService.confirm("当前数据量为" + dateMap.size + "，不足" + this.jujube.tavgDays + "的80%，是否继续制图？", 'info', (e) => {
                        if (!e) return;
                        this.yzNgxToastyService.wait("正在计算", "");
                        this.calc(dateMap, stations, resultMap);
                        this.yzNgxToastyService.close();
                        this.onComplete.emit(resultMap);
                    });
                } else {
                    this.yzNgxToastyService.wait("正在计算", "");
                    this.calc(dateMap, stations, resultMap);
                    this.yzNgxToastyService.close();
                    this.onComplete.emit(resultMap);
                }

            }).catch(err => {
                this.yzNgxToastyService.close();
                this.yzNgxToastyService.error(err, "", 3000);
                // this.yzNgxToastyService.error(err.json()["message"], "", 3000);
            });

        })
    }

    calc(dateMap: Map<number, Array<any>>, stations: Array<MangStat>, resultMap: Map<string, number>) {
        let v12001SumMap = new Map<string, number>(); //平均气温
        let diurnalRangeSumMap = new Map<string, number>(); //日较差
        let v14032SumMap = new Map<string, number>();//日照时数
        dateMap.forEach((v, k) => {
            let dateCount = (this.endDate.getTime() - k) / (24 * 60 * 60 * 1000);//距离今天天数
            // 按区域分组
            let areaMap = new Map<string, Array<any>>();
            v.forEach(data => {
                let stat = stations.find(stat => { return stat.v01000 == data.v01000 })
                let areaCode = stat.cCode;
                let arr = areaMap.get(areaCode) ? areaMap.get(areaCode) : new Array();
                arr.push(data);
                areaMap.set(areaCode, arr);
            })

            // 一个区域多个站取平均
            areaMap.forEach((v, k) => {
                let v12001DaySum = 0;
                let diurnalRangeDaySum = 0;
                let v14032DaySum = 0;
                v.forEach(data => {
                    v12001DaySum += data.v12001;
                    diurnalRangeDaySum += (data.v12052 - data.v12053);
                    v14032DaySum += data.v14032;
                });

                let v120001Sum = v12001SumMap.get(k) ? v12001SumMap.get(k) : 0;
                v120001Sum = v120001Sum + (v12001DaySum / v.length);
                v12001SumMap.set(k, v120001Sum);

                if (dateCount <= this.jujube.tcDays) {
                    let diurnalRangeSum = diurnalRangeSumMap.get(k) ? diurnalRangeSumMap.get(k) : 0;
                    diurnalRangeSum = diurnalRangeSum + (diurnalRangeDaySum / v.length);
                    diurnalRangeSumMap.set(k, diurnalRangeSum);
                }
                if (dateCount <= this.jujube.sDays) {
                    let v14032Sum = v14032SumMap.get(k) ? v14032SumMap.get(k) : 0;
                    v14032Sum = v14032Sum + (v14032DaySum / v.length);
                    v14032SumMap.set(k, v14032Sum);
                }
            })
        })

        this.clearTable();
        let areaName = this.dicServ.AREA.find(area => { return area.cCode.toString() == this.areaCode });
        this.createSettings(areaName.cName);
        // 计算区域对应的平均数
        resultMap.forEach((v, k) => {
            let v12001Avg = Number((v12001SumMap.get(k) / this.jujube.tavgDays / 10).toFixed(2));
            let diurnalRangeAvg = Number((diurnalRangeSumMap.get(k) / this.jujube.tcDays / 10).toFixed(2));
            let v14032Avg = Number((v14032SumMap.get(k) / this.jujube.sDays / 10).toFixed(2));

            let acqi = this.matchLevel(v12001Avg, diurnalRangeAvg, v14032Avg);
            let result = NaN;
            if (acqi < this.jujube.acqi1Min) {
                result = 0;
            } else if (acqi >= this.jujube.acqi1Min && acqi < this.jujube.acqi2Min) {
                result = 1;
            } else if (acqi >= this.jujube.acqi2Min && acqi < this.jujube.acqi3Min) {
                result = 2;
            } else if (acqi >= this.jujube.acqi3Min) {
                result = 3;
            }
            resultMap.set(k, result);
            let area = this.dicServ.AREA.find(area => { return area.cCode.toString() == k });
            let parentArea: AreaInfo = this.areaService.getParentByCCode(area.cCode.toString(), area.vLevel);
            this.createSource(area.cName, parentArea.cName, v12001Avg, diurnalRangeAvg, v14032Avg, acqi, result);
        });
    }

    showData() {
        this.bsModalRef = this.modalService.show(JujubeModalContentComponent, { class: 'modal-lg' });
        this.bsModalRef.content.init(this.settings, this.jujubeDatas);
    }

    private clearTable() {
        this.jujubeDatas = new Array();
    }


    private matchLevel(v12001Avg: number, diurnalRangeAvg: number, v14032Avg: number): number {
        let tavg = NaN;
        if (v12001Avg < this.jujube.tavg1Min) {
            tavg = 0;
        } else if (v12001Avg >= this.jujube.tavg1Min && v12001Avg < this.jujube.tavg2Min) {
            tavg = 1;
        } else if (v12001Avg >= this.jujube.tavg2Min && v12001Avg < this.jujube.tavg3Min) {
            tavg = 2;
        } else if (v12001Avg >= this.jujube.tavg3Min) {
            tavg = 3;
        }

        let tc = NaN;
        if (diurnalRangeAvg < this.jujube.tc1Min) {
            tc = 0;
        } else if (diurnalRangeAvg >= this.jujube.tc1Min && diurnalRangeAvg < this.jujube.tc2Min) {
            tc = 1;
        } else if (diurnalRangeAvg >= this.jujube.tc2Min && diurnalRangeAvg < this.jujube.tc3Min) {
            tc = 2;
        } else if (diurnalRangeAvg >= this.jujube.tc3Min) {
            tc = 3;
        }

        let s = NaN;
        if (v14032Avg < this.jujube.s1Min) {
            s = 0;
        } else if (v14032Avg >= this.jujube.s1Min && v14032Avg < this.jujube.s2Min) {
            s = 1;
        } else if (v14032Avg >= this.jujube.s2Min && v14032Avg < this.jujube.s3Min) {
            s = 2;
        } else if (v14032Avg >= this.jujube.s3Min) {
            s = 3;
        }

        let acqi = tavg * 0.4 + tc * 0.3 + s * 0.3;


        return Number(acqi.toFixed(1));
    }

    private createSettings(areaName: string) {
        let settings = new Array<any>();
        settings.push({ headerName: areaName, field: "areaName" });
        settings.push({ headerName: "地区", field: "parentAreaName", sort: 'asc' });
        settings.push({ headerName: "平均气温Tavg（℃）", field: "tavg" });
        settings.push({ headerName: "平均日较差△T（℃）", field: "tc" });
        settings.push({ headerName: "平均日照时数S（ｈ）", field: "s" });
        settings.push({ headerName: "ACQI", field: "acqi" });
        settings.push({ headerName: "评级", field: "result" });
        this.settings = settings;
    }

    private createSource(areaName: string, parentAreaName: string, tavg: number, tc: number, s: number, acqi: number, level: number) {
        this.jujubeDatas.push(new JujubeData(areaName, parentAreaName, tavg, tc, s, acqi, level));
    }
}

export class JujubeData {
    private areaName: string;
    private parentAreaName: string;
    private tavg: number;
    private tc: number;
    private s: number;
    private acqi: number;
    private result: string;

    constructor(areaName: string, parentAreaName: string, tavg: number, tc: number, s: number, acqi: number, result: number) {
        this.areaName = areaName;
        this.parentAreaName = parentAreaName;
        this.tavg = tavg;
        this.tc = tc;
        this.s = s;
        this.acqi = acqi;
        switch (result) {
            case 0:
                this.result = "一般";
                break;
            case 1:
                this.result = "良";
                break;
            case 2:
                this.result = "优";
                break;
            case 3:
                this.result = "特优";
                break;
        }
    }
}

@Component({
    selector: 'modal-content',
    template: `
      <div class="modal-header">
        <h4 class="modal-title pull-left">数据详情</h4>
        <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="modal-body" class="modal-body modal-content">
        <div style="height:400px;">
         <ba-grid #grid [source]="source" [settings]="settings" [isDataExport]="true"></ba-grid>
        </div>
      </div>
    `
})

export class JujubeModalContentComponent implements OnInit {
    source;
    settings;

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
    }

    init(settings, source) {
        this.settings = settings;
        this.source = source;
    }
}
