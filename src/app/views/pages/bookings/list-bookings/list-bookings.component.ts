import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BookingService } from '../booking.service';
import { GlobalConstants } from '../../../../global-constants';
import { DataTable } from "simple-datatables";
import { formatDate } from "@angular/common";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private bookingService: BookingService,
    private modalService: NgbModal,
    private router: Router,
    public globals: GlobalConstants) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      inspectorId: new FormControl("", Validators.required),
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
        var popup = "<a id='"+element.id+"'  (click)='openModal($event)' title='Re-Assign Inspector'><i class='feather icon-user'></i></a>";
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
      let url = this.globals.updateBookingInspection+'?id='+this.item.id+'&officerId='+this.item.inspectorId;
      this.bookingService.create(url,this.item).then((response) => {
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

}
