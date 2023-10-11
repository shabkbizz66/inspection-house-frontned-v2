import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import swal from 'sweetalert2';
import { RejectedResponse } from '../../models/rejected-response';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '../../../global-constants';
import { BookingService } from '../../pages/bookings/booking.service';
import { reassignModel } from '../../pages/bookings/booking.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InspectorService } from '../../pages/inspectors/inspector.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @ViewChild('basicModal11') basicModal: any;
  @ViewChild('deleteModal11') deleteModal: any;
  isLoading: boolean;
  modalReference: NgbModalRef;
  cancelId: number;
  formGroup: FormGroup;
  item: reassignModel = new reassignModel();
  submitted:boolean=false;
  inspectionNewDate: NgbDateStruct;
  minDate: any;
  inspectorData: any;
  reassignTitle: string;
  deleteId: number;

  @ViewChild('basicModalBlock') basicModalBlock: any;

  constructor(private router: Router,
    private bookingService: BookingService,
    private inspectorService: InspectorService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    public globals: GlobalConstants) { 

      const current = new Date();
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    // Spinner for lazyload modules
    router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });

    
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      inspectionNewDate: new FormControl(""),
      inspectionNewTime: new FormControl(""),
      inspectorId: new FormControl(""),
    });
  }

  get f() { 
    return this.formGroup.controls; 
  }

  workorder(event:any){
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    var id = contextMenu.getAttribute('data-id');
    console.log(id);
    contextMenu.style.display = 'none';
    this.router.navigate(['/bookings/update/'+id]);
  }

  openModal(){
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    var id = Number(contextMenu.getAttribute('data-id'));
    this.cancelId = id;
    this.openCancelPopup(this.deleteModal);
    contextMenu.style.display = 'none';
  }

  closewindow(event:any){
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    contextMenu.style.display = 'none';
  }

  closewindowOff(event:any){
    const contextMenuOff = (<HTMLInputElement>document.getElementById('contextMenuOff'));
    contextMenuOff.style.display = 'none';
  }

  openCancelPopup(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
  }

  closePopup(){
    this.modalReference.close();
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    contextMenu.style.display = 'none';
  }

  showToast(msg: string){
    swal.fire({ showConfirmButton: false, timer: 1800, title: 'Success!', text: msg, icon: 'success', });
  }

  errorshowToast(msg: string){
    swal.fire({ showConfirmButton: false, timer: 1800, title: 'Error!', text: msg, icon: 'error', });
  }

  cancelBooking(id: number){
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    this.modalReference.close();
    let item: any;
    this.bookingService.create(this.globals.cancelBooking+'?id='+id+'&status=Cancelled',item).then((response) => {
      this.showToast('Booking Cancelled Successfully');
      this.backtoList();
      //this.SpinnerService.hide();
    },
      (rejected: RejectedResponse) => {
        
      }
    );
  }

  reassign(){
    this.openPopup('reassign');
  }
  reschedule(){
    this.openPopup('reschedule');
  }

  openPopup(type:string){
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenu'));
    var id = contextMenu.getAttribute('data-id');
    this.item.bookingId = String(id);
    this.changeType(type);
    if(type == 'reassign'){
      this.reassignTitle = 'Re-Assign Inspector';
      this.item.type = 'Reassign';
      this.bookingService.get(this.globals.getReassignOfficer+'?id='+id).then((Response: any) => {
        this.inspectorData = Response.response;
        //this.changeType('Reassign');
      });
    }else{
      this.reassignTitle = 'Reschedule Booking';
      this.item.type = 'Reschedule';
      //this.changeType('Reschedule');
    }
    this.openCancelPopup(this.basicModal);
    contextMenu.style.display = 'none';
  }

  reassignSave(event: any){
    const button = (event.srcElement.disabled === undefined) ? event.srcElement.parentElement : event.srcElement;
    button.setAttribute('disabled', true);

    console.log(this.formGroup)
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
      
      this.bookingService.create(url,this.item).then((response: any) => {
        if(response.status){
          this.showToast(msg);
        }else{
          this.errorshowToast(response.responseMessage);
        }
        
        this.modalReference.close();
        this.backtoList();
      },
        (rejected: RejectedResponse) => {
          this.item.bookingId = '';
        }
      );
    }
  }

  changeType(type: string){
    if(type == 'reassign'){
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
  
  backtoList() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/dashboard']);
  }

  deleteBlockOff(event:any){
    console.log(event);
    const contextMenu = (<HTMLInputElement>document.getElementById('contextMenuOff'));
    var id = Number(contextMenu.getAttribute('data-id'));
    this.deleteId = id;
    if(this.deleteId != 0){
      contextMenu.style.display = 'none';
      this.openPopupBlock(this.basicModalBlock);
    }
  }

  deleteSlotDe(id:number){
    this.modalReference.close();
    this.inspectorService.create(this.globals.deleteBlockSlot+'?id='+id,this.item).then((response) => {
      this.showToast('Delete Successfully');
      this.backtoList();
    },
      (rejected: RejectedResponse) => {
        
        //this.alertService.BindServerErrors(this.formGroup, rejected);
      }
    );
  }

  openPopupBlock(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
  }

  closePopupBlock(){
    this.modalReference.close();
  }
}
