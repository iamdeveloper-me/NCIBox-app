import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';
import { SettingsService } from '../_services/settings.service';

@Component({
    selector: 'app-scanning',
    templateUrl: './scanning.component.html',
    styleUrls: ['./scanning.component.css']
})
export class ScanningComponent implements OnInit {
    headerTitle: string;
    nextCaption: string = "";
    checked: boolean = false;
    isAccept1 :boolean = false;
    isAccept2 :boolean = false;
    isAccept3 :boolean = false;
    public form: FormGroup;
    isTermsAndConditions: boolean = false;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService, private settingsService: SettingsService) { }

    startScaning() {
        if(this.isTermsAndConditions) {
            if(!this.checked) {
                alert(this.langService.translate('error_terms_and_conditions'));
                return;
            }
            if(!this.form.valid) {
                alert(this.langService.translate('error_terms_and_conditions'));
                return;
            }
        }
        this.form.removeControl('termsCondition');
        this.dataService.doScan();
    }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Scanning');
        if ((this.stateService.isReservationCode) && (this.stateService.paymentData.isPaid)) {
            this.nextCaption = this.langService.translate('NextNoPayment');
        } else {
            this.nextCaption = this.langService.translate('NextPayment');
        }

        this.isTermsAndConditions = (this.settingsService.settings.paymentEnabled === '0' &&
        this.settingsService.settings.hotelTermsConfirm === '-1');

        this.isAccept1 = (this.settingsService.settings.Accept1 !== '0' && this.isTermsAndConditions);
        this.isAccept2 = (this.settingsService.settings.Accept2 !== '0' && this.isTermsAndConditions);
        this.isAccept3 = (this.settingsService.settings.Accept3 !== '0' && this.isTermsAndConditions);
        
        let formFields = { };
        formFields['termsCondition'] = this.isTermsAndConditions? new FormControl(null, Validators.required): new FormControl(null);
        this.form = new FormGroup(formFields);
    }

    onTermsAndCondClick() {
        this.navService.goTo('/termsandconditions');
    }

    toggleEditable(event) {
        this.stateService[event.target.id] = event.target.checked;
    }
}
