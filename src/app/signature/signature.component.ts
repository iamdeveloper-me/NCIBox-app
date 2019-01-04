import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignatureFieldComponent } from './signature-field/signature-field.component';

import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';
import { SettingsService } from '../_services/settings.service';

@Component({
    selector: 'app-signature',
    templateUrl: './signature.component.html',
    styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
    headerTitle: string;
    nextCaption: string = "";
    isError: boolean = false;
    public form: FormGroup;
    public signBox: SignatureFieldComponent;
    customBookingError: string;
    checked: boolean = false;
    isAccept1: boolean = false;
    isAccept2: boolean = false;
    isAccept3: boolean = false;
    isTermsAndConditions: boolean = false;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService, private fb: FormBuilder, private settingsService: SettingsService) {
        // this.form = fb.group({
        //     signatureField1: ['', Validators.required]
        // });
    }

    @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
    @ViewChildren('sigContainer1') public sigContainer1: QueryList<ElementRef>;

    ngOnInit() {
        this.headerTitle = this.langService.translate('Signature');
        // Check if scanning is true then go to scanning page else for payment

        if ((this.stateService.isReservationCode) && (this.stateService.paymentData.isPaid)) {
            this.nextCaption = this.langService.translate('NextNoPayment');
        } else {
            this.nextCaption = this.langService.translate((this.settingsService.settings.scanning !== '0')
                ? 'nextScanning' : 'NextPayment');
        }
        this.isTermsAndConditions = (this.settingsService.settings.scanning === '0' &&
            this.settingsService.settings.paymentEnabled === '0' &&
            this.settingsService.settings.hotelTermsConfirm === '-1');


        const time = (parseFloat(this.settingsService.settings.SigningTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);

        this.isAccept1 = (this.settingsService.settings.Accept1 !== '0' && this.isTermsAndConditions);
        this.isAccept2 = (this.settingsService.settings.Accept2 !== '0' && this.isTermsAndConditions);
        this.isAccept3 = (this.settingsService.settings.Accept3 !== '0' && this.isTermsAndConditions);

        let formFields = {
            'signatureField1': new FormControl(null, Validators.required)
        };
        formFields['termsCondition'] = this.isTermsAndConditions ? new FormControl(null, Validators.required) : new FormControl(null);
        this.form = new FormGroup(formFields);

        this.dataService.onBookingFailure.subscribe( data => {
            this.customBookingError = this.langService.translate(data);
        });
    }

    public ngAfterViewInit() {
        this.signBox = this.sigs.find((sig, index) => index === 0);
        this.signBox.signaturePad.set('penColor', 'rgb(255, 0, 0)');
        this.beResponsive();
    }

    // set the dimensions of the signature pad canvas
    public beResponsive() {
        console.log('Resizing signature pad canvas to suit container size');
        this.size(this.sigContainer1.first, this.sigs.first);
    }

    public size(container: ElementRef, sig: SignatureFieldComponent) {
        sig.signaturePad.set('canvasWidth', container.nativeElement.clientWidth);
        sig.signaturePad.set('canvasHeight', container.nativeElement.clientHeight);
    }

    public submit() {
        if (!this.form.valid) {
            alert(this.langService.translate('error_terms_and_conditions'));
            return;
        }
        this.form.removeControl('termsCondition');
        this.stateService.signature = this.signBox.signature.split(',')[1];
        this.dataService.doSign();
    }

    public clear() {
        this.signBox.clear();
    }

    onTermsAndCondClick() {
        this.stateService.signature = this.signBox.signature.split(',')[1];
        this.navService.goTo('/termsandconditions');
    }

    toggleEditable(event) {
        this.stateService[event.target.id] = event.target.checked;
    }
}
