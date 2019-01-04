
import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { Category, Guest, Company, Room, Booking, Payment } from '../_shared/models';
import { StateService } from './state.service';
import { NavService } from './nav.service';
import { LangService } from './lang.service';
import { SettingsService } from './settings.service';
import { WebSocketService } from './websocket.service';



@Injectable()
export class DataService {
    private ws: Subject<any>;
    private sentMessage: {};
    private receivedMessage: any;
    public onNoReservationFound = new EventEmitter<string>();
    public onAvailableRoomsByCategory = new EventEmitter<boolean>();
    public onPinRecovery = new EventEmitter<string>();
    public onTermsAndConditions = new EventEmitter<string>();
    public onGetTanslation = new EventEmitter<string>();
    public onGetBookedRooms = new EventEmitter<string>();
    public onGetSettigsFailure = new EventEmitter<string>();
    public onGetAllCategories = new EventEmitter<string>();
    public onBookingFailure = new EventEmitter<string>();
    public onSendMailResponse = new EventEmitter<string>();
    public onGetFields = new EventEmitter<string>();

    public allCategories: Category[];

    constructor(
        private stateService: StateService,
        private settingsService: SettingsService,
        private webSocketService: WebSocketService,
        private navService: NavService,
        private langService: LangService,
        private spinnerService: Ng4LoadingSpinnerService) {
        }

