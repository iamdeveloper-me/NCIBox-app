import { Injectable, Inject } from '@angular/core';
import { Category, Guest, Payment, Company, Booking, Room, PinRecovery } from '../_shared/models';
import { SettingsService } from './settings.service';

@Injectable()
export class StateService {

    availableCategories: Category[];
    availableRooms: Room[];
    adults: number = 1;
    children: number = 0;
    checkIn: Date;
    checkOut: Date;
    selectedCat: string = "";
    guests: Guest[];
    paymentData: Payment;
    companyData: Company;
    bookingData: Booking;
    pinRecovery: PinRecovery;
    signature : string = "";
    isReservationCode: boolean = false;
    reservationCode: string = "";
    bookingPassword : '';
    selectedRoom: string = "";
    currentLanguage: string = "";
    termsAndConditions:string = "";
    hotelInstructionText: string ="";
    bookedRooms: string[] = [];
    password:string = "";
    Accept1:boolean= false;
    Accept2:boolean= false;
    Accept3:boolean= false;
    termsCondition:boolean = false;
    AskUserToCompleateData:boolean = false;

    constructor( private settingsService: SettingsService) {
    }

    setDefault() {
        this.availableCategories = [];
        this.adults = 1;
        this.children = 0;
        this.checkIn = new Date();
        this.checkOut = new Date();
        this.checkOut.setDate(this.checkOut.getDate() + 1);
        this.selectedCat = '';
        this.signature = '';
        this.reservationCode = '';

        this.guests = [];
        if (this.settingsService.settings['demoData'] === '-1') {
            this.guests.push(new Guest('First name', 'Last name', 'Guest address',
            '123456', '10101', 'Hannover', 'Germany', 'test@test.com', '49-511-12-12'));
        }

        if (this.settingsService.settings['demoData'] === '-1') {
            this.paymentData = new Payment('Name on the card', '123 456 789', '01', '2018', '123', 0, false, false, '', false, false, 0, false);
        } else {
            this.paymentData = new Payment('', '', '', '', '', 0, false, false, '', false, false, 0, false);
        }

        if (this.settingsService.settings['demoData'] === '-1') {
            this.companyData = new Company('Demo company', '123123', 'Demo company address',
            '112233', 'Demo company city', 'Germany', 'test@test.com', '+9874563210');
        } else {
            this.companyData = new Company('', '', '', '', '', 'Germany', '', '');
        }

        this.bookingData = new Booking('', '', '', '', []);
    }
}
