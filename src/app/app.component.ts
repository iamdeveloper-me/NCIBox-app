import { Component, OnInit, HostListener } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';

import { DataService } from './_services/data.service';
import { NavService } from './_services/nav.service';
import { WebSocketService } from './_services/websocket.service';
import { SettingsService } from './_services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    // private interval: any;
    constructor( @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private dataService: DataService,
        private settingsService: SettingsService,
        private navService: NavService,
        private webSocketService: WebSocketService) { }
    
    // @HostListener('document:keydown', ['$event'])
    // toggleFullScreen(event: KeyboardEvent) {
    //     // var evtobj = window.event? event : null
    //     if (event.keyCode == 67 && event.ctrlKey){
    //         var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
    //             (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
    //             (document['mozFullScreenElement'] && document['mozFullScreenElement'] !== null) ||
    //             (document['msFullscreenElement'] && document['msFullscreenElement'] !== null);

    //         var docElm = document.documentElement;
    //         if (!isInFullScreen) {
    //             if (docElm.requestFullscreen) {
    //                 docElm.requestFullscreen();
    //             } else if (docElm['mozRequestFullScreen']) {
    //                 docElm['mozRequestFullScreen']();
    //             } else if (docElm.webkitRequestFullScreen) {
    //                 docElm.webkitRequestFullScreen();
    //             } else if (docElm['msRequestFullscreen']) {
    //                 docElm['msRequestFullscreen']();
    //             }
    //         } else {
    //             if (document.exitFullscreen) {
    //                 document.exitFullscreen();
    //             } else if (document.webkitExitFullscreen) {
    //                 document.webkitExitFullscreen();
    //             } else if (document['mozCancelFullScreen']) {
    //                 document['mozCancelFullScreen']();
    //             } else if (document['msExitFullscreen']) {
    //                 document['msExitFullscreen']();
    //             }
    //         }
    //     }       
    // }

    ngOnInit() {
        this.settingsService.IP = this.storage.get('IP');
        this.settingsService.port = this.storage.get('Port');
        this.settingsService.masterPwd = this.storage.get('Password') !== null ? this.storage.get('Password') : '';
        if (this.settingsService.IP == null || this.settingsService.masterPwd == '') {
            this.navService.goConn();
            return;
        } else {
                this.dataService.connectToWS();
        }

        // if (this.settingsService.IP != null && this.storage.get('Password') === undefined || this.storage.get('Password') == null) {
        //     this.navService.goErrorPage();
        //     return;
        // }

        // this.settingsService.masterPwd = ((this.storage.get('Password') !== null)
        //     && (this.storage.get('Password') !== '')) ? this.storage.get('Password') : '';

        // this.dataService.connectToWS();
        // this.interval = setInterval(() => {
        //     try {
        //         if (this.webSocketService.isConnecting()) {
        //             clearInterval(this.interval);
        //         } else {
        //             if (this.webSocketService.isClosed()) {
        //                 this.dataService.connectToWS();
        //             }
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }, 3000);
    }
}
