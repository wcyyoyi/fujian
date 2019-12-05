import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ProdService } from '../../services/product.service';
import 'style-loader!./tableView.modal.scss';
@Component({
    selector: 'tableview',
    templateUrl: 'tableView.modal.html',
})
export class TableViewerModalComponent implements OnInit {
    @Input()
    prodList = new Array<{ fileName: string; label: string; }>();
    @Input()
    num;
    src;
    title = '正在加载';
    public result: Array<Array<string>>;
    constructor(private bsModalRef: BsModalRef, private sanitizer: DomSanitizer, private prodService: ProdService) { }
    ngOnInit() {
    }
    viewInit() {
        this.getData();
    }
    getData() {
        let fileName = this.prodList[this.num].fileName;
        this.title = this.prodList[this.num].label;
        this.result = new Array();
        this.prodService.getCsvData(fileName).subscribe(data => {
            if (!data) return;
            let dataArr = data.split("\r\n");
            dataArr.forEach(item => {
                if(item!=""){
                    let listArr = item.split(",");
                    this.result.push(listArr)
                }
            })
        })
    }
}