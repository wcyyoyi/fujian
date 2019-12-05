import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { MapsModule } from '../maps/maps.module';

import { ModalModule } from 'ngx-bootstrap';

import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

// import { PopularApp } from './popularApp';
// import { PieChart } from './pieChart';
// import { TrafficChart } from './trafficChart';
// import { UsersMap } from './usersMap';
// import { LineChart } from './lineChart';
// import { Feed } from './feed';
import { Todo, MarkerViewer } from './todo';
// import { Calendar } from './calendar';
// import { CalendarService } from './calendar/calendar.service';
// import { FeedService } from './feed/feed.service';
// import { LineChartService } from './lineChart/lineChart.service';
// import { PieChartService } from './pieChart/pieChart.service';
import { TodoService } from './todo/todo.service';
// import { TrafficChartService } from './trafficChart/trafficChart.service';
import { UsersMapService } from './usersMap/usersMap.service';
import { StationService, AreaService, YieldService } from '../services';

// import { MapboxMaps } from '../maps/components/mapboxMaps/mapboxMaps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    MapsModule,
    routing,
    ModalModule.forRoot()
  ],
  declarations: [
    Todo,
    MarkerViewer,
    // Calendar,
    Dashboard
    // MapboxMaps
  ],
  entryComponents: [
    MarkerViewer
  ],
  providers: [
    // CalendarService,
    // FeedService,
    // LineChartService,
    // PieChartService,
    TodoService,
    StationService,
    AreaService,
    YieldService
    // TrafficChartService,
    // UsersMapService
  ]
})
export class DashboardModule { }
