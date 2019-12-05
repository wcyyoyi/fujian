import { Component, OnInit, Directive, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import './ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
import { DomSanitizer } from '@angular/platform-browser';
import { WordService } from '../../../services/word.service';
import { ViewChild } from '@angular/core/src/metadata/di';
import { Input } from '@angular/core/src/metadata/directives';
import { map } from 'rxjs/operator/map';

// import 'style-loader!./ckeditor.scss';

@Component({
  selector: 'ckeditor-component',
  templateUrl: './ckeditor.html',
})


export class Ckeditor implements AfterViewInit {
  // date: Date = new Date(2018, 2, 7);
  date: Date = new Date();
  type;

  isSaved: boolean = false; // 用户是否保存
  isIssued: boolean = false; // 用户是否发布

  msg;
  public ckeditorContent: string = `正在加载...`;
  public config = {
    uiColor: '#F0F3F4',
    height: '600',
    bodyClass: 'document-editor',
    contentsCss: [window['CKEDITOR_BASEPATH'] + 'mystyles.css'],
  };

  @ViewChild('dBtn') dBtn;
  @ViewChild('iBtn') iBtn;
  @ViewChild('sBtn') sBtn;
  @ViewChild('ckeditor') ckeditor;

  constructor(private _wordService: WordService, private _route: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    this._route.params.subscribe((params: Params) => {
      this.type = params['data'].split(',');
    });

    this.dBtn.nativeElement.disabled = true;
    this.iBtn.nativeElement.disabled = true;
    this.getHtml(this.type[0], this.type[1], this.date);
  }

  btnDisabled() {
    // 如果已保存，可下载
    if (this.isSaved) {
      this.dBtn.nativeElement.disabled = false;
    }
    // 如果已发布，不可发布，不可保存，不可下载
    if (this.isIssued) {
      this.iBtn.nativeElement.disabled = true;
      this.sBtn.nativeElement.disabled = true;
      this.dBtn.nativeElement.disabled = true;
      this.iBtn.nativeElement.innerText = '已发布';
    }
    // 如果保存未发布，可发布
    if (this.isSaved && !this.isIssued) {
      this.iBtn.nativeElement.disabled = false;
    }
  }

  save() {
    // let htmlStr = this.ckeditorContent;
    let body = this.ckeditor.instance.document.getBody();
    let htmlStr = body.$.innerHTML;
    this._wordService.save(htmlStr, this.type[0], this.type[1], this.date).then(data => {
      this.isSaved = data;
      this.btnDisabled();
      if (data) {
        alert('保存成功');
      } else {
        alert('保存失败');
      }
    });
  }

  download() {
    let url = this._wordService.download(this.type[0], this.type[1], this.date);
    window.open(url);
  }

  getHtml(dataType, dataEleCode, date) {
    this.ckeditor.instance.on('loaded', () => {
      this._wordService.getHtml(dataType, dataEleCode, date).then(data => {
        let body = this.ckeditor.instance.document.getBody();
        // console.log(this.ckeditor.instance.document.$.readyState);
        if (data['isIssued']) {
          this.msg = '(已发布，不可编辑)';
          this.isIssued = data['isIssued'];
          this.ckeditor.instance.setReadOnly(true);
        } else {
          this.isSaved = data['isSaved'];
          body.setStyle('background-image', 'url(../assets/img/watermark.png)');
        }
        let html = this._wordService.replaceHtml(data['html']);
        body.$.innerHTML = html;
        // this.ckeditorContent = html + ``;
        this.btnDisabled();
      }).catch(err => {
        console.error(err);
        this.dBtn.nativeElement.disabled = true;
        this.iBtn.nativeElement.disabled = true;
        this.sBtn.nativeElement.disabled = true;
        this.ckeditorContent = ``;
        if (err['_body']) {
          if (JSON.parse(err['_body'])['error'] === 'invalid_token') {
            alert('登陆超时，请重新登陆');
          }
          if (JSON.parse(err['_body'])['message']) {
            alert(JSON.parse(err['_body']).message);
          }
        }
      });
    });
  }

  issue() {
    this._wordService.issue(this.type[0], this.type[1], this.date).then(data => {
      if (data) {
        this.iBtn.nativeElement.disabled = true;
        this.iBtn.nativeElement.innerText = '已发布';
        alert('发布成功');
      } else {
        alert('发布失败');
      }
    });
  }
}
