import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProdService } from '../../../services/product.service';
import { BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'imgview',
    templateUrl: 'imgViewer.html'
})

export class ImgViewComponent implements OnInit {
    prodList = new Array();
    src;
    num;
    title = '正在加载';
    constructor(
        private bsModalRef: BsModalRef,
        private sanitizer: DomSanitizer,
        private _prodService: ProdService) { }

    ngOnInit() {
        this._prodService.currentImgPoint().subscribe((value: any) => {
            this.prodList = value.list;
            this.num = value.num - 1;
            this.title = this.prodList[this.num].cnName;
            this.src = this._prodService.getUrl(this.prodList[this.num].fileName);
        });
    }

    pagination(pag) {
        this.num += pag;
        if (this.num >= 0 && this.num < this.prodList.length) {
            this.src = this._prodService.getUrl(this.prodList[this.num].fileName);
            this.title = this.prodList[this.num].cnName;
        } else if (this.num < 0) {
            this.num = 0;
        } else {
            this.num = this.prodList.length - 1;
        }
    }
}
