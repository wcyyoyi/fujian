import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { WordViewComponent } from '../wordView/wordView.component';
import { ProdService } from '../../../services/product.service';
import { WordService } from '../../../services/word.service';

@Component({
    selector: 'component',
    template: `<a (click)="download()">下载</a>&nbsp;<a (click)="htmlDetail()">查看</a>`
})

export class BComponent implements OnInit {
    @Input() value;

    modalRef: BsModalRef;
    constructor(
        private modalService: BsModalService,
        private _prodService: ProdService,
        private _wordService: WordService) { }

    ngOnInit() { }

    download() {
        let str: string = this.value.fileName;
        str = str.replace(str.substring(str.indexOf('.'), str.length), '.docx');
        let url = this._prodService.download(str);
        window.open(url);
    }

    htmlDetail() {
        this.modalRef = this.modalService.show(WordViewComponent, { class: 'modal-lg' });
        this._prodService.setWordPoint({ list: this.value.list, num: this.value.num });
    }
}
