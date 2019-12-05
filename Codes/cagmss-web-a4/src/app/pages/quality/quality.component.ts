import { Component, OnInit, ViewChild } from '@angular/core';
import { YzNgxMap } from 'yz-ngx-base/src';
import { Legend } from 'yz-ngx-base/src/yz-ngx-map/components/legend';
import { AreaService } from '../services/area.service';
import { JujubeComponent } from './components/Jujube/Jujube.component';
import { AreaInfo } from '../models';
import { BsModalRef, BsDatepickerConfig, BsModalService } from 'ngx-bootstrap';
import { DictionaryService } from '../utils/Dictionary.service';
import { AreaModal } from './components/area.modal.component';

const colorLevel = ["#FF7D00", "#00FF00", "#007D00", "#004600"];
const colorLabel = ["一般", "良", "优", "特优"];
@Component({
    selector: 'quality',
    styleUrls: ['./quality.scss'],
    templateUrl: 'quality.html',
})

export class QualityComponent implements OnInit {
    public mapbox: YzNgxMap;
    private resulMap = new Map<string, number>();
    public center: Array<number>;
    public zoom: number;
    public IfGetData: boolean = false;

    private selArea = new AreaInfo();
    private date: Date = new Date();
    private isSettingMode = false;
    private isShowData = false;
    private cropCode: string = '013501';
    public maxDate = new Date();
    modalRef: BsModalRef;
    modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
    };
    public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
        containerClass: 'theme-green',
        locale: 'zh-cn',
        dateInputFormat: 'YYYY/MM/DD'
    });

    constructor(private areaService: AreaService, private modalService: BsModalService, private dicServ: DictionaryService) { }

    @ViewChild('jujube') jujube: JujubeComponent;

    ngOnInit() {
        this.selArea = this.dicServ.AREA.find(area => { return area.cCode.toString() == this.areaService.areaCode });
        if (this.areaService.level == 1) {
            this.center = [119.3031, 26.0768];
            this.zoom = 6.3;
            this.IfGetData = true;
            return;
        }
        this.flyToCenter();
    }
    mapload(e) {
        this.mapbox = e.target;
        this.mapbox.map['_controlPositions']['bottom-right'].innerHTML = '';
        this.mapbox.addSource("fjn", {
            type: "vector",
            url: this.areaService.getMapUrl + "/data/fjn.json"
        });

        let items = new Map<string, string>();
        for (let i = 3; i >= 0; i--) {
            items.set(colorLabel[i], colorLevel[i]);
        }
        items.set('无种植区', 'transparent');
        let legend = new Legend();
        legend.items = items;
        this.mapbox.addLegendControl(legend, "bottom-left");
    }

    execute() {
        switch (this.cropCode) {
            case '013501':
                this.jujube.execute();
                break;
            default:
                break;
        }
    }

    showData() {
        switch (this.cropCode) {
            case '013501':
                this.jujube.showData();
                break;
            default:
                break;
        }
    }

    refresh() {
        switch (this.cropCode) {
            case '013501':
                this.jujube.refresh();
                break;
            default:
                break;
        }
    }

    render(map: Map<string, number>) {
        this.resulMap.forEach((v, k) => {
            if (this.mapbox.getLayer(k)) {
                this.mapbox.removeLayer(k);
            }
        });

        map.forEach((v, k) => {
            if (v) {
                if (this.mapbox.getLayer(k)) {
                    this.mapbox.setPaintProperty(k, 'fill-color', colorLevel[v]);
                } else {
                    let filterArr: Array<any> = ["in", "GEO_CODE"];
                    this.cityRelated(k).forEach(item => {
                        filterArr.push(item);
                    })
                    this.mapbox.addLayer({
                        "id": k,
                        "type": "fill",
                        "source": "fjn",
                        "source-layer": "county_polygon",
                        "filter": filterArr,
                        'paint': {
                            'fill-color': colorLevel[v],
                            'fill-opacity': 1,
                        }
                    }, "fjcity");
                }
            }
        });
        this.resulMap = map;
    }

    // 某些区域没有国家站，采用相邻县的数据
    private cityRelated(areaCode: string): Array<number> {
        switch (areaCode) {
            case "350102":
                return [350102, 350103, 350104, 350105];
            case "350203":
                return [350203, 350205, 350206, 350211, 350213];
            case "350302":
                return [350302, 350303, 350304];
            case "350402":
                return [350402, 350403];
            case "350582":
                return [350502, 350503, 350504, 350505, 350527, 350581, 350582];
            case "350602":
                return [350602, 350603];
            default:
                return [Number(areaCode)];
        }
    }
    //定位到地图中心
    flyToCenter() {
        return this.areaService.getByFilter(parseInt(this.areaService.areaCode), this.areaService.level).then(data => {
            let level = this.areaService.level;
            let lng = level == 0 ? 108 : data[0]["v06001"];
            let lat = level == 0 ? 34 : data[0]["v05001"];
            let zoom;
            let clientHeight = document.body.clientHeight;
            let cityZoom;
            let proZoom;
            let counZoom;
            if (clientHeight <= 750) {
                proZoom = 5.5;
                cityZoom = 7.5;
                counZoom = 8.5;
            } else {
                proZoom = 6.3;
                cityZoom = 8;
                counZoom = 9;
            }
            if (level == 1) {
                lat = lat - 1.2;
                zoom = proZoom;
            } else if (level == 2) {
                zoom = cityZoom;
            } else if (level == 3) {
                zoom = counZoom;
            } else {
                zoom = 3.2;
            }
            this.center = [lng, lat];
            this.zoom = zoom;
            this.IfGetData = true;
        })
    }

    showAreaInfo(): void {
        this.modalRef = this.modalService.show(AreaModal, { class: 'modal-lg' });
        this.modalRef.content.onAreaChanged.subscribe((data) => { this.selArea = data });
    }
}
