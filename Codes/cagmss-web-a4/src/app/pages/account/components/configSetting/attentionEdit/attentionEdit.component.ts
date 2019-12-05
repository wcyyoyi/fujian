import { Component, OnInit, ViewChild } from '@angular/core';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';
import { ProdService } from '../../../../services/product.service';
import { WordService } from '../../../../services/word.service';
import '../../../../editors/components/ckeditor/ckeditor.loader';
import 'assets/ckeditor/ckeditor';
import 'assets/ckeditor/lang/zh-cn';
import { CKEditorComponent } from 'ng2-ckeditor';
@Component({
    selector: 'attention-edit',
    templateUrl: './attentionEdit.html',
    styleUrls: ['./attentionEdit.scss'],
    

})
export class AttentionEditComponent implements OnInit {
    btnClassLevel: string = 'yz-btn-level1';
    public content: string;
    public dataElementCode: string;
    public dataType: string;
    public makeCompany: string;
    public disable: boolean;
    @ViewChild('ckeditor') ckeditor: CKEditorComponent;
    public config = {
        uiColor: '#F0F3F4',
        // height: '400px',
        height: 'calc(100% - 72px)',
        bodyClass: 'document-editor',
        contentsCss: [window['CKEDITOR_BASEPATH'] + 'mystyles.css'],
        font_names: 'Arial;Times New Roman;Verdana'
    };
    constructor(private prodService: ProdService, private yzNgxToastyService: YzNgxToastyService,
        private wordService: WordService) {
    };

    ngOnInit(): void {
        let level = JSON.parse(localStorage.getItem('activeUser'))["personalSettings"]['themeLevel'];
        this.btnClassLevel = 'yz-btn-level' + level;
        this.disable = false;
        this.showDetail();
    }
    save() {
        this.yzNgxToastyService.wait("正在保存请稍后", "");
        let content = this.content.replace(/<br>/g, "&lt;br&gt;");
        this.wordService.saveAttention(content, this.dataElementCode, this.dataType, this.makeCompany).then(data => {
            this.yzNgxToastyService.close();
            if (data) {
                this.yzNgxToastyService.success("保存成功", "", 3000);
            } else {
                this.yzNgxToastyService.error("保存失败", "", 3000);
                return;
            }
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("保存失败", "", 3000);
            return;
        })
    }
    showDetail() {
        let configArr = JSON.parse(localStorage.getItem('activeUser'))["models"][0]["maps"];
        let config: Map<string, string> = new Map<string, string>();
        configArr.forEach(map => {
            config.set(map.key, map.value);
        });
        let setting = JSON.parse(config.get('attention'));
        this.dataElementCode = setting["dataElementCode"];
        this.dataType = setting["dataType"];
        this.makeCompany = this.wordService.makeCompany;
        this.getAttentionDetail()
    }
    getAttentionDetail() {
        this.wordService.getAttention(this.dataElementCode, this.dataType, this.makeCompany).toPromise().then(data => {
            if (!data) return;
            this.content = data.replace(/&lt;br&gt;/g, "<br>");
        }).catch(e => {
            this.disable = true;
            this.content = "当前没有关注内容";
        })
    }
}