    private _arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    private onWSMessage() {
        const data = this.receivedMessage.data;
        switch (this.receivedMessage.type) {

            case 'OnConnect':
                // console.log('Get OnConnect Called');
                // if (data) {
                //     console.log('OnConnect :: ' + JSON.stringify(data));
                //     this.settingsService.images = data;
                //     this.getSettings();
                //     this.navService.goTo('/screensaver');
                // }
                break;
            case 'getHotelImages':
                if (data) {
                    this.settingsService.images = data;
                }
                break;

            case 'getSettings':
                console.log('Settings Data :: ', JSON.stringify(this.receivedMessage));
                if (!this.settingsService.settings['gotSettings']) {
                    if (data) {
                        if (data['result'] === '12') {
                            this.navService.goConn();
                        } else {
                            this.settingsService.settings = data;
                            this.langService.setLang(data.defLang.Abbreviation.toUpperCase());
                            this.stateService.currentLanguage = data.defLang.LangId;
                            this.getTranslation();
                            this.spinnerService.hide();
                        }
                    } else {
                        const errorKey = 'error_reservation_' + this.receivedMessage.result;
                        this.onGetSettigsFailure.emit(errorKey);
                    }
                    this.settingsService.settings['gotSettings'] = true;
                }
                break;

            case 'getAllCat' :
                var categories = data.cat;
                for (var cnt = 0; cnt < categories.length; cnt++) {
                    var cat = new Category(categories[cnt].name, parseFloat(categories[cnt].price.replace(',','.')),
                    categories[cnt].img1, [], []);
                    this.allCategories.push(cat);
                }
                // console.log('getAllCat response ',JSON.stringify(categories));
                this.onGetAllCategories.emit(categories);
                break;

            case 'getReservation':
                console.log('GetReservation', JSON.stringify(data));
                if (data.result === '0') {
                    this.stateService.selectedCat = data.selectedCat;
                    var checkIn = data.from;
                    var chckOut = data.to;
                    this.stateService.checkIn = new Date(checkIn.substring(0, 4), checkIn.substring(4, 6), checkIn.substring(6, 8));
                    this.stateService.checkOut = new Date(chckOut.substring(0, 4), chckOut.substring(4, 6), chckOut.substring(6, 8));
                    this.stateService.paymentData = new Payment('', '', '', '', '', 0, false, false, '', false, false, 0, false);
                    if (data.paymentData) {
                        if (data.paymentData.amount) {
                            this.stateService.paymentData.amount = parseFloat(data.paymentData.amount.replace(',', '.'));
                        }
                        if (data.paymentData.billToCompany) {
                            this.stateService.paymentData.billToCompany = (data.paymentData.billToCompany !== '0');
                        }
                        if (data.paymentData.billByEmail) {
                            this.stateService.paymentData.billByEmail = (data.paymentData.billByEmail !== '0');
                        }
                        if (data.paymentData.billEmail) {
                            this.stateService.paymentData.billEmail = data.paymentData.billEmail;
                        }
                        if (data.paymentData.isPaid) {
                            this.stateService.paymentData.isPaid = (data.paymentData.isPaid !== '0');
                        }
                        if (data.paymentData.isFixAmount) {
                            this.stateService.paymentData.isFixAmount = (data.paymentData.isFixAmount !== '0');
                        }
                        if (data.paymentData.fixAmount) {
                            this.stateService.paymentData.fixAmount = parseFloat(data.paymentData.fixAmount.replace(',', '.'));
                        }

                        if (data.paymentData.AskUserToCompleateData !== '0') {
                            this.stateService.paymentData.AskUserToCompleateData = true;
                        }
                    }
                    if (this.stateService.paymentData.isPaid) {
                        this.navService.buildPath('isPaid');
                    }

                    this.stateService.companyData = new Company('', '', '', '', '', '', '', '');
                    if (data.companyData) {
                        if (data.companyData.companyName) {
                            this.stateService.companyData.companyName = data.companyData.companyName;
                        }
                        if (data.companyData.companyVatId) {
                            this.stateService.companyData.companyVatId = data.companyData.companyVatId;
                        }
                        if (data.companyData.companyAddress) {
                            this.stateService.companyData.companyAddress = data.companyData.companyAddress;
                        }
                        if (data.companyData.companyPostCode) {
                            this.stateService.companyData.companyPostCode = data.companyData.companyPostCode;
                        }
                        if (data.companyData.companyCity) {
                            this.stateService.companyData.companyCity = data.companyData.companyCity;
                        }
                        if (data.companyData.companyCountry) {
                            this.stateService.companyData.companyCountry = data.companyData.companyCountry;
                        }
                        if (data.companyData.companyEmail) {
                            this.stateService.companyData.companyEmail = data.companyData.companyEmail;
                        }
                        if (data.companyData.companyMobile) {
                            this.stateService.companyData.companyMobile = data.companyData.companyMobile;
                        }
                    }

                    this.stateService.guests = [];

                    for (var cnt = 0; cnt < data.guests.length; cnt++) {
                        var guest = new Guest('', '', '', '', '', '', '', '', '');
                        if (data.guests[cnt].firstName) {
                            guest.firstName = data.guests[cnt].firstName;
                        }
                        if (data.guests[cnt].lastName) {
                            guest.lastName = data.guests[cnt].lastName;
                        }
                        if (data.guests[cnt].address) {
                            guest.address = data.guests[cnt].address;
                        }
                        if (data.guests[cnt].idNumber) {
                            guest.idNumber = data.guests[cnt].idNumber;
                        }
                        if (data.guests[cnt].postCode) {
                            guest.postCode = data.guests[cnt].postCode;
                        }
                        if (data.guests[cnt].city) {
                            guest.city = data.guests[cnt].city;
                        }
                        if (data.guests[cnt].country) {
                            guest.country = data.guests[cnt].country;
                        }
                        if (data.guests[cnt].email) {
                            guest.email = data.guests[cnt].email;
                        }
                        if (data.guests[cnt].mobile) {
                            guest.mobile = data.guests[cnt].mobile;
                        }
                        this.stateService.guests.push(guest);
                    }

                    if (this.stateService.paymentData.AskUserToCompleateData) {
                        this.navService.goFwd();
                    } else {
                        if (this.settingsService.settings.signing !== '0') {
                            this.navService.goTo('/signature');
                        } else if (this.settingsService.settings.scanning !== '0') {
                            this.navService.goTo('/scanning');
                        } else if (this.settingsService.settings.paymentEnabled !== '0' && !this.stateService.paymentData.isPaid) {
                            this.navService.goTo('/payment');
                        } else {
                            if ((this.stateService.isReservationCode) && (this.stateService.paymentData.isPaid)) {
                                this.doReservation();
                            } else {
                                this.doBook();
                            }
                        }
                    }
                } else {
                    this.onNoReservationFound.emit('no reservation');
                }
                break;


            case 'getAvailCat':
                var categories = data.cat;
                console.log('getAvailCat :: ', JSON.stringify(categories));
                for (var cnt = 0; cnt < categories.length; cnt++) {
                    var name = categories[cnt];
                    var cat = this.allCategories.find(item => item.name === name);
                    if (cat != null) {
                        var newCat = new Category(cat.name, cat.price, cat.img, cat.includedServices, cat.optionalServices);
                        this.stateService.availableCategories.push(newCat);
                    }
                }
                this.navService.goTo('/categorychoice');

            break;

            case 'getRooms':
                let rooms = data.rooms;
                console.log('GetRooms :: ', JSON.stringify(rooms));
                this.stateService.availableRooms = [];
                for (let i = 0, length = rooms.length; i < length; i++ ) {
                    this.stateService.availableRooms.push(new Room(rooms[i].name, rooms[i].price ));
                }
                this.onAvailableRoomsByCategory.emit(true);
                break;


            case 'getPrice':
                console.log('get Price response :: ', JSON.stringify(data));
                this.stateService.paymentData = new Payment('', '', '', '', '', 0, false, false, '', false, false, 0, false);
                if (data.result === '0') {
                    this.stateService.paymentData.isFixAmount = false;
                    if (data.price.toString().indexOf(',') > -1) {
                        this.stateService.paymentData.fixAmount = parseFloat(data.price.replace(",", "."));
                    } else {
                        this.stateService.paymentData.fixAmount = parseFloat(data.price);
                    }
                    this.navService.goTo('/guests');
                } else {
                    const errorKey = 'error_reservation_' + data.result;
                    this.onBookingFailure.emit(errorKey);
                }

                break;


            case 'doBook':
                // 0 - all ok
                // 1 - unknown error
                // 2 - unknown command 
                // 3 - insufficient data
                // 4 - no data
                // 5 - not connected
                // 6 - already connected
                // 7 - Cannot reach
                // 8 - no encoder 
                // 9 - room no free
                // 10 - payment unsuccessful
                // 11 - not allowed
                // 12 - wrong password
                console.log(JSON.stringify(data));
                if (data.result === '0') {
                    this.stateService.bookingData = new Booking(
                        data['bookingCode'], data['room'], data['section'], data['pin'], [data['commonDoors']]
                    );
                    this.navService.goTo('/closeup');
                } else {
                    const errorKey = 'error_reservation_' + data.result;
                    this.onBookingFailure.emit(errorKey);
                }
                break;

            case 'doReservation':
                console.log(JSON.stringify(data));

                if (data.result === '0') {
                    this.stateService.bookingData = new Booking(
                        data['bookingCode'], data['room'], data['section'], data['pin'], [data['commonDoors']]
                    );
                    this.navService.goTo('/closeup');
                } else {
                    const errorKey = 'error_reservation_' + data.result;
                    this.onBookingFailure.emit(errorKey);
                }
                break;

            case 'doSign':
                if (this.settingsService.settings.scanning !== '0') {
                    this.navService.goTo('/scanning');
                } else if (this.settingsService.settings.paymentEnabled !== '0' && !this.stateService.paymentData.isPaid) {
                    this.navService.goTo('/payment');
                } else {
                    if (this.stateService.isReservationCode) {
                        this.doReservation();
                    } else {
                        this.doBook();
                    }
                    // this.navService.goTo('/closeup');
                }
                break;

            case 'doPinRecovery':
                this.spinnerService.hide();
                this.onPinRecovery.emit(data);
                break;

            case 'getTerms':
                this.spinnerService.hide();
                if (data) {
                    if (data.hotelTermsInfoText) {
                        this.stateService.hotelInstructionText = data.hotelTermsInfoText;
                    }

                    if (data.hotelTermsSignText) {
                        this.stateService.termsAndConditions = data.hotelTermsSignText;
                    }
                }
                break;

            case 'getFields':
                this.spinnerService.hide();
                // console.log('getFields respose :: ', JSON.stringify(data) );
                this.onGetFields.emit(data);
                break;

            case 'doScan':
                if (this.settingsService.settings.paymentEnabled !== '0') {
                    this.navService.goTo('/payment');
                } else {
                    this.navService.goTo('/closeup');
                }
                break;
            case 'getBookedRooms':
                this.spinnerService.hide();
                this.onGetBookedRooms.emit(data.sort());
                break;

            case 'sendMail':
                this.spinnerService.hide();
                console.log('sendMail Response ', JSON.stringify(data));
                this.onSendMailResponse.emit(this.langService.translate(data.result === '0' ? 'text_mail_sent' : 'text_mail_sent_error'));
                break;

            case 'doFinish':
                this.spinnerService.hide();
                console.log('doFinish Response ::', JSON.stringify(data));
                break;

            case 'restart':
                console.log('restart called');
                this.spinnerService.hide();
                this.navService.goErrorPage();
                break;

            case 'getTranslation':
                if (data) {
                    this.settingsService.translations = data;
                    this.onGetTanslation.emit(data);
                } else {
                    const errorKey = 'error_translation_' + this.receivedMessage.result;
                    this.onGetTanslation.emit(errorKey);
                }
                break;
            default:
                this.receivedMessage = {};
        }

        this.spinnerService.hide();
        this.receivedMessage = {};
    }

