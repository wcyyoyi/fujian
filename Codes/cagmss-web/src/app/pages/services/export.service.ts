import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
    constructor() {
    }

    exportAsExcelFile(array, fileName) {
        const wb = {
            SheetNames: ['Sheet1'],
            Sheets: {},
            Props: {}
        };
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(array);
        let blob = new Blob([this.s2ab(XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' }))]
            , { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, fileName + '.xlsx');
    }

    private s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            let buf = new Array(s.length);
            for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    }
}
