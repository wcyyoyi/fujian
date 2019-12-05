import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { SelectItem, ClassesInfo, IndexInfo } from '../../../models';
import { environment } from 'environments/environment';

@Component({
    selector: 'modal-content',
    styleUrls: ['./modals.scss'],
    templateUrl: './modals.html'
})

export class IndexTypeModal implements OnInit {
    title: string = "指标设置";
    indexType: string = "1";

    private selIndexInfo: IndexInfo = new IndexInfo();
    set indexInfo(info: IndexInfo) {
        this.selIndexInfo = info;
        if (this.selIndexInfo) {
            // this.onClassesChange(this.selIndexInfo.classes);
            // this.addClasses(this.selIndexInfo.classes);
            if (this.indexType == '2') {
                if (this.selIndexInfo.eleCode == null || this.selIndexInfo.eleCode == undefined) {
                    this.selDayEleItem = this.dayList[0];
                    this.selMosEleItem = this.mosList[0];
                    return;
                }
                let eleCodeArr = this.selIndexInfo.eleCode.split(',');

                let dayItem = this.dayList.find(it => it.code == eleCodeArr[0]);
                if (dayItem)
                    this.onEleChange(dayItem, 'day');

                let mosItem = this.mosList.find(it => it.code == eleCodeArr[1]);
                if (mosItem)
                    this.onEleChange(mosItem, 'mos');
            } else {
                let eleItem = this.eleList.find(it => it.code == this.selIndexInfo.eleCode);
                if (eleItem)
                    this.onEleChange(eleItem);
                else
                    this.selIndexInfo.eleCode = this.selEleItem.code;
            }
        }
    }
    get indexInfo(): IndexInfo { return this.selIndexInfo; }

    // public selClasses: number = 1;
    public mosList: Array<SelectItem>;
    public dayList: Array<SelectItem>;
    public eleList: Array<SelectItem>;
    public selMosEleItem = new SelectItem();
    public selDayEleItem = new SelectItem();
    public selEleItem = new  SelectItem();

    jiance = new ClassesInfo();
    yubao = new ClassesInfo();

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.mosList = environment.mosList;
        this.dayList = environment.dayList;
        this.eleList = environment.mosList;
        // this.onEleChange(this.mosList[0]);
    }

    onClassesChange(value: number) {
        if (!value) return;
        // this.selClasses = value;
        this.selIndexInfo.classes = value;
    }

    onEleChange(item: SelectItem, type?) {
        if (!item) return;
        if (type === 'mos') {
            this.selMosEleItem = item;
        } else if (type === 'day') {
            this.selDayEleItem = item;
        }else{
            this.selEleItem = item;
            this.selIndexInfo.eleCode = this.selEleItem.code;
        }
    }

    onNameChange(target: any, ci: ClassesInfo) {
        if (!target || !ci) return;

        ci.name = target.value;
    }

    onRangeChange(target: any, ci: ClassesInfo) {
        if (!target || !ci) return;

        if (target.name == "txtLow") {
            ci.min = target.value;
        }
        else if (target.name == "txtUp") {
            ci.max = target.value;
        }
    }

    onDateChange(target: any, ci: ClassesInfo) {
        if (!target || !ci) return;
        ci.total = target.value;
    }

    onValueChange(value: boolean) {
        this.selIndexInfo.values[0].isValid = value;
    }

    addClasses(value: number) {
        if (!value) return;

        this.selIndexInfo.values = new Array<ClassesInfo>();
        for (let i = 0; i < value; i++) {
            let info = new ClassesInfo();
            info.name = "级别" + (i + 1);

            this.selIndexInfo.values.push(info);
        }
    }

    closeModal() {
        if (this.indexType === '2') {
            this.selIndexInfo.eleCode = this.selDayEleItem.code + ',' + this.selMosEleItem.code;
            this.selIndexInfo.values = new Array<ClassesInfo>();
            this.selIndexInfo.values.push(this.jiance);
            this.selIndexInfo.values.push(this.yubao);
        }
        this.bsModalRef.hide();
    }
}