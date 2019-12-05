import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { SurfaceService } from '../services/surface.service';
import { ASMMService } from '../services/asmm.service';
import { SHourService } from '../services/shour.service';
import { C01Service } from '../services/c01.service';
import { MosService } from '../services/mos.service';
import { CropDictService } from '../services/cropDict.service';
import { CliService } from '../services/cli.service';
import { DictionaryService } from '../utils/Dictionary.service';
import { ConverterService } from '../utils/Converter/converter.service';

@Injectable()
export class DataState {
    constructor(private http: Http, private converterService: ConverterService) {
    }
    surface = {
        service: new SurfaceService(this.http),
        settings: [
            {
                headerName: '站名',
                field: 'v01000',
                valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '年',
                field: 'v04001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '月',
                field: 'v04002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日',
                field: 'v04003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '平均气温(℃)',
                field: 'v12001',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12001),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最高气温(℃)',
                field: 'v12052',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12052),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最低气温(℃)',
                field: 'v12053',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12053),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '水汽压(百帕)',
                field: 'v13004',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v13004),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20_20时降水量(mm)',
                field: 'v13201',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v13201),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '风速(m/s)',
                field: 'v11002',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v11002),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日照时数(hr)',
                field: 'v14032',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v14032),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '本站气压(百帕)',
                field: 'v10004',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v10004),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '相对湿度(%)',
                field: 'v13003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最小相对湿度(%)',
                field: 'v13007',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最大相对湿度(%)',
                field: 'v13006',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '露点温度(℃)',
                field: 'v12003',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12003),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '总云量(成)',
                field: 'v20010',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v20010),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '低云量(成)',
                field: 'v20051',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v20051),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0厘米地温(℃)',
                field: 'v12240',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12240),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最高地温(℃)',
                field: 'v12213',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12213),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最低地温(℃)',
                field: 'v12214',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v12214),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20-8时降水量(mm)',
                field: 'v13203',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v13203),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '8-20时降水量(mm)',
                field: 'v13204',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v13204),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日蒸发量大型',
                field: 'v13242',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日蒸发量小型',
                field: 'v13241',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '积雪深度(cm)',
                field: 'v20235',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v20235),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '08-08时降水(mm)',
                field: 'v13202',
                valueFormatter: (value) => this.converterService.multipleConv(value.data.v13202),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '蒸发量',
                field: 'v13031',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
        ]
    };

    shour = {
        service: new SHourService(this.http),
        settings: [
            {
                headerName: '站名',
                field: 'v01000',
                valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '年',
                field: 'v04001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '月',
                field: 'v04002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日',
                field: 'v04003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时',
                field: 'v04004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '测站高度',
                field: 'v07001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '台站类型',
                field: 'v02001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '本站气压(百帕)',
                field: 'v10004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '海平面气压(百帕)',
                field: 'v10051',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '风向(位于10米处)',
                field: 'v11001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '风速(位于10米处)(m/s)',
                field: 'v11002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '资料类型',
                field: 'Datatype',
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '纬度',
                field: 'v05001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '经度',
                field: 'v06001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '干球温度(位于2米处)(℃)',
                field: 'v12001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '露点温度(位于2米处)(℃)',
                field: 'v12003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '相对湿度(%)',
                field: 'v13003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '总云量(成)',
                field: 'v20010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '低云或中云的云量(成)',
                field: 'v20011',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '观测前24小时降水量(mm)',
                field: 'v13023',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '24小时最高气温(℃)',
                field: 'v12016',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '24小时最低气温(℃)',
                field: 'v12017',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '蒸发量',
                field: 'v13031',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '总日照',
                field: 'v14032',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '天气现象',
                field: 'v20003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '最大相对湿度(%)',
                field: 'vdate',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '特殊天气现象1',
                field: 'v20063001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '特殊天气现象2',
                field: 'v20063002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '积雪深度(cm)',
                field: 'v20235',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '冻土深度第1栏上限值',
                field: 'v20270001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '冻土深度第1栏下限值',
                field: 'v20270002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '冻土深度第2栏上限值',
                field: 'v20270003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '冻土深度第2栏下限值',
                field: 'v20270004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
        ]
    }
    asmm = {
        service: new ASMMService(this.http),
        settings: [
            {
                headerName: '站名',
                field: 'v01000',
                valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '年',
                field: 'v04001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '月',
                field: 'v04002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日',
                field: 'v04003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时',
                field: 'v04004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '分',
                field: 'v04005',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '秒',
                field: 'v04006',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '测站海拔高度',
                field: 'v07001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '测量地段标示数字',
                field: 'v56001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0-10cm土壤体积含水量(%)',
                field: 'v56207010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0-10cm土壤相对湿度(%)',
                field: 'v56208010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0-10cm土壤重量含水率(%)',
                field: 'v56206010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0-10cm土壤有效水分贮存量',
                field: 'v56209010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10-20cm土壤体积含水量(%)',
                field: 'v56207020',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10-20cm土壤相对湿度(%)',
                field: 'v56208020',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10-20cm土壤重量含水率(%)',
                field: 'v56206020',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10-20cm土壤有效水分贮存量',
                field: 'v56209020',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20-30cm土壤体积含水量(%)',
                field: 'v56207030',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20-30cm土壤相对湿度(%)',
                field: 'v56208030',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20-30cm土壤重量含水率(%)',
                field: 'v56206030',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20-30cm土壤有效水分贮存量',
                field: 'v56209030',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30-40cm土壤体积含水量(%)',
                field: 'v56207040',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30-40cm土壤相对湿度(%)',
                field: 'v56208040',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30-40cm土壤重量含水率(%)',
                field: 'v56206040',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30-40cm土壤有效水分贮存量',
                field: 'v56209040',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40-50cm土壤体积含水量(%)',
                field: 'v56207050',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40-50cm土壤相对湿度(%)',
                field: 'v56208050',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40-50cm土壤重量含水率(%)',
                field: 'v56206050',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40-50cm土壤有效水分贮存量',
                field: 'v56209050',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50-60cm土壤体积含水量(%)',
                field: 'v56207060',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50-60cm土壤相对湿度(%)',
                field: 'v56208060',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50-60cm土壤重量含水率(%)',
                field: 'v56209060',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50-60cm土壤有效水分贮存量',
                field: 'v56209060',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60-70cm土壤体积含水量(%)',
                field: 'v56207070',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60-70cm土壤相对湿度(%)',
                field: 'v56208070',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60-70cm土壤重量含水率(%)',
                field: 'v56206070',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60-70cm土壤有效水分贮存量',
                field: 'v56209070',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '70-80cm土壤体积含水量(%)',
                field: 'v56207080',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '70-80cm土壤相对湿度(%)',
                field: 'v56208080',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '70-80cm土壤重量含水率(%)',
                field: 'v56206080',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '70-80cm土壤有效水分贮存量',
                field: 'v56209080',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '80-90cm土壤体积含水量(%)',
                field: 'v56207090',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '80-90cm土壤相对湿度(%)',
                field: 'v56208090',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '80-90cm土壤重量含水率(%)',
                field: 'v56206090',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '80-90cm土壤有效水分贮存量',
                field: 'v56209090',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '90-100cm土壤体积含水量(%)',
                field: 'v56207100',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '90-100cm土壤相对湿度(%)',
                field: 'v56208100',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '90-100cm土壤重量含水率(%)',
                field: 'v56206100',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '90-100cm土壤有效水分贮存量',
                field: 'v56209100',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '100-110cm土壤体积含水量(%)',
                field: 'v56207110',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '100-110cm土壤相对湿度(%)',
                field: 'v56208110',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '100-110cm土壤重量含水率(%)',
                field: 'v56206110',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '100-110cm土壤有效水分贮存量',
                field: 'v56209110',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '110-120cm土壤体积含水量(%)',
                field: 'v56207120',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '110-120cm土壤相对湿度(%)',
                field: 'v56208120',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '110-120cm土壤重量含水率(%)',
                field: 'v56206120',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '110-120cm土壤有效水分贮存量',
                field: 'v56209120',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '纬度',
                field: 'v05001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '经度',
                field: 'v06001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
        ]
    }

    c01 = {
        service: new C01Service(this.http),
        settings: [
            {
                headerName: '站名',
                field: 'v01000',
                valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '作物名称',
                field: 'c56001',
                valueFormatter: (value) => this.converterService.cropCodeToName(value.data.c56001),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '发育期',
                field: 'c56002',
                valueFormatter: (value) => this.converterService.devCodeToName(value.data.c56001, value.data.c56002),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '发育时间',
                field: 'd56003',
                valueFormatter: (value) => this.converterService.timestampToFormateDate(value.data.d56003),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '植株密度',
                field: 'v56008',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '测站高度',
                field: 'v07001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '发育期距平',
                field: 'v56005',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '发育期百分率',
                field: 'v56004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '生长状况',
                field: 'v56007',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '植株高度',
                field: 'v56006',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '创建时间',
                field: 'tsCreated',
                valueFormatter: (value) => this.converterService.timestampToFormateDate(value.data.tsCreated),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '更新时间',
                field: 'tsUpdated',
                valueFormatter: (value) => this.converterService.timestampToFormateDate(value.data.tsUpdated),
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '纬度',
                field: 'v05001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '经度',
                field: 'v06001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '修改次数',
                field: 'tsFreque',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '观测方式',
                field: 'observm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
        ]
    }
    mos = {
        service: new MosService(this.http),
        settings: [
            {
                headerName: '站名',
                field: 'v01000',
                valueFormatter: (value) => this.converterService.statCodToName(value.data.v01000),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '年',
                field: 'v04001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '月',
                field: 'v04002',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日',
                field: 'v04003',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时',
                field: 'v04004',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时效',
                field: 'timelimit',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '测站高度',
                field: 'v07001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻温度值(℃)',
                field: 'v12001000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '相对湿度(%)',
                field: 'v13003000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻风向值',
                field: 'v11001000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻风速值(m/s)',
                field: 'v11002000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻气压值(百帕)',
                field: 'v10004000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '纬度',
                field: 'v05001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '经度',
                field: 'v06001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '预报时刻降水量值(mm)',
                field: 'v13019000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻总云量值(成)',
                field: 'v20010000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻低云量值(成)',
                field: 'v20051000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻天气现象值',
                field: 'v20063000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '预报时刻能见度值',
                field: 'v20001000',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时效最高气温(℃)',
                field: 'v12016',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时效最低气温(℃)',
                field: 'v12017',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时效最大相对湿度(%)',
                field: 'v13006',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '时效最小相对湿度(%)',
                field: 'v13007',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '24小时降水量(mm)',
                field: 'v13019024',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '12小时降水量(mm)',
                field: 'v13019012',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '12时总云量(成)',
                field: 'v20010012',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '12小时天气现象',
                field: 'v20063012',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '12小时平均风速(m/s)',
                field: 'v11001012',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '12小时最大平均风速(m/s)',
                field: 'v11002012',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日最大平均风速（0.1m/s）',
                field: 'v11002001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日平均温度(℃)',
                field: 'v12001',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日平均低云量(成)',
                field: 'v20051',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日平均总云量(成)',
                field: 'v20010',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
        ]
    }
    cli = {
        service: new CliService(this.http),
        settings: [
            {
                headerName: '站号',
                field: 'stationid',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true },
            },
            {
                headerName: '站名',
                field: 'stationnm',
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '观测作物名称',
                field: 'cropnm',
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '日期',
                field: 'observtime',
                valueFormatter: (value) => this.converterService.numToDate(value.data.observtime),
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm气温(℃)',
                field: 'ttt30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm风速(m/s)',
                field: 'ws30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm空气相对湿度(%)',
                field: 'rh30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '0cm地温(℃)',
                field: 'st0cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10cm土壤体积含水率(%)',
                field: 'vsm10cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10cm土壤相对湿度(%)',
                field: 'rsm10cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '省名',
                field: 'provincenm',
                filter: "agTextColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '经度',
                field: 'lon',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '纬度',
                field: 'lat',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '海拔高度',
                field: 'h',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '本站气压(百帕)',
                field: 'ppp',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60cm气温(℃)',
                field: 'ttt60cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '150cm气温(℃)',
                field: 'ttt150cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '300cm气温(℃)',
                field: 'ttt300cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '冠层温度(℃)',
                field: 'canopyt',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '小时降水量(mm)',
                field: 'r01',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60cm(m/s)',
                field: 'ws60cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '150cm风速(m/s)',
                field: 'ws150cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '300cm风速(m/s)',
                field: 'ws300cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '600cm风速(m/s)',
                field: 'ws600cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '60cm空气相对湿度(%)',
                field: 'rh60cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '150cm空气相对湿度(%)',
                field: 'rh150cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '300cm空气相对湿度(%)',
                field: 'rh300cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '5cm地温(℃)',
                field: 'st5cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '10cm地温(℃)',
                field: 'st10cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '15cm地温(℃)',
                field: 'st15cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20cm地温(℃)',
                field: 'st20cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm地温(℃)',
                field: 'st30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40cm地温(℃)',
                field: 'st40cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50cm地温(℃)',
                field: 'st50cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20cm土壤体积含水率(%)',
                field: 'vsm20cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm土壤体积含水率(%)',
                field: 'vsm30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40cm土壤体积含水率(%)',
                field: 'vsm40cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50cm土壤体积含水率(%)',
                field: 'vsm50cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '20cm土壤相对湿度(%)',
                field: 'rsm20cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '30cm土壤相对湿度(%)',
                field: 'rsm30cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '40cm土壤相对湿度(%)',
                field: 'rsm40cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
            {
                headerName: '50cm土壤相对湿度(%)',
                field: 'rsm50cm',
                filter: "agNumberColumnFilter",
                filterParams: { applyButton: true, clearButton: true }
            },
        ]
    };
    viewer = {
        actions: {
            columnTitle: '操作',
            add: false,
            edit: false,
            delete: true
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true
        },
        service: new CropDictService(this.http),
        columns: {
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
                valuePrepareFunction: (value) => this.converterService.numberToDate(value)
            },
            dEnddate: {
                title: '结束时间',
                type: 'number',
                valuePrepareFunction: (value) => this.converterService.numberToDate(value)
            },
            dists: {
                title: '详细',
                type: 'html',
                valuePrepareFunction: (cell, row) => {
                    return `<a title="详细" href="#/pages/datas/editor/index?area=${row.v01000}&code=${row.cCropcode}&id=${row.cExpcode}"><i class="ion-edit"></i></a>`
                },
                filter: false
            },
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
                title: '作物分类',
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