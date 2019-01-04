import { Component, OnInit } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Injectable, Inject } from '@angular/core';

import { DataService } from '../_services/data.service';
import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { SettingsService } from '../_services/settings.service';
import { WebSocketService } from '../_services/websocket.service';

@Component({
    selector: 'app-connection-params',
    templateUrl: './connection-params.component.html',
    styleUrls: ['./connection-params.component.css'],
})
export class ConnectionParamsComponent implements OnInit {
    IP: string;
    Port: string;
    Password: string;
    noConn: boolean;
    selectedRow: number = 0;
    isKeyboard: boolean = false;
    private interval: any;

    constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private dataService: DataService,
        private langService: LangService,
        private navService: NavService, private settingsService: SettingsService, private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.settingsService.masterPwd = this.storage.get('Password') !== null ? this.storage.get('Password') : '';
        this.IP = this.settingsService.IP;
        this.Port = this.settingsService.port;
        this.Password = this.settingsService.masterPwd;
        // this.webSocketService.disconnectSocket();
        // this.dataService.onGetSettigsFailure.subscribe( data => {
        //     alert(this.langService.translate(data));
        // });

        // console.log('IP', this.settingsService.IP);
        // console.log('Port', this.settingsService.port);
        // console.log('Password', this.settingsService.masterPwd);
    }

    tryConnect() {
        try {
            this.noConn = false;
            this.settingsService.IP = this.IP;
            this.settingsService.port = this.Port;
            this.settingsService.masterPwd = this.Password;

            this.storage.set('IP', this.settingsService.IP);
            this.storage.set('Port', this.settingsService.port);
            this.storage.set('Password', this.settingsService.masterPwd);
            // this.dataService.connectToWS();
            // this.interval = setInterval(() => {
            //     if (!this.webSocketService.isConnecting()) {
            //         clearInterval(this.interval);
            //         if (this.webSocketService.isOpen()) {
            //             this.storage.set('IP', this.settingsService.IP);
            //             this.storage.set('Port', this.settingsService.port);
            //             this.storage.set('Password', this.settingsService.masterPwd);
            //         } else {
            //             this.navService.goErrorPage();
            //             this.noConn = true;
            //         }
            //     }
            // }, 1000);
            this.navService.goTo('/');
        } catch (e) {
            console.log(e);
        }
    }

    onInputClick(event, selectedIx: number) {
        this.selectedRow = selectedIx;
        this.isKeyboard = true;
    }

}
