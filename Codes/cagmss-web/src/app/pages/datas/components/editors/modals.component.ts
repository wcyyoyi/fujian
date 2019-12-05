import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { SelectItem, ClassesInfo, IndexInfo } from '../../../models';

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

            let eleItem = this.eleList.find(it => it.code == this.selIndexInfo.eleCode);
            if (eleItem)
                this.onEleChange(eleItem);
            else
                this.selIndexInfo.eleCode = this.selEleItem.code;
        }
    }
    get indexInfo(): IndexInfo { return this.selIndexInfo; }

    // public selClasses: number = 1;
    public eleList: Array<SelectItem>;
    public selEleItem: SelectItem;

    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.eleList = new Array<SelectItem>();
        this.eleList.push({ code: 'V11002', desc: '风速' });
        this.eleList.push({ code: 'V12001', desc: '平均气温' });
        this.eleList.push({ code: 'V12003', desc: '露点温度' });
        this.eleList.push({ code: 'V12052', desc: '最高气温' });
        this.eleList.push({ code: 'V12053', desc: '最低气温' });
        this.eleList.push({ code: 'V12213', desc: '最高地温' });
        this.eleList.push({ code: 'V12214', desc: '最低地温' });
        this.eleList.push({ code: 'V12240', desc: '0厘米地温' });
        this.eleList.push({ code: 'V13003', desc: '相对湿度' });
        this.eleList.push({ code: 'V13004', desc: '水汽压' });
        this.eleList.push({ code: 'V13006', desc: '最大相对湿度' });
        this.eleList.push({ code: 'V13007', desc: '最小相对湿度' });
        this.eleList.push({ code: 'V13201', desc: '20至20时降水量' });
        this.eleList.push({ code: 'V13202', desc: '08至08时降水量' });
        this.eleList.push({ code: 'V13203', desc: '20至8时降水量' });
        this.eleList.push({ code: 'V13204', desc: '8至20时降水量' });
        this.eleList.push({ code: 'V13241', desc: '日蒸发量小型' });
        this.eleList.push({ code: 'V13242', desc: '日蒸发量大型' });
        this.eleList.push({ code: 'V14032', desc: '日照时数' });
        this.eleList.push({ code: 'V20010', desc: '总云量' });
        this.eleList.push({ code: 'V20051', desc: '低云量' });
        this.eleList.push({ code: 'V20235', desc: '积雪深度' });

        this.onEleChange(this.eleList[0]);
    }

    onClassesChange(value: number) {
        if (!value) return;
        // this.selClasses = value;
        this.selIndexInfo.classes = value;
    }

    onEleChange(item: SelectItem) {
        if (!item) return;

        this.selEleItem = item;
        this.selIndexInfo.eleCode = this.selEleItem.code;
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

    onDateChange(value: number) {
        if (!value) return;
        this.selIndexInfo.values[0].total = value;
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
        this.bsModalRef.hide();
    }
}