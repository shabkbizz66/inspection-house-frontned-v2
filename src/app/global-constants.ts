import { Injectable } from '@angular/core';

Injectable()
export class GlobalConstants {
    pageTitle: string = '';
    login: string = 'v1/login';
    getInspectorList: string = 'v1/getAllInspector';
    getInspectorById: string = 'v1/getOfficerDetails';
    saveInspector: string = 'v1/saveOfficer';
    updateInspector: string = 'v1/updateOfficer';

    getBookingList: string = "v1/booking";
    saveBooking: string = 'v1/booking';
    updateBooking: string = 'v1/updateBooking';
    getBookingById: string = 'v1/booking/getBooking';

    getAgentList: string = 'v1/agents';
    getAvailableSlots: string = 'v1/booking/getBookingSlot';

    getPricing: string = 'v1/booking/getPrices';
    getDashboard: string = 'v1/booking/getDashboardCounts';
    getInspectorDetalils: string = 'v1/officer/getOfficerName';
}