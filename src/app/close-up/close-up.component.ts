import { Component, OnInit } from '@angular/core';

import { Booking } from '../_shared/models';
import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { SettingsService } from '../_services/settings.service';
import * as moment from 'moment';

@Component({
    selector: 'app-close-up',
    templateUrl: './close-up.component.html',
    styleUrls: ['./close-up.component.css'],
})
export class CloseUpComponent implements OnInit {
    headerTitle: string;
    sendMail: boolean = false;
    sendSMS: boolean = false;
    mobileForData: string = "";
    emailForData: string = "";
    booking: Booking;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    emailEnabled: boolean = false;
    smsEnabled: boolean = false;
    checkIn: String = null;
    checkOut: String = null;
    checkInDate: String = null;
    checkOutDate: String = null;
    customBookingError: String = null;
    focused: any;



    constructor(private navService: NavService,
        private langService: LangService,
        private stateService: StateService,
        private dataService: DataService,
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Finish');
        this.mobileForData = this.stateService.guests[0].mobile;
        this.emailForData = this.stateService.guests[0].email;
        this.booking = this.stateService.bookingData;
        this.emailEnabled = (this.settingsService.settings['emailEnabled'] === '-1');
        this.checkIn = this.stateService.checkIn.toDateString();
        this.checkOut = this.stateService.checkOut.toDateString();

        if (this.settingsService.settings['printingEnabled'] === '0') {
            this.emailEnabled = true;
        }

        this.smsEnabled = (this.settingsService.settings['smsEnabled'] === '-1');


        this.dataService.onSendMailResponse.subscribe( data => {
            this.customBookingError = data;
        });

        this.dataService.doFinish((this.settingsService.settings['emailEnabled'] === '-1'),
        this.smsEnabled, this.emailForData, this.mobileForData);

        const time = (parseFloat(this.settingsService.settings.InfoDataTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);
    }

    onNextClick() {
        // if (this.sendMail || this.sendSMS) {
        //     this.dataService.doFinish(this.sendMail, this.sendSMS, this.emailForData, this.mobileForData);
        // }  else {
        //     this.navService.goFwd();
        // }
        this.navService.buildPath('new');
        this.navService.goHome();
    }

    getNo() {
        return this.langService.translate('no');
    }

    getYes() {
        return this.langService.translate('yes');
    }

    isShowing(selectedIx: number) {
        return (this.selectedRow == 0) || (this.selectedRow == selectedIx);
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.focused = event.target;
    }

    onSendSMSChange(event) {
        if (!this.sendSMS) {
            this.isKeyboard = false;
            this.selectedRow = 0;
        }
    }

    onSendEmailChange(event) {
        if (!this.sendMail) {
            this.isKeyboard = false;
            this.selectedRow = 0;
        }
    }

    onSendEmail(event) {
        const regex = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        if (!regex.test(this.emailForData)) {
            alert('Incorrect E-mail Address!');
            return false;
        }
        this.dataService.sendMail(this.emailForData);
    }

    getFocused() {
        return this.focused;
    }

    onNewValue(value: string) {
        var regex = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        if (value === 'return') {
            this.isKeyboard = false;
            this.selectedRow = 0;
        } else {
            if (this.focused.id === 'mobileForData') {
                this.mobileForData = value;
            }
            if (this.focused.id === 'emailForData') {
                if (regex.test(value.toLocaleLowerCase())) {
                    this.emailForData = value.toLocaleLowerCase();
                } else {
                    alert('Incorrect E-mail Address!');
                }
            }
        }
    }

}
