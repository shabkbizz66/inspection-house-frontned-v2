import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserModel } from '../users.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../../global-constants';
import { RejectedResponse } from '../../../models/rejected-response';
import { AlertService } from '../../alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users.service';
import swal from 'sweetalert2'; 
import { DataTable } from "simple-datatables";
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  @ViewChild('basicModal') basicModal: any;
  formGroup: FormGroup;
  submitted: boolean = false;
  item: UserModel = new UserModel();
  addUpdateLabel = 'Add User';
  saveLabel = 'Save';
  options: any = {
    componentRestrictions: { country: 'US' }
  } 

  modalReference: NgbModalRef;
  deleteId: string;

  @ViewChild('firstTable') myTable1: DatatableComponent;
  columns: any;
  savedData: any;

  constructor(public globals: GlobalConstants,
    private userService: UsersService,
    public alertService: AlertService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.columns = [
      { name: 'First Name'},
      { name: 'Last Name' },
      { name: 'Phone' },
      { name: 'Email' },
      { name: 'Action' }
     ];

    this.activatedRoute.params.subscribe((params) => {
      var id = params["id"];
      var editId = params['editId'];
      if (id) {

        this.userService.get(this.globals.getUserById+'/?id='+id).then((Response: any) => {
          if(Response.status){
            //this.item = Response.data;
            this.savedData = Response.data;

            let obj: any = {
              // Quickly get the headings
              headings: [
                "First Name",
                "Last Name",
                "Phone",
                "Email",
                "Action"
              ],
              data: []
            };
      
            let y = 0;
            this.savedData.forEach((element: any) => {
              obj.data[y] = [];
              obj.data[y].push(element.firstName);
              obj.data[y].push(element.lastName);
              obj.data[y].push(element.phone);
              obj.data[y].push(element.email);

              
              let id = "/users/edit/"+element.id;
              var popup = "<a id='"+element.id+"' title='Delete User'><i class='feather icon-delete'></i></a>";
              let url = '<a href="'+id+'" title="Edit User"><i class="feather icon-edit"></i></a>&nbsp;&nbsp;'+popup;
      
              obj.data[y].push(url);

              //obj.data[y].push(element.endTime);
              y = y+1;
            });    
            let dataTable = new DataTable("#dataTableExample", {
              data: obj
            });

          }else{
            //this.item.inspectorId = id;
            //this.selectedDate = this.calendar.getToday();
            //this.item.startDate = this.selectedDate.year+"-"+('0'+this.selectedDate.month).slice(-2)+"-"+('0'+this.selectedDate.day).slice(-2);
          }

          
          


        });

        
        
      }
    });
    this.BindFormGroup();
  }

  BindFormGroup(){
    this.formGroup = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required)
    });
  }

  get f() { 
    return this.formGroup.controls; 
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
    return;
    if (this.item.id) {
      this.userService.create(this.globals.updateUser,this.item).then((response) => {
        this.showToast('User Updated Successfully');
        this.reloadPage();
        //this.SpinnerService.hide();
      },
        (rejected: RejectedResponse) => {
          this.item.id = '';
          this.alertService.error('There is something wrong',this.options);
          //this.alertService.BindServerErrors(this.formGroup, rejected);
        }
      );
    } else {
      this.item.id = '';
      this.userService.create(this.globals.saveUser,this.item).then((response) => {
        this.showToast('User Added Successfully');
        //this.backToList();
        this.reloadPage();
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

  showErrorToast(msg:string){
    swal.fire({ showConfirmButton: false, timer: 2000, title: 'Success!', text: msg, icon: 'error', });
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/users']);
  }
  
  deleteSlot(event: any){
    const target  = event.target || event.srcElement || event.currentTarget;
    this.deleteId = event.target.parentElement.id;
    if(this.deleteId != ''){
      this.openPopup(this.basicModal);
    }
  }

  deleteSlotDe(id: string){
    this.modalReference.close();
    this.userService.create(this.globals.deleteBlockSlot+'?id='+id,this.item).then((response) => {
      this.showToast('Delete Successfully');
      this.reloadPage();
      //this.SpinnerService.hide();
    },
      (rejected: RejectedResponse) => {
        this.item.id = '';
        this.alertService.error('There is something wrong',this.options);
        //this.alertService.BindServerErrors(this.formGroup, rejected);
      }
    );
  }

  openPopup(content: TemplateRef<any>) {
    this.modalReference = this.modalService.open(content);
  }

  closePopup(){
    this.modalReference.close();
    this.formGroup.reset();
  }
}