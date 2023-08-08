import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Ng-ApexCharts
//import { NgApexchartsModule } from "ng-apexcharts";

import { DashboardComponent } from './dashboard.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { WeekViewComponent } from './week-view/week-view.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgChartsModule } from 'ng2-charts';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
])

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'monthview/:date',
    component: MonthViewComponent
  },
  {
    path: 'weekview/:date',
    component: WeekViewComponent
  }
]

@NgModule({
  declarations: [DashboardComponent, WeekViewComponent, MonthViewComponent],
  imports: [
    CommonModule,
    GoogleMapsModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    //NgApexchartsModule,
    NgxDatatableModule,
    FullCalendarModule,
    NgChartsModule,
    NgbModule
  ]
})
export class DashboardModule { }
