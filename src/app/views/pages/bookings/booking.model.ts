export class BookingModel{
    id: string;
    inspectionType:string;
    inspectionSubType: string;
    address:string;
    unit: string;
    city: string;
    state: string;
    zipcode: string;
    squareFeet: string;
    yearBuilt: string;
    foundation: string;
    firstName: string;
    lastName: string;
    secondaryFullName: string;
    secondaryPhone: string;
    secondaryEmail: string;
    transFullName:string;
    transPhone: string;
    transEmail: string;
    email: string;
    ccEmail: string;
    phone: string;
    agentName: string;
    agentPhone: string;
    agentEmail: string;
    inspectionDate: any;
    inspectionTime: any;
    packageName: string;
    packagePrice: number;
    reportreView: string;
    comments: string;
    officerId: string;
    additionalServices: string;
    additionalServiceCost: number;
    paymentStatus: string = 'PENDING';
    latitude: string;
    longitude: string;
    bookingType: string;
    //timeZone: string;
    status: string;
}

export class reassignModel{
    type: string;
    inspectionNewDate: string;
    inspectionNewTime: string;
    id: string;
    inspectorId: string;
}