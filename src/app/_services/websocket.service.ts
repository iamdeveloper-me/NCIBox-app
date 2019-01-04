import { Injectable, EventEmitter } from '@angular/core';

import { SettingsService } from './settings.service';
import { NavService } from './nav.service';

@Injectable()
export class WebSocketService {

    public constructor(private settingsService: SettingsService, private navService: NavService) { }
    private socket: WebSocket;
    public isSocketOpen: boolean;
    public onMessageReceive = new EventEmitter<string>();
    public onSocketOpen = new EventEmitter<string>();

    public isOpen(): boolean {
        return this.socket &&  (this.socket.readyState === WebSocket.OPEN);
    }

    public isConnecting(): boolean {
        return ((this.socket) && (this.socket.readyState === WebSocket.CONNECTING));
    }

    public isClosed(): boolean {
        return ((this.socket) && (this.socket.readyState === WebSocket.CLOSED));
    }

    public getSocket(): WebSocket {
        return this.socket;
    }

    public sendMessage(data: Object): void {
        if (this.socket && this.isSocketOpen ) {
            this.socket.send(JSON.stringify(data));
        }
    }

    // public disconnectSocket(): void {
    //     this.socket.close();
    // }

    public createWebsocket(): void {
        try {
            this.socket = new WebSocket(`ws://${this.settingsService.IP}:${this.settingsService.port}`);
            this.socket.onerror = (error) => {
                this.isSocketOpen = false;
                this.settingsService.settings['gotSettings'] = false;
                console.log('Socket Error');
            };

            this.socket.onopen = (data) => {
                this.isSocketOpen = true;
                console.log('Socket Open');
                this.onSocketOpen.emit('Socket Open');
            };

            this.socket.onclose = (data) => {
                console.log('Socket Closed');
                this.settingsService.settings['gotSettings'] = false;
                this.isSocketOpen = false;
                this.navService.goTo('/errorpage');
            };

            this.socket.onmessage = (data) => {
                this.onMessageReceive.emit(data.data);
            };


            // let observable = Observable.create(
            //     (observer: Observer<MessageEvent>) => {
            //         this.socket.onmessage = observer.next.bind(observer);
                    
            //         // this.socket.onerror   = observer.error.bind(observer);
            //         // this.socket.onclose   = observer.complete.bind(observer);
            //         return this.socket.close.bind(this.socket);
            //     }
            // );
            // let observer = {
            //     next: (data: Object) => {
            //         if (this.socket && this.socket.readyState === WebSocket.OPEN && this.isSocketOpen) {
            //             this.socket.send(JSON.stringify(data));
            //         }
            //     }
            // };
            // return Subject.create(observer, observable);
        } catch (err) {
            console.log(err);
        }
    }
}

