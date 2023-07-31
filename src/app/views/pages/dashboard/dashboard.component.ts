import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../bookings/booking.service';
import { GlobalConstants } from '../../../global-constants';
import { InspectorService } from '../inspectors/inspector.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { formatDate } from "@angular/common";

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, FullCalendarComponent, Calendar } from '@fullcalendar/angular';
import { ResourceInput } from '@fullcalendar/resource-common';
import { throws } from 'assert';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit {

  @ViewChild('fc') calendarComponent: FullCalendarComponent;

  resources: ResourceInput[] = [];
  currentEvents: EventApi[] = [];
  calendarInst?: Calendar;
  Events: any[] = [];
  bookingData: any;

  calendarOptions: CalendarOptions = {
    initialView: 'resourceTimelineDay',
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'resourceTimelineDay'
    },
    views: {
      resourceTimelineDay: {
        title: 'dddd, MMMM Do YYYY'
      }
    },
    resourceAreaWidth: 200,
    slotMinTime: "07:00:00",
    slotMaxTime: "20:00:00",
    contentHeight: 300,
    height: 450,
    eventContent: function( info ) {
      return {html: info.event.title};
    },  
    resourceAreaColumns: [
      {
        field: 'title',
        headerContent: 'Inspectors',
      }
    ],
    nowIndicator: false,
    weekends: true,
    editable: false,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: false,
    
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.handleDateChanged.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  currentDate: NgbDateStruct;
  totalInspector: number = 0;
  totalBookings: number = 0;
  todayBooking: number = 0;
  thisweekBooking: number = 0;
  thismonthBooking: number = 0;
  workorderToday: number = 0;

  inspectorData: any;
  ColumnMode = ColumnMode;
  loadingIndicator = true;
  filterData: any = [];
  public columns: Array<object>;
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  currentTodayDate = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  todayCheck: number = 0;

  currentDynamicDate = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

  @ViewChild("fc") fc: NgbCalendar;
  @ViewChild('basicModal') basicModal: any;
  
  constructor(private calendar: NgbCalendar,
    private bookingService: BookingService,
    private inspectorService: InspectorService,
    private activatedRoute: ActivatedRoute,
    public globals: GlobalConstants) {}

  ngOnInit(): void {
    this.currentDate = this.calendar.getToday();
    this.BindMaster();
  }

  private BindMaster(): Promise<void> {
    return new Promise((resolve, reject) => {
      let current = this;
      Promise.all<any>([
        this.inspectorService.get(this.globals.getInspectorList),
        this.bookingService.get(this.globals.getDashboard)
      ]).then(function (response: any) {
        console.log(response)
        current.inspectorData = response[0].data;
        var i = 0;
        current.inspectorData.forEach((element :any) => {
          current.resources[i] = {
            id: element.id,
            title: element.firstName+ ' '+element.lastName
          }
          i = i +1;
        });
        current.totalInspector = response[1].officerCount;
        current.totalBookings = response[1].bookingCount;
        current.todayBooking = response[1].todaybooking;
        current.workorderToday = response[1].todayworkorder;
        current.getDashboardData(current.currentTodayDate)
        resolve();
      });
    });
  }

  getDashboardData(currentTodayDate: string){
    this.BindMasterAllSearchData(currentTodayDate).then(() => {
      console.log(this.bookingData)
      console.log(this.inspectorData)
      this.Events = [];
      this.bookingData.forEach((element: any) => {
        if(element.inspectionTime == '09:00:00'){
          var endtime = element.inspectionDate+'T13:30:00';
        }else{
          var endtime = element.inspectionDate+'T18:30:00';
        }
        let arr: any = [];
        arr.id = element.id;
        arr.start = element.inspectionDate+'T'+element.inspectionTime;
        arr.end = endtime; //element.inspectionDate+'T09:00:00';
        if(element.paymentStatus == 'PAID'){
          arr.backgroundColor = '#e0f6f6';
          var contractclass = "eventContract1";
        }else{
          arr.backgroundColor =  'rgba(1,104,250, .15)';
          var contractclass = "eventContract2"
        }
        if(element.reportreview == 'In Person Day of Inspection'){
          var iconcontent = '<i class="feather icon-user"></i>';
        }else{
          var iconcontent = '<i class="feather icon-phone"></i>';
        }
        arr.title = '<div class="mcontent">&nbsp;<span class="eventbox"><span class="'+contractclass+'">C</span>&nbsp;<span class="'+contractclass+'">$</span></span>&nbsp;'+element.address+'</div><div class="iconcontent">'+iconcontent+'</div>';
       
        arr.borderColor = '#0168fa';
        arr.resourceId = element.officerId;
        arr.textEscape = false;
        this.Events.push(arr);
      });
      
      console.log(this.Events);
      this.calendarOptions.events = this.Events;
      this.calendarOptions.resources = this.resources;
      //this.setEvents(this.Events);
    });
  }

  eventRender(info: any) {
    
    /*var tooltip = new Tooltip(info.el, {
      title: info.event.extendedProps.description,
      placement: 'top',
      trigger: 'hover',
      container: 'body'
    });*/
  }

  private BindMasterAllSearchData(date: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let current = this;
      Promise.all<any>([
        this.bookingService.get(this.globals.dashboardBookingList+'?date='+date),
      ]).then(function (response: any) {
        current.bookingData = response[0].response;
        resolve();
      });
    });
  }

  

  /*getTodayData(event: any){
    console.log(event.target.value);
    if(event.target.value != '--'){
      var id = event.target.value;
    }else{
      var id = null;
    }
    this.filterData = [];
    this.inspectorService.get(this.globals.dashboardFilter+'?id='+id).then((Response: any) => {
      Response.response.forEach((element:any) => {
        if(element.inspectionTime == '09:00:00'){
          element.inspectionTimeChange = '09:00 am';
        }else{
          element.inspectionTimeChange = '02:00 pm';
        }
        this.filterData.push(element);
      });
    });
  }*/

  handleCalendarToggle() {
    console.log('333');
    //this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    console.log('222');
    /*const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;*/
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('111');
    /*const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        //id: createEventId(),
        resourceId: selectInfo.resource?.id,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }*/
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log('444');
    /*if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }*/
  }

  handleEvents(events: any) {
    //this.currentEvents = events;
    
    
  }

  handleDateChanged(event: any){
    //const calendarApi = this.calendarComponent.getApi();
    //const currentDate = calendarApi.getDate();
    var curDate = this.formatDate(event.startStr);
    console.log(this.todayCheck)
    this.currentDynamicDate = curDate;
    if(curDate == this.currentTodayDate){
      if(this.todayCheck == 1){
        this.getDashboardData(curDate);
      }
    }else{
      //console.log("The current date of the calendar is " + this.formatDate(event.startStr));
      //console.log(event);
      this.getDashboardData(curDate);
      this.todayCheck = 1;
    }
    //calendarApi.gotoDate(selectedDate);
  }

  public formatDate(date: any){
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    return formattedDate;
  }

  onDateSelection(date: NgbDate) {
    console.log(date);
    var month = '';
    var day = '';
    if(date.month < 10){
      month = '0'+date.month;
    }else{
      month = String(date.month);
    }
    if(date.day < 10){
      day = '0'+date.day;
    }else{
      day = String(date.day);
    }
    var selectedDate = date.year+'-'+month+'-'+day;
    console.log(selectedDate)
    this.getDashboardData(selectedDate);
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(selectedDate);
  }
}
