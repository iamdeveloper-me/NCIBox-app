import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';
import { SettingsService } from '../_services/settings.service';
import { WebSocketService } from '../_services/websocket.service';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
    headerTitle: string;
    interval: any;
    constructor(private navService: NavService,
        public stateService: StateService,
        private langService: LangService,
        public settingsService: SettingsService,
        private webSocketService: WebSocketService,
        private dataService: DataService,
        private spinnerService: Ng4LoadingSpinnerService
    ) {}


    ngOnInit() {
        this.dataService.connectToWS();
        this.headerTitle = this.langService.translate('out_of_order');
        this.spinnerService.hide();
        this.interval = setInterval(() => {
            try {
                if (this.webSocketService.isSocketOpen) {
                    clearInterval(this.interval);
                    this.spinnerService.show();
                    this.dataService.getSettings();
                    this.dataService.getFields();
                    this.dataService.getAllCategories();
                    this.navService.buildPath('new');
                    this.navService.goTo('/');
                } else {
                    this.dataService.connectToWS();
                }
            } catch (e) {
                console.log(e);
            }
        }, 5000);
    }

    openConnectionPage() {
        clearInterval(this.interval);
        this.navService.goConn();
    }
}
