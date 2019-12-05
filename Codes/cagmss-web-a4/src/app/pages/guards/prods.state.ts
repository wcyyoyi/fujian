import { Injectable } from '@angular/core';

@Injectable()
export class ProdState {

    constructor() {
    }

    cgfc = {
        title: '作物长势监测',
        crops: {
            eari: '双季早稻',
            lari: '双季晚稻'
        },
        rule: '{4}未来{12}天预报',
        format: this.nameFormat.bind(this)
    }

    nameFormat(rules: string, name: string) {
        let reg = /{([^{}]+)}/gm;
        let values = name.split('_');

        return rules.replace(reg, (match, index) => {
            let value: string;
            if (index == 4) {
                value = this.dateFormat(values[index]);
            }
            else if (index == 12) {
                value = this.timelimitFormat(values[index]);
            }

            return value;
        });
    }

    // YYYYMMDDHHMMss
    dateFormat(strDate: string): string {
        if (strDate && strDate.length == 14) {
            let year: number = Number.parseInt(strDate.slice(0, 4));
            let month: number = Number.parseInt(strDate.slice(4, 6));
            let date: number = Number.parseInt(strDate.slice(6, 8));

            let hour: number = Number.parseInt(strDate.slice(8, 10));
            let minute: number = Number.parseInt(strDate.slice(10, 11));
            let second: number = Number.parseInt(strDate.slice(11, 13));
            
            //let prodDate = new Date(year, month, date, hour, minute, second);
            let showDate = year + "年" + month + "月" + date + "日";

            return showDate;
        }
    }

    // 024
    timelimitFormat(timeLimit: string): string {
        if (timeLimit) {
            let nTimeLimit = Number.parseInt(timeLimit);
            let nDate: number = nTimeLimit / 24;

            return nDate.toString();
        }
    }
}