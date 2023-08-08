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
    cancelBooking: string = 'v1/booking/bookingStatusUpdate';
    getBookingById: string = 'v1/booking/getBooking';
    sendEmail: string = 'v1/booking/sendPaymentLinkEmail';
    getFilterBookingList = 'v1/booking/getTypeWiseBookings';

    saveBookingNotes: string = 'v1/bookingNotes/notes';
    getBookingNotes: string = 'v1/bookingNotes/getNotes';

    getAgentList: string = 'v1/agents';
    getAvailableSlots: string = 'v1/booking/getBookingSlot';

    getPricing: string = 'v1/booking/getPrices';
    getDashboard: string = 'v1/booking/getDashboardCounts';
    getInspectorDetalils: string = 'v1/officer/getOfficerName';
     

    saveBlockSlot = 'v1/bookingslot';
    getBlockSlot = 'v1/bookingslot/getBookingSlotByInspectorId';
    updateBlockslot = "v1/bookingslot/updateBookingSlot";
    deleteBlockSlot = "v1/bookingslot/deleteBookingSlot";

    updateBookingInspection = 'v1/booking/updateBookingOfficerId';
    getReassignOfficer = "v1/officer/getOfficerNameList";
    updateBookingReschedule = 'v1/booking/rescheduleBookingOfficer';

    dashboardFilter = 'v1/booking/getOfficerBoookings';
    dashboardBookingList = 'v1/booking/getDashboardBookingList';
    dashboardMonthBookingList = 'v1/booking/getDashboardMonthWiseBookingList';
    dashboardWeekBookingList = 'v1/booking/getDashboardWeekWiseBookingList';

    /*--- users ---*/
    getusersList: string = 'v1/users';
    getUserById: string = 'v1/getUserbyid';
    saveUser: string = 'v1/saveuser';
    updateUser: string = 'v1/updateuser'
}