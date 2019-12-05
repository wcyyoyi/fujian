import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { UserConfig } from '../../../../models/userConfig/UserConfig';
import { YzNgxToastyService } from 'yz-ngx-base/src/yz-ngx-toasty/yz-ngx-toasty.service';

@Component({
    selector: 'change-color',
    templateUrl: './changeColor.html',
    styleUrls: ['./changeColor.scss'],
    

})
export class ChangeColorComponent implements OnInit {
    constructor(private yzNgxToastyService: YzNgxToastyService, private userService: UserService) {
    };

    ngOnInit(): void {
    }
    changeTheme(param) {
        let userConfig: UserConfig = JSON.parse(localStorage.getItem('activeUser'));
        let body = document.getElementsByTagName("body")[0];
        body.className = "body-level" + param;
        userConfig["personalSettings"]["themeLevel"] = param;
        this.yzNgxToastyService.wait("正在修改主题请稍后", "");
        this.userService.updateSetting(userConfig).toPromise().then(data => {
            this.yzNgxToastyService.close();
            if (data) {
                this.yzNgxToastyService.success("修改主题成功", "", 3000);
                localStorage.setItem('activeUser', JSON.stringify(userConfig));
            } else {
                this.yzNgxToastyService.error("修改主题失败", "", 3000);
            }
        }).catch(e => {
            this.yzNgxToastyService.close();
            this.yzNgxToastyService.error("修改主题失败", "", 3000);
        })
    }
}