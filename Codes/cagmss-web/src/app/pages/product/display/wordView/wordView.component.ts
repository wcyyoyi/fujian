import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProdService } from '../../../services/product.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'wordview',
    templateUrl: 'wordView.html'
})

export class WordViewComponent implements OnInit {
    prodList = new Array();
    src;
    num;
    title;
    constructor(private _prodService: ProdService,
        private bsModalRef: BsModalRef,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this._prodService.currentWordPoint().subscribe((value: any) => {
            this.prodList = value.list;
            this.num = value.num - 1;
            this.title = this.prodList[this.num].cnName;
            this._prodService.getById(this.prodList[this.num].fileName).subscribe(data => {
                this.src = this.changeToken(data);
            });
        });
    }

    pagination(pag) {
        this.num += pag;
        if (this.num >= 0 && this.num < this.prodList.length) {
            this._prodService.getById(this.prodList[this.num].fileName).subscribe(data => {
                this.src = this.changeToken(data);
            });
            this.title = this.prodList[this.num].cnName;
        } else if (this.num < 0) {
            this.num = 0;
        } else {
            this.num = this.prodList.length - 1;
        }
    }

    changeToken(html) {
        html = this._prodService.replaceHtml(html);
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
