import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NavService } from '../_services/nav.service';
import { SettingsService } from '../_services/settings.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})

export class ReservationComponent implements OnInit {
    headerTitle: string;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    focused: any;
    isError: boolean = false;
    isNoReservation: boolean = false;
    reservationCodeForm: FormGroup;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService,private settingsService: SettingsService) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Reservation');
        this.reservationCodeForm = new FormGroup({
            'reservationCode': new FormControl(null, Validators.required)
        });

        this.reservationCodeForm.get('reservationCode').setValue(this.stateService.reservationCode);
        this.dataService.onNoReservationFound.subscribe( message => { this.isNoReservation = true; });

        const time = (parseFloat(this.settingsService.settings.BookingCodeTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);
    }

    onNextClick() {
        if (this.reservationCodeForm.valid) {
            this.stateService.reservationCode = this.reservationCodeForm.get('reservationCode').value;
            this.dataService.getReservation();
        } else {
            this.isError = true;
        }
    }

    isShowing(selectedIx: number) {
        return (this.selectedRow == 0) || (this.selectedRow == selectedIx);
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.isError = false;
        this.isNoReservation = false;
        this.focused = this.reservationCodeForm.get(event.toElement.id);
    }

    getFocused() {
        return this.focused;
    }

    onNewValue(value: string) {
        if (value == 'return') {
            this.isKeyboard = false;
            this.selectedRow = 0;
        } else {
            this.focused.patchValue(value);
        }
    }

}
