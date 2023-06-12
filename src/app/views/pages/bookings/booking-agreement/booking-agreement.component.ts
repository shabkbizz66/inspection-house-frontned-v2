import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { GlobalConstants } from '../../../,,/../../global-constants';
import { BookingModel } from '../booking.model';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-booking-agreement',
  templateUrl: './booking-agreement.component.html',
  styleUrls: ['./booking-agreement.component.scss']
})
export class BookingAgreementComponent implements OnInit {

  item: BookingModel = new BookingModel();
  signdatetime: string;
  
  constructor(private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    public globals: GlobalConstants) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      var id = params["id"];
      if (id) {
        this.bookingService.get(this.globals.getBookingById+'/?id='+id).then((Response: any) => {
          this.item = Response.response;
          this.signdatetime = this.formatDate(Response.response.createdDate)
          /*this.saveButton = false;
          if(this.item.inspectionType == 'Phased'){
            this.subPackage = true;
          }
          if(this.item.transFullName){
            this.transsectionOn = true;
          }
          if(this.item.secondaryFullName){
            this.secondaryOn = true;
          }
          if(this.item.agentName != ''){
            this.invName = this.item.agentName;
          }
          const [year, month, day] = this.item.inspectionDate.split('-');
          const obj = { year: Number(year), month: Number(month), day: Number(day.split(' ')[0].trim()) };
          this.inspectionDate = obj;
          this.showInspectorName = Response.response.officerName;
          this.servicesArr = this.item.additionalServices.slice(0,-1).split(",");

          this.serviceCost = Number(this.item.packagePrice) - Number(this.item.additionalServiceCost);
          this.additionalServicesCost = this.item.additionalServiceCost;
          this.finalServiceCost = this.item.packagePrice;
          */
        });
      }
    });
  }

  public formatDate(date: any){
    const format = 'MM/dd/yyyy H:mm:s';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    return formattedDate;
  }

  printThisPage() {
    window.print();
  }

}
