import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { SurfaceService } from '../services/surface.service';
import { ASMMService } from '../services/asmm.service';
import { SHourService } from '../services/shour.service';
import { C01Service } from '../services/c01.service';
import { MosService } from '../services/mos.service';
import { CropDictService } from '../services/cropDict.service';

@Injectable()
export class DataState {
    constructor(private http: Http) {
    }

    dateFormate(value) {
        let dateValue = new Date(value);
        return dateValue.toLocaleDateString();
    }

    convertToDate(value: number) {
        let strValue = value / 100;
        if (strValue) {
            let values = strValue.toString().split(".");
            let sMon = values[0] + "月";
            let sDay = values[1] + "日";
            return sMon + sDay;
        }
        return value;
    }

    surface = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new SurfaceService(this.http),
        columns: {
            v01000: {
                title: '站号',
                type: 'number'
            },
            v04001: {
                title: '年',
                type: 'number'
            },
            v04002: {
                title: '月',
                type: 'number'
            },
            v04003: {
                title: '日',
                type: 'number'
            },
            v12001: {
                title: '平均气温',
                type: 'number'
            },
            v12052: {
                title: '最高气温',
                type: 'number'
            },
            v12053: {
                title: '最低气温',
                type: 'number'
            },
            v13004: {
                title: '水汽压',
                type: 'number'
            },
            v13201: {
                title: '20_20时降水量',
                type: 'number'
            },
            v11002: {
                title: '风速',
                type: 'number'
            },
            v14032: {
                title: '日照时数',
                type: 'number'
            },
            v10004: {
                title: '本站气压',
                type: 'number'
            },
            v13003: {
                title: '相对湿度',
                type: 'number'
            },
            v13007: {
                title: '最小相对湿度',
                type: 'number'
            },
            v13006: {
                title: '最大相对湿度',
                type: 'number'
            },
            v12003: {
                title: '露点温度',
                type: 'number'
            },
            v20010: {
                title: '总云量',
                type: 'number'
            },
            v20051: {
                title: '低云量',
                type: 'number'
            },
            v12240: {
                title: '0厘米地温',
                type: 'number'
            },
            v12213: {
                title: '最高地温',
                type: 'number'
            },
            v12214: {
                title: '最低地温',
                type: 'number'
            },
            v13203: {
                title: '20-8时降水量',
                type: 'number'
            },
            v13204: {
                title: '8-20时降水量',
                type: 'number'
            },
            v13242: {
                title: '日蒸发量大型',
                type: 'number'
            },
            v13241: {
                title: '日蒸发量小型',
                type: 'number'
            },
            v20235: {
                title: '积雪深度',
                type: 'number'
            },
            v13202: {
                title: '08-08时降水',
                type: 'number'
            },
            v13031: {
                title: '蒸发量',
                type: 'number'
            },
            // v20270001: {
            //   title: '平均气温',
            //   type: 'number'
            // },
            // v20270002: {
            //   title: '最高气温',
            //   type: 'number'
            // },
            // v20270003: {
            //   title: '平均气温',
            //   type: 'number'
            // },
            // v20270004: {
            //   title: '最高气温',
            //   type: 'number'
            // }
        }
    };

    shour = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new SHourService(this.http),
        columns: {
            v01000: {
                title: '站号',
                type: 'number'
            },
            v04001: {
                title: '年',
                type: 'number'
            },
            v04002: {
                title: '月',
                type: 'number'
            },
            v04003: {
                title: '日',
                type: 'number'
            },
            v04004: {
                title: '时',
                type: 'number'
            },
            cDatatype: {
                title: '资料类型',
                type: 'text'
            },
            v05001: {
                title: '纬度',
                type: 'number'
            },
            v06001: {
                title: '经度',
                type: 'number'
            },
            v07001: {
                title: '测站高度',
                type: 'number'
            },
            v02001: {
                title: '台站类型',
                type: 'number'
            },
            v10004: {
                title: '本站气压',
                type: 'number'
            },
            v10051: {
                title: '海平面气压',
                type: 'number'
            },
            v11001: {
                title: '风向(位于10米处)',
                type: 'number'
            },
            v11002: {
                title: '风速(位于10米处)',
                type: 'number'
            },
            v12001: {
                title: '干球温度(位于2米处)',
                type: 'number'
            },
            v12003: {
                title: '露点温度(位于2米处)',
                type: 'number'
            },
            v13003: {
                title: '相对湿度',
                type: 'number'
            },
            v20010: {
                title: '总云量',
                type: 'number'
            },
            v20011: {
                title: '低云或中云的云量',
                type: 'number'
            },
            v13023: {
                title: '观测前24小时降水量',
                type: 'number'
            },
            v12016: {
                title: '24小时最高气温',
                type: 'number'
            },
            v12017: {
                title: '24小时最低气温',
                type: 'number'
            },
            v13031: {
                title: '蒸发量',
                type: 'number'
            },
            v14032: {
                title: '总日照',
                type: 'number'
            },
            v20003: {
                title: '天气现象',
                type: 'number'
            },
            // vdate: {
            //     title: '最大相对湿度',
            //     type: 'number'
            // },
            v20063001: {
                title: '特殊天气现象1',
                type: 'number'
            },
            v20063002: {
                title: '特殊天气现象2',
                type: 'number'
            },
            v20235: {
                title: '积雪深度',
                type: 'number'
            },
            v20270001: {
                title: '冻土深度第1栏上限值',
                type: 'number'
            },
            v20270002: {
                title: '冻土深度第1栏下限值',
                type: 'number'
            },
            v20270003: {
                title: '冻土深度第2栏上限值',
                type: 'number'
            },
            v20270004: {
                title: '冻土深度第2栏下限值',
                type: 'number'
            }
        }
    };

    asmm = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new ASMMService(this.http),
        columns: {
            v01000: {
                title: '站号',
                type: 'number'
            },
            v04001: {
                title: '年',
                type: 'number'
            },
            v04002: {
                title: '月',
                type: 'number'
            },
            v04003: {
                title: '日',
                type: 'number'
            },
            v04004: {
                title: '时',
                type: 'number'
            },
            v04005: {
                title: '分',
                type: 'number'
            },
            v04006: {
                title: '秒',
                type: 'number'
            },
            v05001: {
                title: '纬度',
                type: 'number'
            },
            v06001: {
                title: '经度',
                type: 'number'
            },
            v07001: {
                title: '测站海拔高度',
                type: 'number'
            },
            v56001: {
                title: '测量地段标示数字',
                type: 'number'
            },
            v56207010: {
                title: '0-10cm土壤体积含水量',
                type: 'number'
            },
            v56208010: {
                title: '0-10cm土壤相对湿度',
                type: 'number'
            },
            v56206010: {
                title: '0-10cm土壤重量含水率',
                type: 'number'
            },
            v56209010: {
                title: '0-10cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207020: {
                title: '10-20cm土壤体积含水量',
                type: 'number'
            },
            v56208020: {
                title: '10-20cm土壤相对湿度',
                type: 'number'
            },
            v56206020: {
                title: '10-20cm土壤重量含水率',
                type: 'number'
            },
            v56209020: {
                title: '10-20cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207030: {
                title: '20-30cm土壤体积含水量',
                type: 'number'
            },
            v56208030: {
                title: '20-30cm土壤相对湿度',
                type: 'number'
            },
            v56206030: {
                title: '20-30cm土壤重量含水率',
                type: 'number'
            },
            v56209030: {
                title: '20-30cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207040: {
                title: '30-40cm土壤体积含水量',
                type: 'number'
            },
            v56208040: {
                title: '30-40cm土壤相对湿度',
                type: 'number'
            },
            v56206040: {
                title: '30-40cm土壤重量含水率',
                type: 'number'
            },
            v56209040: {
                title: '30-40cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207050: {
                title: '40-50cm土壤体积含水量',
                type: 'number'
            },
            v56208050: {
                title: '40-50cm土壤相对湿度',
                type: 'number'
            },
            v56206050: {
                title: '40-50cm土壤重量含水率',
                type: 'number'
            },
            v56209050: {
                title: '40-50cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207060: {
                title: '50-60cm土壤体积含水量',
                type: 'number'
            },
            v56208060: {
                title: '50-60cm土壤相对湿度',
                type: 'number'
            },
            v56206060: {
                title: '50-60cm土壤重量含水率',
                type: 'number'
            },
            v56209060: {
                title: '50-60cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207070: {
                title: '60-70cm土壤体积含水量',
                type: 'number'
            },
            v56208070: {
                title: '60-70cm土壤相对湿度',
                type: 'number'
            },
            v56206070: {
                title: '60-70cm土壤重量含水率',
                type: 'number'
            },
            v56209070: {
                title: '60-70cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207080: {
                title: '70-80cm土壤体积含水量',
                type: 'number'
            },
            v56208080: {
                title: '70-80cm土壤相对湿度',
                type: 'number'
            },
            v56206080: {
                title: '70-80cm土壤重量含水率',
                type: 'number'
            },
            v56209080: {
                title: '70-80cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207090: {
                title: '80-90cm土壤体积含水量',
                type: 'number'
            },
            v56208090: {
                title: '80-90cm土壤相对湿度',
                type: 'number'
            },
            v56206090: {
                title: '80-90cm土壤重量含水率',
                type: 'number'
            },
            v56209090: {
                title: '80-90cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207100: {
                title: '90-100cm土壤体积含水量',
                type: 'number'
            },
            v56208100: {
                title: '90-100cm土壤相对湿度',
                type: 'number'
            },
            v56206100: {
                title: '90-100cm土壤重量含水率',
                type: 'number'
            },
            v56209100: {
                title: '90-100cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207110: {
                title: '100-110cm土壤体积含水量',
                type: 'number'
            },
            v56208110: {
                title: '100-110cm土壤相对湿度',
                type: 'number'
            },
            v56206110: {
                title: '100-110cm土壤重量含水率',
                type: 'number'
            },
            v56209110: {
                title: '100-110cm土壤有效水分贮存量',
                type: 'number'
            },
            v56207120: {
                title: '110-120cm土壤体积含水量',
                type: 'number'
            },
            v56208120: {
                title: '110-120cm土壤相对湿度',
                type: 'number'
            },
            v56206120: {
                title: '110-120cm土壤重量含水率',
                type: 'number'
            },
            v56209120: {
                title: '110-120cm土壤有效水分贮存量',
                type: 'number'
            }
        }
    };

    c01 = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new C01Service(this.http),
        columns: {
            v01000: {
                title: '站号',
                type: 'number'
            },
            c56001: {
                title: '作物名称编码',
                type: 'text'
            },
            c56002: {
                title: '发育期',
                type: 'text'
            },
            d56003: {
                title: '发育时间',
                type: 'number',
                valuePrepareFunction: this.dateFormate
            },
            v56008: {
                title: '植株密度',
                type: 'number'
            },
            v05001: {
                title: '纬度',
                type: 'number'
            },
            v06001: {
                title: '经度',
                type: 'number'
            },
            v07001: {
                title: '测站高度',
                type: 'number'
            },
            tsCreated: {
                title: '创建时间',
                type: 'number',
                valuePrepareFunction: this.dateFormate
            },
            tsUpdated: {
                title: '更新时间',
                type: 'number',
                valuePrepareFunction: this.dateFormate
            },
            tsFreque: {
                title: '修改次数',
                type: 'number'
            },
            observm: {
                title: '观测方式',
                type: 'number'
            },
            v56005: {
                title: '发育期距平',
                type: 'number'
            },
            v56004: {
                title: '发育期百分率',
                type: 'number'
            },
            v56007: {
                title: '生长状况',
                type: 'number'
            },
            v56006: {
                title: '植株高度',
                type: 'number'
            }
        }
    };

    mos = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new MosService(this.http),
        columns: {
            v01000: {
                title: '站号',
                type: 'number'
            },
            v04001: {
                title: '年',
                type: 'number'
            },
            v04002: {
                title: '月',
                type: 'number'
            },
            v04003: {
                title: '日',
                type: 'number'
            },
            v04004: {
                title: '时',
                type: 'number'
            },
            timelimit: {
                title: '时效',
                type: 'number'
            },
            v05001: {
                title: '纬度',
                type: 'number'
            },
            v06001: {
                title: '经度',
                type: 'number'
            },
            v07001: {
                title: '测站高度',
                type: 'number'
            },
            v12001000: {
                title: '预报时刻温度值',
                type: 'number'
            },
            v13003000: {
                title: '相对湿度',
                type: 'number'
            },
            v11001000: {
                title: '预报时刻风向值',
                type: 'number'
            },
            v11002000: {
                title: '预报时刻风速值',
                type: 'number'
            },
            v10004000: {
                title: '预报时刻气压值',
                type: 'number'
            },
            v13019000: {
                title: '预报时刻降水量值',
                type: 'number'
            },
            v20010000: {
                title: '预报时刻总云量值',
                type: 'number'
            },
            v20051000: {
                title: '预报时刻低云量值',
                type: 'number'
            },
            v20063000: {
                title: '预报时刻天气现象值',
                type: 'number'
            },
            v20001000: {
                title: '预报时刻能见度值',
                type: 'number'
            },
            v12016: {
                title: '时效最高气温',
                type: 'number'
            },
            v12017: {
                title: '时效最低气温',
                type: 'number'
            },
            v13006: {
                title: '时效最大相对湿度',
                type: 'number'
            },
            v13007: {
                title: '时效最小相对湿度',
                type: 'number'
            },
            v13019024: {
                title: '24小时降水量',
                type: 'number'
            },
            v13019012: {
                title: '12小时降水量',
                type: 'number'
            },
            v20010012: {
                title: '12时总云量',
                type: 'number'
            },
            v20051012: {
                title: '12小时低云量',
                type: 'number'
            },
            v20063012: {
                title: '12小时天气现象',
                type: 'number'
            },
            v11001012: {
                title: '12小时平均风速',
                type: 'number'
            },
            v11002012: {
                title: '12小时最大平均风速',
                type: 'number'
            },
            v11002001: {
                title: '日最大平均风速（0.1m/s）',
                type: 'number'
            },
            v12001: {
                title: '日平均温度',
                type: 'number'
            },
            v20051: {
                title: '日平均低云量',
                type: 'number'
            },
            v20010: {
                title: '日平均总云量',
                type: 'number'
            }
        }
    };

    viewer = {
        actions: {
            add: false,
            edit: false,
            delete: false
        },
        filter: false,
        service: new CropDictService(this.http),
        columns: {
            // cExpcode: {
            //     title: '编码',
            //     type: 'text'
            // },
            areaName: {
                title: '区域',
                type: 'text'
            },
            cCropname: {
                title: '作物',
                type: 'text'
            },
            c56002: {
                title: '品种-发育期',
                type: 'text'
            },
            dStartdate: {
                title: '开始时间',
                type: 'number',
                valuePrepareFunction: this.convertToDate
            },
            dEnddate: {
                title: '结束时间',
                type: 'number',
                valuePrepareFunction: this.convertToDate
            },
            dists: {
                title: '详细',
                type: 'html',
                valuePrepareFunction: (cell, row) => {
                    return `<a title="详细" href="#/pages/datas/editor/index?area=${row.v01000}&code=${row.cCropcode}&id=${row.cExpcode}"><i class="ion-edit"></i></a>`
                },
                filter: false
            },
            // cAdvise: {
            //     title: '农事建议',
            //     type: 'number'
            // },
            // cDadvise: {
            //     title: '防灾减灾建议',
            //     type: 'number'
            // }
        }
    };

    crop = {
        actions: {
            columnTitle: '操作',
            add: true,
            edit: true,
            delete: true
        },
        add: {
            addButtonContent: '<i class="ion-ios-plus-outline"></i>',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmCreate: true
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true
        },
        filter: false,
        service: new CropDictService(this.http),
        columns: {
            // cCode: {
            //     title: '编码',
            //     type: 'text'
            // },
            cCropname: {
                title: '作物名称',
                type: 'text'
            },
            cCrop: {
                title: '作物',
                type: 'text'
            },
            cCropvirteties: {
                title: '作物品种',
                type: 'text'
            },
            cCropmature: {
                title: '作物熟性',
                type: 'text'
            }
        }
    };

    dev = {
        actions: {
            columnTitle: '操作',
            add: true,
            edit: true,
            delete: true
        },
        add: {
            addButtonContent: '<i class="ion-ios-plus-outline"></i>',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmCreate: true
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true
        },
        filter: false,
        columns: {
            // cCode: {
            //     title: '编码',
            //     type: 'text'
            // },
            cCrop: {
                title: '作物',
                type: 'text'
            },
            cCorpdev: {
                title: '发育期',
                type: 'text'
            }
        }
    };
}