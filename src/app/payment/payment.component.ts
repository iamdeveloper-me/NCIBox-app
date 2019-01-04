import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Category } from '../_shared/models';
import { NavService } from '../_services/nav.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';
import { SettingsService } from '../_services/settings.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})

export class PaymentComponent implements OnInit {
    headerTitle: string;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    focused: any;
    paymentForm: FormGroup;
    emailEnabled: boolean;
    selectedCat: string;
    amount: string;
    noNights: string;
    billToCompany: boolean = false;
    billByEmail: boolean = false;
    isError: boolean = false;
    isTermsAndConditions:boolean = false;
    isTermsChecked:boolean = false;
    checked: boolean = false;
    customBookingError: string;
    billEmail: string;
    isAccept1:boolean = false;
    isAccept2:boolean = false;
    isAccept3:boolean = false;

    constructor(private navService: NavService,
        public stateService: StateService,
        private langService: LangService,
        private settingsService: SettingsService,
        private dataService: DataService) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Payment');
        this.emailEnabled = (this.settingsService.settings['emailEnabled'] === '-1');
        this.billEmail = this.stateService.guests[0].email;

        if (this.settingsService.settings['printingEnabled'] === '0') {
            this.emailEnabled = true;
        }

        this.billToCompany = this.stateService.paymentData.billToCompany;
        this.billByEmail = this.stateService.paymentData.billByEmail;
        var priceOfRoom = 0;
        if (this.stateService.paymentData.isFixAmount) {
            priceOfRoom = this.stateService.paymentData.fixAmount;
        } else {
            for (var cnt = 0; cnt < this.dataService.allCategories.length; cnt++) {
                if (this.dataService.allCategories[cnt].name === this.stateService.selectedCat) {
                        priceOfRoom = this.dataService.allCategories[cnt].price;
                    break;
                }
            }
        }
        this.selectedCat = this.stateService.selectedCat + "(" + parseFloat(priceOfRoom.toString()).toFixed(2) + "/night)";
        var days = this.daysBetween(this.stateService.checkIn, this.stateService.checkOut);
        this.noNights = days.toString();
        if (this.stateService.paymentData.isFixAmount) {
            this.amount = this.stateService.paymentData.fixAmount.toFixed(2);
        } else {
            this.amount = (priceOfRoom * days).toFixed(2);
        }

        let formFields = {};
        formFields['cardName'] = new FormControl(this.stateService.paymentData.cardName, Validators.required);
        formFields['cardNo']   =    new FormControl(this.stateService.paymentData.cardNo, Validators.required);
        formFields['expMonth']  =     new FormControl(this.stateService.paymentData.expMonth,
                Validators.compose([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]));
        formFields['expYear'] =    new FormControl(this.stateService.paymentData.expYear,
                Validators.compose([Validators.required, Validators.pattern('^([0-9]{2})$')]));
        formFields['cvv'] =    new FormControl(this.stateService.paymentData.cvv,
                Validators.compose([Validators.required, Validators.pattern('^[0-9]{3}$')]));
        formFields['billEmail'] =    new FormControl(null);
        
        this.isTermsAndConditions = this.settingsService.settings.hotelTermsConfirm !== '0';

        this.isAccept1 = this.settingsService.settings.Accept1 !== '0' && this.isTermsAndConditions ? true: false;
        this.isAccept2 = this.settingsService.settings.Accept2 !== '0' && this.isTermsAndConditions ? true: false;
        this.isAccept3 = this.settingsService.settings.Accept3 !== '0' && this.isTermsAndConditions ? true: false;

        formFields['termsCondition'] = this.isTermsAndConditions ? new FormControl(null, Validators.required) :
            new FormControl(null);

        this.paymentForm = new FormGroup(formFields);

        if (!(this.stateService.paymentData.billEmail === '')) {
            this.paymentForm.get('billEmail').setValue(this.stateService.paymentData.billEmail);
        } else {
            this.paymentForm.get('billEmail').setValue(this.stateService.guests[0].email);
        }


        if (this.paymentForm && this.stateService.paymentData) {
            this.paymentForm.get('cardName').setValue(this.stateService.paymentData.cardName);
            this.paymentForm.get('cardNo').setValue(this.stateService.paymentData.cardNo);
            this.paymentForm.get('expMonth').setValue(this.stateService.paymentData.expMonth);
            this.paymentForm.get('expYear').setValue(this.stateService.paymentData.expYear);
            this.paymentForm.get('cvv').setValue(this.stateService.paymentData.cvv);
            this.paymentForm.get('billEmail').setValue(this.stateService.paymentData.billEmail);
        }

        this.dataService.onBookingFailure.subscribe( data => {
            this.customBookingError = this.langService.translate(data);
        });


        const time = (parseFloat(this.settingsService.settings.PaymentTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);

    }

    onNextClick() {
        if (this.paymentForm.valid) {
            this.paymentForm.removeControl('termsCondition');
            this.stateService.paymentData = this.paymentForm.value;
            this.stateService.paymentData.amount = parseFloat(this.amount);
            this.setBillData();
            if (this.stateService.isReservationCode) {
                this.dataService.doReservation();
            } else {
                this.dataService.doBook();
            }
        } else {
            this.isError = true;
        }
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.isError = false;
        this.focused = this.paymentForm.get(event.toElement.id);
    }

    checkVisibility(key) {
        return this.settingsService.settings[key] !== '0' && this.isTermsAndConditions && this.isKeyboard;
    }

    isShowing(selectedIx: number) {
        return (this.selectedRow === 0) || (this.selectedRow === selectedIx);
    }

    getNo() {
      return this.langService.translate('no');
    }

    getYes() {
      return this.langService.translate('yes');
    }

    onBillByEmailChange(event) {
        if (!this.billByEmail) {
            this.isKeyboard = false;
            this.selectedRow = 0;
        }
        this.setBillData();
    }

    onBillToCompanyChange(event) {
        if (!this.billToCompany) {
            this.isKeyboard = false;
            this.selectedRow = 0;
        } else {
            this.stateService.paymentData = this.paymentForm.value;
            this.navService.goTo('/company');
        }
        this.setBillData();
    }

    setBillData() {
        this.stateService.paymentData.billToCompany = this.billToCompany;
        this.stateService.paymentData.billByEmail = this.billByEmail;
    }

    daysBetween(date1: Date, date2: Date) {
        var oneDay   = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / (oneDay)));
        return diffDays;
    }

    getFocused() {
        return this.focused;
    }

    onNewValue(value: string) {
        if (value === 'return') {
            this.isKeyboard = false;
            this.selectedRow = 0;
        } else {
            this.focused.patchValue(value);
        }
    }

    toggleEditable(event) {
        this.stateService[event.target.id] = event.target.checked;
    }

   onTermsAndCondClick() {
        this.stateService.paymentData = this.paymentForm.value;
        this.stateService.paymentData.amount = parseFloat(this.amount);
        this.stateService.paymentData.billToCompany = this.billToCompany;
        this.stateService.paymentData.billByEmail = this.billByEmail;
        this.navService.goTo('/termsandconditions');
   }

}
