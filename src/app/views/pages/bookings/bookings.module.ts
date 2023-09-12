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
import { EditBookingComponent } from './edit-booking/edit-booking.component';
import { QuillModule } from 'ngx-quill';
import { FailedBookingsComponent } from './failed-bookings/failed-bookings.component';
import { AlertBookingsComponent } from './alert-bookings/alert-bookings.component';
import { Bookingv2Component } from './bookingv2/bookingv2.component';
import { AlertModule } from '../alert/alert.module';



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
        path: 'pending',
        component: FailedBookingsComponent
      },
      {
        path: 'alerts',
        component: AlertBookingsComponent
      },
      {
        path: 'filter/:type',
        component: ListBookingsComponent
      },
      {
        path: 'add',
        component: EditBookingComponent //AddBookingComponent
      },
      {
        path: 'tempaddv2',
        component: Bookingv2Component
      },
      {
        path: 'updatev2/:id',
        component: Bookingv2Component
      },
      {
        path: 'edit/:id',
        component: EditBookingComponent  //AddBookingComponent
      },
      {
        path: 'update/:id',
        component: EditBookingComponent
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
    BookingAgreementComponent,
    EditBookingComponent,
    FailedBookingsComponent,
    AlertBookingsComponent,
    Bookingv2Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    QuillModule.forRoot(), // ngx-quill
    GooglePlaceModule,
    NgbModule,
    FeatherIconModule,
    AlertModule
  ]
})
export class BookingsModule { }
