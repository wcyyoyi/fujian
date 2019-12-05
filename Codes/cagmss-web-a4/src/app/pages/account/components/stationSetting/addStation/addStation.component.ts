import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { NewStation } from '../../../../models/newStation';
import { AreaService } from '../../../../services';
import { StationService } from '../../../../services';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { MangStat } from '../../../../utils/models/mang_stat';
@Component({
    selector: 'add-station',
    templateUrl: 'addStation.html',
    styleUrls: ['addStation.scss'],
    
})

export class AddStationComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public form: FormGroup;
    public cAera: AbstractControl;
    public cAgmesta: AbstractControl;
    public cAutosoilsta: AbstractControl;
    public cCity: AbstractControl;
    public cCode: AbstractControl;
    public cCropsta: AbstractControl;
    public cMeteosta: AbstractControl;
    public cPrvoName: AbstractControl;
    public cSoilsta: AbstractControl;
    public cStatName: AbstractControl;
    public cTypestation: AbstractControl;
    public v01000: AbstractControl;
    public v05001: AbstractControl;
    public v06001: AbstractControl;
    public v07001: AbstractControl;
    public newStation = new NewStation();
    public areaList: Array<any>;
    public codeList: Array<any>;
    public selArea: string;
    public typeList: Array<any>;
    public selType: string;
    public selCode: number;
    constructor(private yzNgxToastyService: YzNgxToastyService,
        fb: FormBuilder, private areaService: AreaService, private stationService: StationService) {
        this.form = fb.group({
            'cAera': ['', Validators.compose([Validators.required])],
            'cAgmesta': ['', Validators.compose([Validators.required])],
            'cAutosoilsta': ['', Validators.compose([Validators.required])],
            'cCity': ['', Validators.compose([Validators.required])],
            'cCode': ['', Validators.compose([Validators.required])],
            'cCropsta': ['', Validators.compose([Validators.required])],
            'cMeteosta': ['', Validators.compose([Validators.required])],
            'cPrvoName': ['', Validators.compose([Validators.required])],
            'cSoilsta': ['', Validators.compose([Validators.required])],
            'cStatName': ['', Validators.compose([Validators.required])],
            'cTypestation': ['', Validators.compose([Validators.required])],
            'v01000': ['', Validators.compose([Validators.required])],
            'v05001': ['', Validators.compose([Validators.required])],
            'v06001': ['', Validators.compose([Validators.required])],
            'v07001': ['', Validators.compose([Validators.required])],
        });
        this.cAera = this.form.controls['cAera'];
        this.cAgmesta = this.form.controls['cAgmesta'];
        this.cAutosoilsta = this.form.controls['cAutosoilsta'];
        this.cCity = this.form.controls['cCity'];
        this.cCode = this.form.controls['cCode'];
        this.cCropsta = this.form.controls['cCropsta'];
        this.cMeteosta = this.form.controls['cMeteosta'];
        this.cPrvoName = this.form.controls['cPrvoName'];
        this.cSoilsta = this.form.controls['cSoilsta'];
        this.cStatName = this.form.controls['cStatName'];
        this.cTypestation = this.form.controls['cTypestation'];
        this.v01000 = this.form.controls['v01000'];
        this.v05001 = this.form.controls['v05001'];
        this.v06001 = this.form.controls['v06001'];
        this.v07001 = this.form.controls['v07001'];
    }

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.areaList = new Array();
        this.typeList = new Array();
        this.codeList = new Array();
        this.getStationType();
        this.getAreaList();
        this.getCodeList();
    }
    public onSubmit(values: Object): void {
        if (this.form.valid) {
            for (var key in values) {
                if (key == "cAgmesta" || key == "cAutosoilsta" || key == "cCropsta" || key == "cMeteosta" || key == "cSoilsta")
                    values[key] = values[key] == "1" ? "是" : "否";
            }
            this.addNewStation(values);
        }
    }
    getCodeList() {
        let cPCode = JSON.parse(localStorage.getItem("activeUser"))["area"]["pCode"];
        let level = JSON.parse(localStorage.getItem("activeUser"))["area"]["level"];
        if (level == 3) {
            this.getAreaDetail(cPCode);
            return;
        }
        this.areaService.getAllChildren(cPCode).subscribe(data => {
            if (!data) return;
            data.forEach(item => {
                if (item["vLevel"] == 3) {
                    this.codeList.push(item)
                }
            })
            this.selCode = this.codeList[0]["cCode"];
        })
    }
    getAreaDetail(cPCode) {
        this.areaService.getDetailByCpcode(cPCode).subscribe(data => {
            if (!data) return;
            this.codeList.push(data);
            this.selCode = this.codeList[0]["cCode"];
        })
    }
    getAreaList() {
        this.areaService.getArea().subscribe(data => {
            if (!data) return;
            this.areaList = data;
            this.selArea = data[0]["cName"]
        })
    }
    onCodeChange(code) {
        if (!code) return;
        let area = this.codeList.find(item => item["cCode"] == code);
        if (!area) return;
        this.getParentCode(area["cPCode"])
    }
    getParentCode(cPCode) {
        this.newStation.cCity = "";
        this.newStation.cPrvoName = "";
        this.getParentByCode(cPCode).then(data => {
            if (!data) return;
            this.newStation.cCity = data["cName"];
            this.getParentByCode(data["cPCode"]).then(_data => {
                if (!_data) return;
                this.newStation.cPrvoName = _data["cName"];
            })
        })
    }
    addNewStation(values) {
        this.yzNgxToastyService.wait("正在添加站点请稍后", "");
        this.stationService.addnewStation(values).toPromise().then(data => {
            this.yzNgxToastyService.close();
            if (!data) {
                this.yzNgxToastyService.error("添加站点失败", "", 3000);
                return;
            }
            this.yzNgxToastyService.success("添加站点成功", "", 3000);
            this.setStation();
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("添加站点失败", "", 3000)
        })
    }
    getParentByCode(cPCode) {
        return this.areaService.getAreaParent(cPCode).toPromise();
    }
    getStationType() {
        this.stationService.getStationType().subscribe(data => {
            if (!data) return;
            this.typeList = data;
            this.selType = data[0]["code"];
        })
    }
    setStation() {
        localStorage.removeItem('MANG_STAT');
        return this.stationService.getAll().toPromise().then((statList: Array<MangStat>) => {
            let code = this.stationService.areaCode.toString().substring(0, this.stationService.level * 2);
            let filter = statList.filter(stat => { return stat.cCode != null && stat.cCode.startsWith(code) });
            filter.forEach(stat => {
                if (stat.cTypestation !== '区域站') {
                    stat.cTypestation = '国家站';
                }
            });
            localStorage.setItem('MANG_STAT', JSON.stringify(filter));
        });
    }
}
