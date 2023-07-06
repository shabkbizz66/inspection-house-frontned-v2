import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BookingService } from '../booking.service';
import { GlobalConstants } from '../../../../global-constants';
import { DataTable } from "simple-datatables";
import { formatDate } from "@angular/common";
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { reassignModel } from '../booking.model';
import swal from 'sweetalert2'; 
import { RejectedResponse } from '../../../models/rejected-response';
import { Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {

  @ViewChild('basicModal') basicModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('emailModal') emailModal: any;

  bookingData: any;
  displayStyle = "none";
  inspectorData: any;

  formGroup: FormGroup;
  item: reassignModel = new reassignModel();
  submitted: boolean = false;
  modalReference: NgbModalRef;

  inspectionNewDate: NgbDateStruct;
  date: { year: number; month: number };
  minDate: any;
  cancelId: number = 0;
  sendEmailId: number = 0;

  constructor(private bookingService: BookingService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private router: Router,
    public alertService: AlertService,
    public globals: GlobalConstants) { 
      const current = new Date();
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      type: new FormControl("", Validators.required),
      inspectionNewDate: new FormControl(""),
      inspectionNewTime: new FormControl(""),
      inspectorId: new FormControl(""),
    });
    this.getBookingList();
  }

  get f() { 
    return this.formGroup.controls; 
  }

  public getBookingList(){
    //this.SpinnerService.show();
    this.bookingService.get(this.globals.getBookingList).then((Response: any) => {
      this.bookingData = Response.response;
      //this.checkval = true;
      //this.SpinnerService.hide();
    
      let obj: any = {
        // Quickly get the headings
        headings: [
          "Action",
          "Full Name",
          "Address",
          "Email",
          "Phone",
          "Inspection Date/Time",
          "Package Name",
          "Package Price",
          "Inspector Name",
          "Square Footage",
          "Payment Status",
          "Agreement",
          'Booking Type',
          'Status',
          "Created At",
          
        ],
        data: []
      };

      let y = 0;
      this.bookingData.forEach((element: any) => {
        obj.data[y] = [];


        let id = "/bookings/edit/"+element.id;
        var popup = "<a id='"+element.id+"'  (click)='openModal($event)' title='Re-Assign Inspector / Reschedule Booking'><i class='feather icon-user'></i></a>";
        var popupdelete = "&nbsp;&nbsp;&nbsp;&nbsp;<span id='' style='cursor: pointer;' class='"+element.id+"' nm='22' title='Cancel Booking'><i class='feather icon-delete'></i></span>";
        var sendmail = "&nbsp;&nbsp;&nbsp;&nbsp;<a id='' class='' name='"+element.id+"'  style='cursor: pointer;' title='Resend Email'><i class='feather icon-mail'></i></a>";
        
        let url = '<a href="'+id+'" title="View Booking"><i class="feather icon-eye"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;'+popup+popupdelete+sendmail;
       
       
        //console.log(url)
        obj.data[y].push(url);

        //obj.data[y].push(y+1);
        obj.data[y].push(element.firstName+' '+element.lastName);
        obj.data[y].push(element.address);
        obj.data[y].push(element.email);
        obj.data[y].push(this.formatPhoneNumber(element.phone));
        if(element.inspectionTime == '09:00:00'){
          var ctime = '09:00 am';
        }else{
          var ctime = '02:00 pm';
        }
        
        obj.data[y].push(this.formatDate(element.inspectionDate)+' '+ctime);

        obj.data[y].push(element.packageName);
        obj.data[y].push('$'+element.packagePrice);
        obj.data[y].push(element.officerName);
        obj.data[y].push(element.squareFeet);
        /*if(element.paymentStatus == 'PENDING'){
          element.paymentStatus = '<a id="" name="'+element.id+'" (click)="updatePaymentStatus('+element.id+')"><span>Awaiting</span></a>';
        }*/
        obj.data[y].push(element.paymentStatus);
        let vid = "/bookings/agreement/"+element.id;
        if(element.paymentStatus == 'PAID'){
          var agreementurl = '<a href="'+vid+'">View Agreement</a>';
        }else{
          var agreementurl = '';
        }
        obj.data[y].push(agreementurl);
        obj.data[y].push(element.bookingType);
        obj.data[y].push(element.status);
        obj.data[y].push(element.createdDate);
        
        y = y+1;
      });   
      let dataTable = new DataTable("#dataTableExample", {
        data: obj,
      });
      //let dataTable = new DataTable("#dataTableExample");
      //dataTable.insert(this.inspectorData)
    });
    
  }

  public formatPhoneNumber(phoneNumberString: string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  public formatDate(date: any){
    const format = 'MM/dd/yyyy';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    return formattedDate;
  }

  openModal(event: any){
    this.item = new reassignModel();
    const target  = event.target || event.srcElement || event.currentTarget;
    const dataId = event.target.parentElement.id;
    const sendemail = Number(event.target.parentElement.name);
    const cancelsatus = Number(event.target.parentElement.className);
    if(dataId != ''){
      //console.log(event.target.parentElement.id);
      //console.log('ss')
      this.bookingService.get(this.globals.getReassignOfficer+'?id='+dataId).then((Response: any) => {
        this.inspectorData = Response.response;
        //console.log(Response.response);
      });
      this.item.bookingId = dataId;
      this.openPopup(this.basicModal);
    }else if(cancelsatus > 0){
      this.cancelId = cancelsatus;
      this.openCancelPopup(this.deleteModal);
    }else if(sendemail > 0){
      this.sendEmailId = sendemail;
      this.openMailPopup(this.emailModal);
    }else{
      
    }
   
  }

  openPopup(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
     /*this.modalService.open(content, {}).result.then((result) => {
      console.log(result);
    }).catch((res) => {});*/
  }

  closePopup(){
    this.modalReference.close();
    this.formGroup.reset();
  }

  reassignSave(event: any){
    const button = (event.srcElement.disabled === undefined) ? event.srcElement.parentElement : event.srcElement;
    button.setAttribute('disabled', true);

    //console.log(this.formGroup)
    this.submitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      button.removeAttribute('disabled');
      //this.SpinnerService.hide();
      //this.eventSave.event.srcElement.disabled = false;
      return;
    }
    //console.log(this.item);
    //return false;
    if (this.item.bookingId) {
      if(this.item.type == 'Reassign'){
        var url = this.globals.updateBookingInspection+'?id='+this.item.bookingId+'&officerId='+this.item.inspectorId;
        var msg = "Inspector Re-assigned Successfully";
      }else{
        var url = this.globals.updateBookingReschedule;
        var msg = "Booking has been Rescheduled";
      }
      
      this.bookingService.create(url,this.item).then((response) => {
        this.showToast(msg);
        this.modalReference.close();
        this.backtoList();
      },
        (rejected: RejectedResponse) => {
          this.item.bookingId = '';
        }
      );
    }
  }

  showToast(msg: string){
    swal.fire({ showConfirmButton: false, timer: 1800, title: 'Success!', text: msg, icon: 'success', });
  }

  backtoList() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/bookings']);
  }

  changeType(event: any){
    if(event.target.value == 'Reassign'){
      this.formGroup.controls['inspectorId'].setValidators([Validators.required]);
      this.formGroup.controls['inspectionNewTime'].setValidators(null); 
      this.formGroup.controls['inspectionNewDate'].setValidators(null);
      this.formGroup.controls["inspectionNewTime"].updateValueAndValidity();
      this.formGroup.controls["inspectionNewDate"].updateValueAndValidity();
      this.item.inspectionNewDate = '';
      this.item.inspectionNewTime = '';
    }else{
      this.item.inspectorId = '';
      this.inspectionNewDate = this.calendar.getToday();
      this.item.inspectionNewDate = this.inspectionNewDate.year+"-"+('0'+this.inspectionNewDate.month).slice(-2)+"-"+('0'+this.inspectionNewDate.day).slice(-2);
      this.formGroup.controls['inspectionNewTime'].setValidators([Validators.required]);
      this.formGroup.controls['inspectionNewDate'].setValidators([Validators.required]);
      this.formGroup.controls['inspectorId'].setValidators(null);
      this.formGroup.controls["inspectorId"].updateValueAndValidity();
    }
    this.formGroup.updateValueAndValidity();
  }

  changeDate(event: any){
    this.item.inspectionNewDate = event.year+"-"+('0'+event.month).slice(-2)+"-"+('0'+event.day).slice(-2);
  }

  /*onTimeChange(event:any){
    this.item.inspectionNewTime = event.target.value;
    this.bookingService.get(this.globals.getInspectorDetalils+'?date='+this.item.inspectionNewDate+'&time='+this.item.inspectionNewTime+'&lat='+this.item.latitude+'&long='+this.item.longitude).then((response:any) => {
      this.showInspectorName = response.response.inspector_name;
    });
    
  }*/

  updatePaymentStatus(id: string){
    console.log(id)
  }

  openCancelPopup(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
  }

  cancelBooking(id: number){
    this.modalReference.close();
    this.bookingService.create(this.globals.cancelBooking+'?id='+id+'&status=Cancelled',this.item).then((response) => {
      this.showToast('Booking Cancelled Successfully');
      this.backtoList();
      //this.SpinnerService.hide();
    },
      (rejected: RejectedResponse) => {
        this.item.bookingId = '';
        //this.alertService.error('There is something wrong',this.options);
        //this.alertService.BindServerErrors(this.formGroup, rejected);
      }
    );
  }

  openMailPopup(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
  }

  sendEmail(id: number){
    this.modalReference.close();
    this.bookingService.create(this.globals.sendEmail+'?id='+id,this.item).then((response) => {
      this.showToast('Email has been send Successfully');
      this.backtoList();
      //this.SpinnerService.hide();
    },
      (rejected: RejectedResponse) => {
        this.item.bookingId = '';
        //this.alertService.error('There is something wrong',this.options);
        //this.alertService.BindServerErrors(this.formGroup, rejected);
      }
    );
  }

}
