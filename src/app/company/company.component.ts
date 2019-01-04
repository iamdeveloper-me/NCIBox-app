import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CountryService } from '../_services/country.service';
import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
    headerTitle: string;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    focused: any;
    companyForm: FormGroup;
    isError: boolean = false;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService, public countryService: CountryService) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Company');
        this.companyForm = new FormGroup({
            'companyName': new FormControl(null, Validators.required),
            'companyVatId': new FormControl(null, Validators.required),
            'companyAddress': new FormControl(null, Validators.required),
            'companyPostCode': new FormControl(null, Validators.required),
            'companyCity': new FormControl(null, Validators.required),
            'companyCountry': new FormControl(null, Validators.required),
            'companyEmail': new FormControl(null, Validators.email),
            'companyMobile': new FormControl(null, Validators.pattern(/^[0-9,-]*$/))
        });

        this.companyForm.get("companyName").setValue(this.stateService.companyData.companyName);
        this.companyForm.get("companyVatId").setValue(this.stateService.companyData.companyVatId);
        this.companyForm.get("companyAddress").setValue(this.stateService.companyData.companyAddress);
        this.companyForm.get("companyPostCode").setValue(this.stateService.companyData.companyPostCode);
        this.companyForm.get("companyCity").setValue(this.stateService.companyData.companyCity);
        this.companyForm.get('companyCountry').setValue('Germany');

        if (this.stateService.companyData.companyCountry && this.stateService.companyData.companyCountry.length > 0) {
            this.companyForm.get("companyCountry").setValue(this.stateService.companyData.companyCountry);
        }

        this.companyForm.get("companyEmail").setValue(this.stateService.companyData.companyEmail);
        this.companyForm.get("companyMobile").setValue(this.stateService.companyData.companyMobile.replace('+',''));
    }

    isShowing(selectedIx: number) {
        return (this.selectedRow == 0) || (this.selectedRow == selectedIx);
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.isError = false;
        this.focused = this.companyForm.get(event.toElement.id);
    }

    onNextClick() {
        if (this.companyForm.valid) {

            // if (this.companyForm.value.companyMobile.toString().indexOf('+') === -1) {
            //     this.companyForm.value.companyMobile = '+' + this.companyForm.value.companyMobile;
            // }

            this.stateService.companyData = this.companyForm.value;
            this.navService.goTo('/payment');
        } else {
            this.isError = true;
        }
    }

    getFocused() {
        return this.focused;
    }

    setCountry(value){
        this.companyForm.get("companyCountry").setValue(value);
        document.getElementById('id01').style.display='none';
    }

    onNewValue(value: string) {
        if (value == 'return') {
            this.isKeyboard = false;
            this.selectedRow = 0;
        }
        else {
            this.focused.patchValue(value);
        }
    }

}
