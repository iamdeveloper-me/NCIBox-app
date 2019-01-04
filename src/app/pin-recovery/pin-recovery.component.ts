import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';
import { SettingsService } from '../_services/settings.service';

@Component({
  selector: 'app-pin-recovery',
  templateUrl: './pin-recovery.component.html',
  styleUrls: ['./pin-recovery.component.css'],
})
export class PinRecoveryComponent implements OnInit {
    headerTitle: string;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    focused: any;
    pinRecoveryForm: FormGroup;
    isError: boolean    = false;
    nextCaption: string = "";
    recoveredPin : string = "";
    roomList: string[] = [];

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService, private settingsService: SettingsService) {}

    ngOnInit() {
        this.headerTitle = this.langService.translate('pinRecovery');
        this.nextCaption = this.langService.translate('request_pin_recovery');
        this.pinRecoveryForm = new FormGroup({
            'reservationCode': new FormControl(null, Validators.required),
            'roomCode': new FormControl(null, Validators.required),
            'pass': new FormControl(null, Validators.required)
        });

        this.dataService.getBookedRooms();

        this.dataService.onPinRecovery.subscribe( data => {
            if (data.result === '0') {
                this.recoveredPin = data['PIN'];
            } else if (data.result === '12') {
                this.isError = true;
            } else {
                this.isError = true;
            }
        });
        this.dataService.onGetBookedRooms.subscribe( data => {
            this.roomList = data;
        });
    }

    isShowing(selectedIx: number) {
        return (this.selectedRow === 0) || (this.selectedRow === selectedIx);
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
        this.isError = false;
        this.focused = this.pinRecoveryForm.get(event.toElement.id);
    }

    onNextClick() {
        if (this.pinRecoveryForm.valid) {
            this.stateService.pinRecovery = this.pinRecoveryForm.value;
            this.dataService.pingRecovery();
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

}
