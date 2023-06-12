import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBookingsComponent } from './list-bookings/list-bookings.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingsComponent } from './bookings.component';
import { RouterModule, Routes } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InspectionCalendarComponent } from './inspection-calendar/inspection-calendar.component';
import { FeatherIconModule } from '../../../core/feather-icon/feather-icon.module';
import { BookingAgreementComponent } from './booking-agreement/booking-agreement.component';



const routes: Routes = [
  {
    path: '',
    component: BookingsComponent,
    children: [
      {
        path: '',
        component: ListBookingsComponent
      },
      {
        path: 'add',
        component: AddBookingComponent
      },
      {
        path: 'edit/:id',
        component: AddBookingComponent
      },
      {
        path: 'agreement/:id',
        component: BookingAgreementComponent
      },
      {
        path: 'calendar',
        component: InspectionCalendarComponent
      },
    ]
  }
]

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    BookingsComponent,
    ListBookingsComponent,
    AddBookingComponent,
    InspectionCalendarComponent,
    BookingAgreementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    GooglePlaceModule,
    NgbModule,
    FeatherIconModule
  ]
})
export class BookingsModule { }
