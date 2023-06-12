import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { GlobalConstants } from '../../../../global-constants';
import { DataTable } from "simple-datatables";
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.scss']
})
export class ListBookingsComponent implements OnInit {

  bookingData: any;

  constructor(private bookingService: BookingService,
    public globals: GlobalConstants) { }

  ngOnInit(): void {
    this.getBookingList();
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
        let url = '<a href="'+id+'"><i class="feather icon-eye"></i></a>';
       
       
        //console.log(url)
        obj.data[y].push(url);
        y = y+1;
      });   
      let dataTable = new DataTable("#dataTableExample", {
        data: obj
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
}
