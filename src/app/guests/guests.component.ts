import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';
import { SettingsService } from '../_services/settings.service';
import { CountryService } from '../_services/country.service';

@Component({
    selector: 'app-guests',
    templateUrl: './guests.component.html',
    styleUrls: ['./guests.component.css']
})


export class GuestsComponent implements OnInit {
    headerTitle: string;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    focused: any;
    guestsForm: FormGroup;
    isError: boolean = false;
    nextCaption: string = "";
    // flag: boolean = false;
    checked: boolean = false;
    isTermsAndConditions: boolean = false;
    isAccept1: boolean = false;
    isAccept2: boolean = false;
    isAccept3: boolean = false;
    mobileNumber: string = "";
    customBookingError: string;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService, public settingsService: SettingsService, public countryService: CountryService) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Guests');
        if ((this.stateService.isReservationCode) && (this.stateService.paymentData.isPaid)) {
            this.nextCaption = this.langService.translate('NextNoPayment');
        } else if (this.settingsService.settings.signing === '-1') {
            this.nextCaption = this.langService.translate('NextSigning');
        } else if (this.settingsService.settings.scanning === '-1') {
            this.nextCaption = this.langService.translate('NextScaning');
        } else if (this.settingsService.settings.paymentEnabled === '-1') {
            this.nextCaption = this.langService.translate('NextPayment');
        } else {
            this.nextCaption = this.langService.translate('NextNoPayment');
        }


        let formFields = {
            'firstName': new FormControl(null, Validators.required),
            'lastName': new FormControl(null, Validators.required),
            'address': new FormControl(null, Validators.required),
            'idNumber': new FormControl(null, Validators.required),
            'postCode': new FormControl(null, Validators.required),
            'city': new FormControl(null, Validators.required),
            'country': new FormControl(null, Validators.required),
            'email': new FormControl(null, Validators.email),
            'mobile': new FormControl(null, [Validators.pattern(/^[0-9]*$/), Validators.required, Validators.minLength(10),Validators.maxLength(25)])
        };

        if (this.settingsService.settings.pinRecovery === '-1') {
            formFields['password'] = new FormControl(null, Validators.required);
        }

        this.isTermsAndConditions = (this.settingsService.settings.signing === '0' &&
            this.settingsService.settings.scanning === '0' &&
            this.settingsService.settings.paymentEnabled === '0' &&
            this.settingsService.settings.hotelTermsConfirm === '-1');
        
        formFields['termsCondition'] = this.isTermsAndConditions?  new FormControl(null, Validators.required) : new FormControl(null);

        this.isAccept1 = this.settingsService.settings.Accept1 !== '0' && this.isTermsAndConditions ? true: false;
        this.isAccept2 = this.settingsService.settings.Accept2 !== '0' && this.isTermsAndConditions ? true: false;
        this.isAccept3 = this.settingsService.settings.Accept3 !== '0' && this.isTermsAndConditions ? true: false;
        
        this.guestsForm = new FormGroup(formFields);
        this.guestsForm.get('country').setValue('Germany');
        if (this.guestsForm && this.stateService.guests && this.stateService.guests.length > 0) {
            this.guestsForm.get('firstName').setValue(this.stateService.guests[0].firstName);
            this.guestsForm.get('lastName').setValue(this.stateService.guests[0].lastName);
            this.guestsForm.get('address').setValue(this.stateService.guests[0].address);
            this.guestsForm.get('idNumber').setValue(this.stateService.guests[0].idNumber);
            this.guestsForm.get('postCode').setValue(this.stateService.guests[0].postCode);
            this.guestsForm.get('city').setValue(this.stateService.guests[0].city);
            if (this.stateService.guests[0].country && this.stateService.guests[0].country.length > 0) {
                this.guestsForm.get('country').setValue(this.stateService.guests[0].country);
            }
            this.guestsForm.get('email').setValue(this.stateService.guests[0].email);
            this.guestsForm.get('mobile').setValue(this.stateService.guests[0].mobile);
            if (this.stateService.guests[0].mobile.indexOf('+') > -1) {
                this.guestsForm.get('mobile').setValue(this.stateService.guests[0].mobile.substring(1));
            }
        }

        this.dataService.onBookingFailure.subscribe( data => {
            this.customBookingError = this.langService.translate(data);
        });


        const time = (parseFloat(this.settingsService.settings.GuestDataTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);

    }

    isShowing(selectedIx: number) {
        return (this.selectedRow === 0) || (this.selectedRow === selectedIx);
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.isError = false;
        this.focused = this.guestsForm.get(event.toElement.id);
    }

    onNextClick() {
        if (this.guestsForm.valid) {
            if (!this.stateService.guests) {
                this.stateService.guests = [];
            }
            this.guestsForm.removeControl('termsCondition');
            this.stateService.guests[0] = this.guestsForm.value;


            if (this.settingsService.settings.pinRecovery === '-1') {
                this.stateService.bookingPassword = this.guestsForm.value.password;
            }

            if (this.settingsService.settings.signing !== '0') {
                this.navService.goTo('/signature');
            } else if (this.settingsService.settings.scanning !== '0') {
                this.navService.goTo('/scanning');
            } else if (this.settingsService.settings.paymentEnabled !== '0' && !this.stateService.paymentData.isPaid) {
                this.navService.goTo('/payment');
            } else {
                if ((this.stateService.isReservationCode) && (this.stateService.paymentData.isPaid)) {
                    this.dataService.doReservation();
                } else {
                    this.dataService.doBook();
                }
            }
            this.mobileNumber = this.guestsForm.get('mobile').value.substring(1);
        } else {
            this.isError = true;
        }

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

    setCountry(value){
        this.guestsForm.get('country').setValue(value);
        document.getElementById('id01').style.display='none';
    }

    onTermsAndCondClick() {
        this.stateService.guests[0] = this.guestsForm.value;
        this.guestsForm.value.mobile = this.guestsForm.value.mobile;
        this.navService.goTo('/termsandconditions');
    }

    toggleEditable(event) {
        this.stateService[event.target.id] = event.target.checked;
   }
}
