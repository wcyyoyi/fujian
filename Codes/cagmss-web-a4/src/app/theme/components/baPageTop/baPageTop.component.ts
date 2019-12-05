import { Component, Input, OnInit } from '@angular/core';
import { UserConfig } from '../../../pages/models/userConfig/userConfig';
import { GlobalState } from '../../../global.state';
import { AreaService } from '../../../pages/services';
import { FileUploadService } from '../../../pages/services/fileUpload.service';
import 'style-loader!./baPageTop.scss';
@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  providers: [AreaService, FileUploadService],
})
export class BaPageTop implements OnInit {
  @Input()
  public name: string;
  public userConfig = new UserConfig();
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  private city: string = "";   //默认进来的省或者市或者县
  public imgList: Array<any>;
  public bannerImgs: Array<any>;
  public token: string;
  constructor(private _state: GlobalState, private areaServ: AreaService,
    private fileService: FileUploadService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }
  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem("token"))["access_token"];
    this.showImgs();
    this.areaServ.getByFilter(Number(this.areaServ.areaCode), this.areaServ.level).then(data => {
      if (!data) return;
      this.city = data[0]["cName"];
    })
  }
  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  showImgs() {
    this.fileService.getUserConfig().then((userConfig: UserConfig) => {
      this.userConfig = userConfig;
      let config: Map<string, string> = new Map<string, string>();
      let model = userConfig.models.find(value => { return value.code === 'dashboard'; });
      model.maps.forEach(map => {
        config.set(map.key, map.value);
      });
      this.bannerImgs = new Array();
      if (!config.get('bannerImgs') || JSON.parse(config.get('bannerImgs')).length == 0) {
        this.fileService.getImgsByLevel('-1').subscribe(data => {
          if (!data) return;
          data.forEach(_name => {
            this.bannerImgs.push(this.fileService.data_url + '/system/pic/banner?name=' + _name + "&access_token=" + this.token);
          });
          if (this.bannerImgs.length == 1) return;
          this.changeImgs();
        })
      } else {
        let imgArr = new Array();
        imgArr = JSON.parse(config.get('bannerImgs'));
        imgArr.forEach(img => {
          this.bannerImgs.push(this.fileService.data_url + '/system/pic/banner?name=' + img + "&access_token=" + this.token);
        })
        if (this.bannerImgs.length == 1) return;
        this.changeImgs();
      }
    })
  }
  changeImgs() {
    if (this.bannerImgs.length == 1) return;
    $("#banner-container img").fadeOut(0).eq(0).fadeIn(0);
    var i = 0;
    setInterval(function () {
      if ($("#banner-container img").length > (i + 1)) {
        $("#banner-container img").eq(i).fadeOut(0).next("img").fadeIn(2000);
        i++;
      }
      else {
        $("#banner-container img").eq(i).fadeOut(0).siblings("img").eq(0).fadeIn(2000);
        i = 0;
      }
    }, 3000);
  }
}