    connectToWS() {
        this.webSocketService.createWebsocket();
        this.webSocketService.onMessageReceive.subscribe((data) => {
            try {
                this.receivedMessage = JSON.parse(data);
                this.onWSMessage();
            } catch (e) {
                console.log(e);
            }
        });
    }

    isOpen() {
      return this.webSocketService.isOpen();
    }

    getSettings() {
        // this.spinnerService.show();
        console.log('Get Settings Called');
        this.sentMessage = {'type': 'getSettings', 'data': { 'masterPwd': this.settingsService.masterPwd } };
        this.sendMessageToServer(this.sentMessage);
    }

    getReservation() {
        this.sentMessage = { 'type': 'getReservation', 'data': { 'reservationCode': this.stateService.reservationCode } };
        this.sendMessageToServer(this.sentMessage);
    }

    getPrice() {
      this.spinnerService.show();
      this.sentMessage = {
            'type': 'getPrice', 'data': {
                'from': this.DateToString(this.stateService.checkIn),
                'to': this.DateToString(this.stateService.checkOut),
                'selectedCat': this.stateService.selectedCat
            }
      };
      console.log('getPrice :: ' +JSON.stringify(this.sentMessage));
      this.sendMessageToServer(this.sentMessage);
    }

    base64toBlob(base64Data) {
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var dataArray = [];
        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                dataArray.push(byteCharacters[offset].charCodeAt(0));
            }
        }
        return dataArray;
    }

    getAllCategories() {
        this.allCategories = [];
        this.sentMessage = { 'type': 'getAllCat', 'data' : {'sendImages' : true }};
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    getTermsAndConditioins() {
        this.spinnerService.show();
        this.stateService.availableCategories = [];
        this.sentMessage = {
            'type': 'getTerms', 'data': {
                'langId': this.stateService.currentLanguage
            }
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    getTranslation() {
        this.sentMessage = {
            'type': 'getTranslation', 'data': {
                'langId': this.stateService.currentLanguage
            }
        };
        this.sendMessageToServer(this.sentMessage);
    }

    getAvailableCategories() {
        // this.spinnerService.show();
        this.stateService.availableCategories = [];
        this.sentMessage = {
            'type': 'getAvailCat', 'data': {
                'from': this.DateToString(this.stateService.checkIn),
                'to': this.DateToString(this.stateService.checkOut),
                'adults': this.stateService.adults,
                'children': this.stateService.children
            }
        };
        this.sendMessageToServer(this.sentMessage);
    }

    getAvailableRoomByCategories() {
        this.spinnerService.show();
        this.stateService.availableRooms = [];
        this.sentMessage = {
            'type': 'getRooms', 'data': {
                'cat' : this.stateService.selectedCat,
                'from': this.DateToString(this.stateService.checkIn),
                'to': this.DateToString(this.stateService.checkOut),
                'adults': this.stateService.adults,
                'children': this.stateService.children
            }
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    doScan() {
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'doScan'
        };
        this.sendMessageToServer(this.sentMessage);
    }

    doSign() {
        console.log('doSign Called');
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'doSign',
            'data' : { 'new' : 1, 'sign' : this.base64toBlob(this.stateService.signature) }
        };
        this.sendMessageToServer(this.sentMessage);
    }

    pingRecovery() {
        console.log('pingRecovery Called');
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'doPinRecovery',
            'data' : this.stateService.pinRecovery
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    doFinish(sendEmail: boolean, sendSMS: boolean, emailForData: string, mobileForData: string) {
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'doFinish', 'data': {
                'bookingCode': this.stateService.bookingData.bookingCode,
                'sendEmail': sendEmail,
                'sendSMS': sendSMS,
                'emailForData': emailForData,
                'mobileForData': mobileForData,
                'Accept1': this.stateService.Accept1.toString(),
                'Accept2': this.stateService.Accept2.toString(),
                'Accept3': this.stateService.Accept3.toString()
            }
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    sendMail(emailForData: string) {
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'sendMail', 'data': {
               'bookingCode': this.stateService.bookingData.bookingCode,
               'emailForData': emailForData
            }
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    doBook() {
        this.spinnerService.show();
        this.sentMessage = {
            'type': 'doBook', 'data': {
                'from': this.DateToString(this.stateService.checkIn),
                'to': this.DateToString(this.stateService.checkOut),
                'adults': this.stateService.adults,
                'children': this.stateService.children,
                'selectedCat': this.stateService.selectedCat,
                'reservationCode': this.stateService.reservationCode,
                'LangId': this.stateService.currentLanguage
            }
        };

        if (this.stateService.selectedRoom) {
            this.sentMessage['data']['selectedRoom'] = this.stateService.selectedRoom;
        }

        this.sentMessage['data']['password'] = this.stateService.password;

        this.stateService.guests.map(data => {
            if (data.mobile.toString().indexOf('+') === -1) {
                data.mobile = '+' + data.mobile;
            }
        });


        this.sentMessage['data']['guests'] = this.stateService.guests;
        this.sentMessage['data']['paymentData'] = this.stateService.paymentData;

        if (this.stateService.paymentData.billToCompany) {
            if (this.stateService.companyData.companyMobile.toString().indexOf('+') === -1) {
                this.stateService.companyData.companyMobile = '+' + this.stateService.companyData.companyMobile;
            }
            this.sentMessage['data']['companyData'] = this.stateService.companyData;
        }
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    doReservation() {
        this.spinnerService.show();
        this.stateService.guests.map(data => {
            if (data.mobile.toString().indexOf('+') === -1) {
                data.mobile = '+' + data.mobile;
            }
        });
        this.sentMessage = {
            'type': 'doReservation', 'data': {
                'reservationCode': this.stateService.reservationCode,
                'guests': this.stateService.guests,
                'paymentData': this.stateService.paymentData,
                'LangId': this.stateService.currentLanguage
            }
        };

        if (this.stateService.paymentData.billToCompany) {
            if (this.stateService.companyData.companyMobile.toString().indexOf('+') === -1) {
                this.stateService.companyData.companyMobile = '+' + this.stateService.companyData.companyMobile;
            }
            this.sentMessage['companyData'] = this.stateService.companyData;
        }
        this.sendMessageToServer(this.sentMessage);
    }

    getBookedRooms() {
        this.sentMessage = {
            'type': 'getBookedRooms', 'data': {}
        };
        this.sendMessageToServer(this.sentMessage);
    }

    getFields() {
        this.sentMessage = {
            'type': 'getFields', 'data': {
                'LangId': this.stateService.currentLanguage
            }
        };
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    getHotelImages() {
        this.spinnerService.show();
        this.sentMessage = {'type': 'getHotelImages'};
        console.log(JSON.stringify(this.sentMessage));
        this.sendMessageToServer(this.sentMessage);
    }

    DateToString(date: Date) {
        var y = date.getFullYear().toString();
        var m = (date.getMonth() + 1).toString();
        var d = date.getDate().toString();
        if (m.length == 1) { m = '0' + m };
        if (d.length == 1) { d = '0' + d };
        return y + m + d + '000000';
    }

    sendMessageToServer = (message) => {
        this.webSocketService.sendMessage(message);
    }
}
