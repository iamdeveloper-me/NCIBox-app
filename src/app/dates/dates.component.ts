import { Component, OnInit } from '@angular/core';
import { IMyDpOptions, IMySelector } from 'mydatepicker';
import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';
import { SettingsService } from '../_services/settings.service';
import * as moment from 'moment';


@Component({
    selector: 'app-dates',
    templateUrl: './dates.component.html',
    styleUrls: ['./dates.component.css'],
})

export class DatesComponent implements OnInit {
    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private settingsService: SettingsService) { }

    headerTitle: string;
    checkIn: Date = null;
    checkOut: Date = null;
    isError: boolean = false;

    checkInFuture : boolean = this.settingsService.settings.checkInFuture !== '0' ? true : false;
    checkInMoreNights : boolean = this.settingsService.settings.checkInMoreNights !== '0' ? true : false;
    // selectedDate: Object = {};
    startDate: Object = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    selectedDate: Object = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1};

    datePickerOptions: IMyDpOptions = {
        dateFormat: 'dd, mmm yyyy',
        inline:false,
        showTodayBtn: false,
        disableUntil: { year: (new Date().getFullYear()), month: (new Date().getMonth() + 1), day: (new Date().getDate() - 1) }
    };

    // Initialize selector state to false
    selector: IMySelector = {
        open: false
    };

    selectorSecond: IMySelector = {
        open: false
    };
    ngOnInit() {
        this.checkIn = moment().toDate();
        this.checkOut =  moment(this.checkIn).add(1, 'days').toDate();
        this.headerTitle = this.langService.translate('Check-in and check-out');
    }

    onNextClick() {
        if (this.checkIn) {
            this.stateService.checkIn = this.checkIn;
            this.stateService.checkOut = this.checkOut;
            this.navService.goFwd();
        } else {
            this.isError = true;
        }
    }

    onCheckInDateChange(event) {
        this.checkIn = event.jsdate;
        var new_date = moment(this.checkIn, 'D-MMMM-YYYY').add(1, 'days');
        this.selectedDate = {
            day: new_date.format('D'),
            month: new_date.format('M'),
            year: new_date.format('YYYY'),
        };
        this.checkOut = new_date.toDate();
    }

    onCheckOutDateChange(event) {
        this.checkOut = event.jsdate;
    }

    onStartCalendarClick() {
        try {
            this.selector = {
                open: !this.selector.open
            };
        } catch (e) { }
    }

    onStartCalendarSecondClick() {
        try {
            this.selectorSecond = {
                open: !this.selectorSecond.open 
            };
        } catch (e) { }
    }

}
