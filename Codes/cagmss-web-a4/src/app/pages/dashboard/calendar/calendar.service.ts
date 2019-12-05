import { Injectable } from '@angular/core';
import { BaThemeConfigProvider } from '../../../theme';

import { IndexEventService, StationService } from '../../services';
import { indexEventModel } from '../../models';

@Injectable()
export class CalendarService {

  constructor(private _baConfig: BaThemeConfigProvider,
    private idxEventServ: IndexEventService,
    private stationService: StationService) {
  }

  getData() {
    let date = new Date();
    return {
      defaultView: 'listDay',
      // customize the button names,
      // otherwise they'd all just say "list"
      views: {
        listDay: { buttonText: '日' },
        listWeek: { buttonText: '周' },
        listMonth: { buttonText: '月' },
        // day: { // name of view
        //   titleFormat: 'YYYY-MM-DD'
        //   // other view-specific options here
        // },
        // week: { // name of view
        //   titleFormat: 'YYYY-MM-DD'
        //   // other view-specific options here
        // },
        // month: { // name of view
        //   titleFormat: 'YYYY-MM'
        //   // other view-specific options here
        // }
      },
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      footer: {
        left: 'prev,next',
        center: '',
        right: 'listDay,listWeek,listMonth'
      },
      // defaultDate: new Date(),
      defaultDate: date,
      selectable: true,
      selectHelper: true,
      editable: false,
      eventLimit: true,
      events: (start, end, timezone, callback) => {
        this.idxEventServ.getByFilter(start.toDate(), end.toDate()).then(data => {
          let idxEvents = data as Array<indexEventModel>;
          if (idxEvents) {
            let pEvents = [];
            this.stationService.getIdsByArea(Number(this.stationService.areaCode), this.stationService.level).then(stats => {
              idxEvents.forEach(item => {
                if (stats.includes(item.v01000)) {
                  pEvents.push({
                    title: item.cDesc,
                    start: item.dEventtime,
                    color: this.getColor(item.vAlertLevel),
                    tag: item
                  });
                }
              });

              callback(pEvents);
            })
          }

        });
      }
    };

    // let pEvents = [{
    //   title: '枇杷：裂果',
    //   start: '2018-08-01',
    //   end: '2018-08-20',
    //   color: dashboardColors.silverTree
    // },
    // {
    //   title: '烤烟：干旱',
    //   start: '2018-08-01',
    //   end: '2018-08-20',
    //   color: dashboardColors.blueStone
    // },
    // {
    //   title: '水稻：渍害',
    //   start: '2018-08-24', // 2016-03-14T20:00:00
    //   color: dashboardColors.surfieGreen
    // },
    // {
    //   title: '香蕉：干旱',
    //   start: '2018-08-01', // 2016-04-01T07:00:00
    //   color: dashboardColors.gossip
    // }];


  }

  getColor(level: number) {
    let alertLevelColors = this._baConfig.get().colors.alertLevel;

    switch (+level) {
      case 1:
        return alertLevelColors.blue;
      case 2:
        return alertLevelColors.yellow;
      case 3:
        return alertLevelColors.orange;
      case 4:
        return alertLevelColors.red;
      default:
        return alertLevelColors.red;
    }
  }
}
