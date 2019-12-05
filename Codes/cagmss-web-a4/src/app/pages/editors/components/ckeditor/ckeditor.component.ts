import { Component, OnInit, Directive, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import './ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
import { WordService } from '../../../services/word.service';
import { ProdService } from '../../../services/product.service';
import { CKEditorComponent } from 'ng2-ckeditor';

// import 'style-loader!./ckeditor.scss';
import { ProdListComponent } from '../../prodList/prodList.component';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { PdfViewerModalComponent } from 'app/pages/businessComponent/pdfView/pdfViewer.modal.component';

@Component({
  selector: 'ckeditor-component',
  templateUrl: './ckeditor.html',
  styleUrls: ['./ckeditor.scss'],
  
})


export class Ckeditor implements AfterViewInit {
  // date: Date = new Date(2018, 2, 7);
  // date: Date = new Date();
  dataType;
  dataEle;
  isSaved: boolean = false; // 用户是否保存
  isIssued: boolean = true; // 用户是否发布
  isNeedWaterMark: boolean = true; //是否需要加载水印

  productDate: string;

  msg;

  selProd;

  pdfSrc: string;

  modalRef: BsModalRef;

  public ckeditorContent: string = ``;
  public config = {
    uiColor: '#F0F3F4',
    // height: '400px',
    height: 'calc(100% - 72px)',
    bodyClass: 'document-editor',
    contentsCss: [window['CKEDITOR_BASEPATH'] + 'mystyles.css'],
    font_names: '宋体/宋体;黑体/黑体;仿宋/仿宋;楷体/楷体;',
  };

  @ViewChild('doBtn') doBtn;
  @ViewChild('deBtn') deBtn;
  @ViewChild('iBtn') iBtn;
  @ViewChild('sBtn') sBtn;
  @ViewChild('lkBtn') lkBtn;
  @ViewChild('ckeditor') ckeditor: CKEditorComponent;
  @ViewChild('prodList') prodListComponent: ProdListComponent;

  constructor(private wordService: WordService,
    private _route: ActivatedRoute,
    private prodService: ProdService,
    private yzNgxToastyService: YzNgxToastyService,
    private modalService: BsModalService
  ) {
  }

  ngAfterViewInit(): void {
    this._route.params.subscribe((params: Params) => {
      let type = params['data'].split(',');
      this.dataType = type[0];
      this.dataEle = type[1];
    });

    // this.ckeditor.ready.subscribe(() => {
    //   if (this.prodListComponent.initProd == undefined) return;
    //   this.onProdChange(this.prodListComponent.initProd);
    //   if (!this.prodListComponent.initProd.fileName) return;
    //   document.getElementById(this.prodListComponent.initProd.fileName).scrollIntoView(true); // 定位div
    // });

    // this.ckeditor.change.subscribe(() => {
    //   if (!this.isIssued && this.isNeedWaterMark) {
    //     this.ckeditorContent = this.addWaterMark(this.ckeditorContent);
    //     this.isNeedWaterMark = false;
    //   }
    // });    
  }

  btnDisabled() {
    this.iBtn.nativeElement.disabled = false;
    this.sBtn.nativeElement.disabled = false;
    this.doBtn.nativeElement.disabled = false;
    this.deBtn.nativeElement.disabled = false;
    this.lkBtn.nativeElement.disabled = false;
    this.iBtn.nativeElement.innerText = '发布';
    this.sBtn.nativeElement.innerText = '保存';

    // 如果已发布，不可发布，不可保存，可下载，不可删除文档，不可预览
    if (this.isIssued) {
      this.msg = "(已发布，不可编辑)";
      this.iBtn.nativeElement.disabled = true;
      this.sBtn.nativeElement.disabled = true;
      this.doBtn.nativeElement.disabled = false;
      this.deBtn.nativeElement.disabled = true;
      this.lkBtn.nativeElement.disabled = true;
      this.iBtn.nativeElement.innerText = '已发布';
    }
    // 如果保存，可发布，可保存，可下载，可删除文档，可预览
    else if (this.isSaved) {
      this.msg = "(从上次保存继续编辑)";
      this.iBtn.nativeElement.disabled = false;
      this.sBtn.nativeElement.disabled = false;
      this.doBtn.nativeElement.disabled = false;
      this.lkBtn.nativeElement.disabled = false;
      this.deBtn.nativeElement.disabled = false;
      this.iBtn.nativeElement.innerText = '发布';
      this.sBtn.nativeElement.innerText = '保存';
    }
    // 如果未保存未发布，可保存，可发布，不可下载，不可删除存档，不可预览
    else {
      this.iBtn.nativeElement.disabled = false;
      this.sBtn.nativeElement.disabled = false;
      this.doBtn.nativeElement.disabled = true;
      this.deBtn.nativeElement.disabled = true;
      this.lkBtn.nativeElement.disabled = true;
      this.iBtn.nativeElement.innerText = '发布';
      this.sBtn.nativeElement.innerText = '保存';
    }

    // let div: HTMLElement = document.getElementById(this.prodListComponent.initProd.fileName);
    // if (div) div.scrollIntoView(true); // 定位div
  }

  preview() {
    let arr = new Array<{ fileName: string, label: string }>();
    let obj = {
      fileName: "preview/Z_AGME_C_" + this.wordService.makeCompany + "_" + this.productDate + "_P_CAGMSS_" + this.dataType + "_" + this.dataEle + "_5KM_CHN_L88_PD_000_00.pdf",
      label: '预览'
    }
    arr.push(obj);
    this.modalService.config.ignoreBackdropClick = true;
    this.modalRef = this.modalService.show(PdfViewerModalComponent, { class: 'modal-lg' });
    this.modalRef.content.prodList = arr;
    this.modalRef.content.num = 0;
    this.modalRef.content.viewInit();
  }

  save() {
    // let body = this.ckeditor.instance.document.getBody();
    // if (body.$.children[0].id === 'watermark') {
    //   body.$.children[0].parentNode.removeChild(body.$.children[0]);
    // }
    // let htmlStr = body.$.innerHTML;
    let htmlStr = this.ckeditorContent + ``;
    this.yzNgxToastyService.wait('正在保存', '');
    this.wordService.save(htmlStr, this.dataType, this.dataEle, this.productDate).then(() => {
      this.yzNgxToastyService.close();
      this.yzNgxToastyService.success('保存成功', '', 2000);
      this.init();
    }).catch(e => {
      this.yzNgxToastyService.close();
      this.yzNgxToastyService.error('保存失败', e._body, 3000);
    });
  }

  issue() {
    this.yzNgxToastyService.confirm("确认发布？", 'info', (e) => {
      if (!e) return;
      this.wordService.issue(this.dataType, this.dataEle, this.productDate).then(data => {
        this.yzNgxToastyService.success('发布成功', '', 2000);
        this.init();
        this.setAttention();
      }).catch(err => {
        this.yzNgxToastyService.error('发布失败', "", 3000);
      })
    });
  }

  onProdChange(item) {
    if (item == undefined) return;
    this.selProd = item;
    if (this.productDate == item.productDate && item.dataType != 'AWFC') {
      return;
    }
    this.productDate = item.productDate;
    this.init();
  }

  init() {
    this.msg = '';
    this.yzNgxToastyService.wait("正在判断是否发布...", '');
    this.wordService.isIssued(this.dataType, this.dataEle, this.productDate).then((result: boolean) => {
      this.isIssued = result;
      this.yzNgxToastyService.close();
      if (!this.isIssued) {
        this.yzNgxToastyService.wait("正在判断是否保存...", '');
        this.wordService.isSaved(this.dataType, this.dataEle, this.productDate).then((result: boolean) => {
          this.yzNgxToastyService.close();
          this.isSaved = result;
          if (!this.isSaved) {
            this.yzNgxToastyService.wait("正在加载...", '');
            this.wordService.getNewHtml(this.dataType, this.dataEle, this.productDate).then((data: string) => {
              this.ckeditorContent = data + ``;
              // this.ckeditorContent = this.addWaterMark(data + ``);
              this.btnDisabled();
              this.yzNgxToastyService.close();
            });
          } else {
            this.yzNgxToastyService.wait("正在加载...", '');
            this.wordService.getHtmlBySaved(this.dataType, this.dataEle, this.productDate).then((data: string) => {
              this.ckeditorContent = data + ``;
              // this.ckeditorContent = this.addWaterMark(data + ``);
              this.btnDisabled();
              this.yzNgxToastyService.close();

            });
          }
        });
      } else {
        let div: HTMLElement = document.getElementById(this.prodListComponent.initProd.fileName);
        if (div) div.scrollIntoView(true); // 定位div
        this.pdfSrc = this.wordService.pro_url + "/product/Z_AGME_C_" + this.wordService.makeCompany + "_" + this.productDate + "_P_CAGMSS_" + this.dataType + "_" + this.dataEle + "_5KM_CHN_L88_PD_000_00.pdf"
          + "?access_token=" + this.wordService.token.access_token;
      }
    })
  }

  deleteSaved() {
    this.yzNgxToastyService.confirm("确认删除？", 'info', (e) => {
      if (!e) return;
      this.wordService.deleteSaved(this.selProd.dataType, this.selProd.dataElement, this.productDate).then((data) => {
        this.yzNgxToastyService.success("删除成功", '', 2000);
        this.init();
      }).catch(e => {
        this.yzNgxToastyService.error("删除失败", e._body, 2000);
      });
    });
  }

  download() {
    if (this.isIssued) {
      this.downloadByIssue();
    } else if (this.isSaved) {
      this.downloadBySave();
    }
  }

  downloadBySave() {
    let url = this.wordService.downloadBySave(this.dataType, this.dataEle, this.productDate);
    window.open(url);
  }

  downloadByIssue() {
    let url = this.wordService.downloadByIssue(this.dataType, this.dataEle, this.productDate);
    window.open(url);
  }

  addWaterMark(html) {
    // 此处存疑，目前选取的高度为无图片时的高度，当图片加载后高度增加。插件暂无页面加载成功后的回调函数。
    let width = this.ckeditor.instance.document.$.body.clientWidth;
    let height = this.ckeditor.instance.document.$.body.clientHeight;
    html = `<div id="watermark" style="pointer-events:none;background-image:url(../assets/img/watermark.png);background-repeat:repeat;background-size:contain;width:calc(` + width + `px - 6.36cm);height:calc(` + height + `px - 3.18cm);position:absolute"></div>` + html;
    return html;
  }

  setAttention() {
    let configArr = JSON.parse(localStorage.getItem('activeUser'))["models"][0]["maps"];
    let config: Map<string, string> = new Map<string, string>();
    configArr.forEach(map => {
      config.set(map.key, map.value);
    });
    let setting = JSON.parse(config.get('attention'));
    let dataElementCode = setting["dataElementCode"];
    let dataType = setting["dataType"];
    let makeCompany = this.wordService.makeCompany;
    let positions = setting["positions"];
    let productDate = setting["productDate"] + "000000";
    if (productDate == "00000000000000") {
      productDate = this.productDate;
    }

    if (dataElementCode == this.dataEle && dataType == this.dataType && this.wordService.makeCompany == makeCompany && this.productDate == productDate) {
      let htmlStr = this.ckeditorContent + ``;
      let content: RegExpMatchArray = htmlStr.match(/<div id="attention">[\d\D]*<\/div>/);
      if (content && content[0]) {
        let contentStr = '';
        let doc = document.createElement('div');
        doc.innerHTML = content[0];
        let attentionDiv = doc.children[0];
        for (let i = 0; i < attentionDiv.children.length; i++) {
          let ele = attentionDiv.children.item(i);
          contentStr = contentStr + ele.textContent + "<br>";
        }
        this.wordService.saveAttention(contentStr, this.dataEle, this.dataType, makeCompany).then(data => {
          if (!data) return;
          this.yzNgxToastyService.success("关注内容已更新", "", 3000);
        })
      }
    }
  }
}
