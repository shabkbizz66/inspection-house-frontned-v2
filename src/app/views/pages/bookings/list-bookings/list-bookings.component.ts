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

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {

  @ViewChild('basicModal') basicModal: any;

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

  constructor(private bookingService: BookingService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private router: Router,
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
          "No",
          "Inspection Type",
          "Full Name",
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
          "Created At",
          "Action"
        ],
        data: []
      };

      let y = 0;
      this.bookingData.forEach((element: any) => {
        obj.data[y] = [];
        obj.data[y].push(y+1);
        obj.data[y].push(element.inspectionType);
        obj.data[y].push(element.firstName+' '+element.lastName);
        obj.data[y].push(element.email);
        obj.data[y].push(this.formatPhoneNumber(element.phone));
        obj.data[y].push(this.formatDate(element.inspectionDate)+' '+element.inspectionTime);

        obj.data[y].push(element.packageName);
        obj.data[y].push('$'+element.packagePrice);
        obj.data[y].push(element.officerName);
        obj.data[y].push(element.squareFeet);
        obj.data[y].push(element.paymentStatus);
        let vid = "/bookings/agreement/"+element.id;
        if(element.paymentStatus == 'PAID'){
          var agreementurl = '<a href="'+vid+'">View Agreement</a>';
        }else{
          var agreementurl = '';
        }
        obj.data[y].push(agreementurl);
        obj.data[y].push(element.bookingType);
        obj.data[y].push(element.createdDate);
        let id = "/bookings/edit/"+element.id;
        var popup = "<a id='"+element.id+"'  (click)='openModal($event)' title='Reschedule / Re-Assign'><i class='feather icon-user'></i></a>";
        let url = '<a href="'+id+'" title="View Booking"><i class="feather icon-eye"></i></a>&nbsp;&nbsp;'+popup;
       
       
        //console.log(url)
        obj.data[y].push(url);
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
    if(dataId != ''){
      //console.log(event.target.parentElement.id);
      //console.log('ss')
      this.bookingService.get(this.globals.getReassignOfficer+'?id='+dataId).then((Response: any) => {
        this.inspectorData = Response.response;
        //console.log(Response.response);
      });
      this.item.id = dataId;
      this.openPopup(this.basicModal);
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
    console.log(this.item);
    
    if (this.item.id) {
      this.bookingService.create(this.globals.updateBookingInspection,this.item).then((response) => {
        this.showToast('Inspector Re-assigned Successfully');
        this.modalReference.close();
        this.backtoList();
      },
        (rejected: RejectedResponse) => {
          this.item.id = '';
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
      this.item.inspectionNewDate = '';
      this.item.inspectionNewTime = '';
    }else{
      this.item.inspectorId = '';
      this.inspectionNewDate = this.calendar.getToday();
      this.item.inspectionNewDate = this.inspectionNewDate.year+"-"+('0'+this.inspectionNewDate.month).slice(-2)+"-"+('0'+this.inspectionNewDate.day).slice(-2);
      this.formGroup.controls['inspectorId'].clearValidators();
      this.formGroup.controls['inspectionNewTime'].setValidators([Validators.required]);
      this.formGroup.controls['inspectionNewDate'].setValidators([Validators.required]);
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

}
