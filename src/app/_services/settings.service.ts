export class SettingsService {

    IP: string = ''//'localhost';
    port: string = ''//'8080';
    masterPwd: string = '';
    settings = {
        gotSettings : false,
        signing : '0',
        scanning : '0',
        scanningNonDomestic : '0',
        paymentEnabled : '0',
        pinRecovery : '0',
        emailPinEnambled : '0',
        emailEnabled : '0',
        hotelTermsConfirm : '0',
        checkInFuture : '0',
        checkInMoreNights : '0',
        searchByRoom  : '0',
        searchByCategory  : '0',
        BookingTypeTimeOut: '0',
        checkInByBookingCode: '0',
        GuestDataTimeOut: '0',
        PaymentTimeOut : '0',
        BookingRoomTimeOut: '0',
        BookingCodeTimeOut: '0',
        InfoDataTimeOut: '0',
        SigningTimeOut: '0',
        Langruages : [],
        defLang : {'LangId' : '2' , 'LangName': 'English', 'Abbreviation' : 'en'},
        Accept1 : '0',
        Accept2 : '0',
        Accept3 : '0',
    };

    translations = {
        'Welcome': 'Welcome to our cozy and friendly Hostel',
        'Choose': 'Please choose',
        'wantRoom': 'I want a room',
        'haveRoom': 'I have a reservation',
        'out_of_order' : 'Out Of Order',
        'pinRecovery' : 'Pin Recovery',
        'text_all_right_reserver' : 'All Rights Reserved'
    };
    images = {
        hotelPictures : []
    };

}
// keySys Possible values for Key System 
// 0 - RFID Cards
// 1 - PIN's
// 2 - PIN 7s
// 3 - Box8
// 4 - Box16
