import { Component, OnInit } from '@angular/core';
import { BlockSlotModel } from '../blockslot.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../../global-constants';
import { RejectedResponse } from '../../../models/rejected-response';
import { AlertService } from '../../alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { InspectorService } from '../inspector.service';
import swal from 'sweetalert2'; 

@Component({
  selector: 'app-booking-slot',
  templateUrl: './booking-slot.component.html',
  styleUrls: ['./booking-slot.component.scss']
})
export class BookingSlotComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;
  item: BlockSlotModel = new BlockSlotModel();
  addUpdateLabel = 'Add Slot';
  saveLabel = 'Save';

  selectedDate: NgbDateStruct;
  endDate: NgbDateStruct;
  minDate: any;

  selStartTime: any;
  selEndTime: any;
  options: any = {
    componentRestrictions: { country: 'US' }
  } 

  constructor(public globals: GlobalConstants,
    private inspectorService: InspectorService,
    public alertService: AlertService,
    private calendar: NgbCalendar,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
      const current = new Date();
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      var id = params["id"];
      if (id) {

        this.inspectorService.get(this.globals.getBlockSlot+'/?id='+id).then((Response: any) => {
          if(Response.status){
            this.item = Response.data;
            const [year, month, day] = this.item.startDate.split('-');
            const obj = { year: Number(year), month: Number(month), day: Number(day.split(' ')[0].trim()) };
            this.selectedDate = obj;

            const [year1, month1, day1] = this.item.endDate.split('-');
            const obj1 = { year: Number(year1), month: Number(month1), day: Number(day1.split(' ')[0].trim()) };
            this.endDate = obj1;

            const [hour, minute, second] = this.item.startTime.split(':');
            const obj2 = { hour: Number(hour), minute: Number(minute), second: Number(second.split(' ')[0].trim()) };
            this.selStartTime = obj2;
            
            const [hour1, minute1, second1] = this.item.endTime.split(':');
            const obj3 = { hour: Number(hour1), minute: Number(minute1), second: Number(second1.split(' ')[0].trim()) };
            this.selEndTime = obj3;

            this.saveLabel = 'Update';
            this.addUpdateLabel = 'Update Slot';
          }else{
            this.item.inspectorId = id;
            this.selectedDate = this.calendar.getToday();
            this.item.startDate = this.selectedDate.year+"-"+('0'+this.selectedDate.month).slice(-2)+"-"+('0'+this.selectedDate.day).slice(-2);
          }
          
        });

        
      }
    });
    this.BindFormGroup();
  }

  BindFormGroup(){
    this.formGroup = new FormGroup({
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required)
    });
  }

  get f() { 
    return this.formGroup.controls; 
  }

  changeDate(event: any){
    this.item.startDate = event.year+"-"+('0'+event.month).slice(-2)+"-"+('0'+event.day).slice(-2);
  }

  changeEndDate(event: any){
    this.item.endDate = event.year+"-"+('0'+event.month).slice(-2)+"-"+('0'+event.day).slice(-2);
  }

  startTimeChange(event: any){
    this.item.startTime = ('0'+event?.hour).slice(-2)+":"+('0'+event?.minute).slice(-2)+":"+('0'+event?.second).slice(-2);
  }

  endTimeChange(event: any){
    this.item.endTime = ('0'+event?.hour).slice(-2)+":"+('0'+event?.minute).slice(-2)+":"+('0'+event?.second).slice(-2);
  }

  save(event: any){
    const button = (event.srcElement.disabled === undefined) ? event.srcElement.parentElement : event.srcElement;
    button.setAttribute('disabled', true);

    this.submitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      button.removeAttribute('disabled');
      //this.SpinnerService.hide();
      return;
    }

    console.log(this.item);

    if (this.item.id) {
      this.inspectorService.update(this.globals.updateBlockslot,this.item).then((response) => {
        this.showToast('Slot Updated Successfully');
        this.backToList();
        //this.SpinnerService.hide();
      },
        (rejected: RejectedResponse) => {
          this.item.id = '';
          this.alertService.error('There is something wrong',this.options);
          //this.alertService.BindServerErrors(this.formGroup, rejected);
        }
      );
    } else {
      this.inspectorService.create(this.globals.saveBlockSlot,this.item).then((response) => {
        this.showToast('Slot Inserted Successfully');
        this.backToList();
        //this.SpinnerService.hide();
      },
        (rejected: RejectedResponse) => {
          this.item.id = '';
          this.alertService.error('There is something wrong',this.options);
          //this.alertService.BindServerErrors(this.formGroup, rejected);
        }
      );
    }
  }

  showToast(msg: string){
    swal.fire({ showConfirmButton: false, timer: 1800, title: 'Success!', text: msg, icon: 'success', });
  }

  public backToList(){
    this.router.navigate(['/inspectors']);
  }
}