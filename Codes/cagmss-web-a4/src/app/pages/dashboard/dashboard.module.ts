import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ModalModule, BsDatepickerModule, zhCnLocale, defineLocale } from 'ngx-bootstrap';
import { YzNgxMapModule,YzNgxToastyModule, YzNgxIconModule } from 'yz-ngx-base/src';
import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

import { Todo } from './todo';
import { Calendar } from './calendar';
import { CalendarService } from './calendar/calendar.service';
import { CropStatService } from '../services/cropstat.service';
import { TodoService } from './todo/todo.service';
import { StationService, AreaService, YieldService, IndexEventService, CropDictService, SHourService } from '../services';
import { ConverterModule } from '../utils/Converter/converter.module';
import { WordService } from '../services/word.service';
// import { MapboxMaps } from '../maps/components/mapboxMaps/mapboxMaps.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SurfDetailComponent } from './surf-detail/surf-detail.component';
import { NgxEchartsModule } from 'ngx-echarts';
defineLocale('zh-cn', zhCnLocale);

@NgModule({
  imports: [
    CKEditorModule,
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    YzNgxMapModule,
    ModalModule.forRoot(),
    ConverterModule,
    YzNgxToastyModule.forRoot(),
    NgxEchartsModule,
    YzNgxIconModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    Todo,
    Calendar,
    Dashboard,
    SurfDetailComponent
    // MapboxMaps
  ],
  entryComponents: [
    SurfDetailComponent
  ],
  providers: [
    WordService,
    CalendarService,
    CropStatService,
    // FeedService,
    // LineChartService,
    // PieChartService,
    TodoService,
    StationService,
    AreaService,
    YieldService,
    IndexEventService,
    // TrafficChartService,
    // UsersMapService
    CropDictService,
    SHourService,
  ]
})
export class DashboardModule { }
