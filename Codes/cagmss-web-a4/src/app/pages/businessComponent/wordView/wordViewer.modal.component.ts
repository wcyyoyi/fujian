import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ProdService } from '../../services/product.service';
import 'style-loader!./wordViewer.modal.scss';
@Component({
    selector: 'wordview',
    templateUrl: 'wordViewer.modal.html',
})
export class WordViewerModalComponent implements OnInit {
    @Input()
    prodList = new Array<{ fileName: string; label: string; }>();
    @Input()
    num;
    src;
    title = '正在加载';

    // width;
    // height;

    constructor(private bsModalRef: BsModalRef, private sanitizer: DomSanitizer, private prodService: ProdService) { }
    ngOnInit() {
    }
    viewInit() {
        if (this.prodList || this.prodList.length > 0) {
            this.src = this.prodService.getUrl(this.prodList[this.num].fileName);
            this.title = this.prodList[this.num].label;
        }
    }
    pagination(pag) {
        this.num += pag;
        if (this.num >= 0 && this.num < this.prodList.length) {
            this.src = this.prodService.getUrl(this.prodList[this.num].fileName);
            this.title = this.prodList[this.num].label;
        }
        else if (this.num < 0) {
            this.num = 0;
        }
        else {
            this.num = this.prodList.length - 1;
        }
    }

    changeToken(html) {
        html = this.prodService.replaceHtml(html);
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}