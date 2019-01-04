import { Component, HostListener } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { NavService } from '../_services/nav.service';
import { SettingsService } from '../_services/settings.service';
import { DataService } from '../_services/data.service';
import { WebSocketService } from '../_services/websocket.service';

@Component({
    selector: 'app-screen-saver',
    templateUrl: './screen-saver.component.html',
    styleUrls: ['./screen-saver.component.css']
})
export class ScreenSaverComponent {
    interval:any;
    width: any;
    height: any;
    constructor(
        private navService: NavService,
        private dataService: DataService,
        public settingsService: SettingsService,
        private spinnerService: Ng4LoadingSpinnerService,
        private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.interval = setTimeout( () => {
            console.log('Screen Saver loop running');
            if (this.webSocketService.isClosed()) {
                this.dataService.connectToWS();
            }
        }, 4000);


        this.webSocketService.onSocketOpen.subscribe((data) => {
            console.log('Socket open subscribe called');
            clearInterval(this.interval);
            this.dataService.getHotelImages();
            this.dataService.getSettings();
        });
    }

    onScreenClick() {
        this.dataService.getFields();
        this.dataService.getAllCategories();
        this.navService.buildPath('new');
        this.navService.goTo('/welcome');
    }
}
