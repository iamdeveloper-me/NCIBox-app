import { Component, OnInit } from '@angular/core';
import { Room } from '../_shared/models';
import { NavService } from '../_services/nav.service';
import { SettingsService } from '../_services/settings.service';
import { DataService } from '../_services/data.service';
import { StateService } from '../_services/state.service';
import { LangService } from '../_services/lang.service';

@Component({
  selector: 'app-room-choice',
  templateUrl: './room-choice.component.html',
  styleUrls: ['./room-choice.component.css']
})

export class RoomChoiceComponent implements OnInit {
    headerTitle: string;
    rooms: Room[];
    selectedRoom: string;
    isError: boolean = false;
    buttonCaption: string = "";
    isNoRoom: boolean = false;
    prevDisabled: boolean = false;
    nextDisabled: boolean = false;
    showing: string = "";
    pageCount: number = 0;
    pageIx: number = 0;
    date: string;

    constructor(private navService: NavService, private langService: LangService, private dataService: DataService, private stateService: StateService,private settingsService: SettingsService) {
        setInterval(() => {
            var dateNow = new Date();
            var h = dateNow.getHours();
            var m = dateNow.getMinutes();
            var s = dateNow.getSeconds();
            var hs = h.toString();
            var ms = m.toString();
            var ss = s.toString();

            if (h < 10) hs = "0" + hs;
            if (m < 10) ms = "0" + ms;
            if (s < 10) ss = "0" + ss;

            this.date = hs + ':' + ms + ':' + ss;
        }, 100);
    }

    ngOnInit() {
        // this.headerTitle = this.langService.translate('Choose room');
        this.dataService.getAvailableRoomByCategories();
        this.dataService.onAvailableRoomsByCategory.subscribe( flag => {
            this.isNoRoom = this.stateService.availableRooms.length === 0;
            if (!this.isNoRoom) {
                this.buttonCaption = this.langService.translate('buttonChooseRoomOK');
            } else {
                this.buttonCaption = this.langService.translate('GoBacktoRoomCategories');
            }

            this.pageIx = 0;
            this.pageCount = Math.ceil(this.stateService.availableRooms.length / 3);
            this.makePage();
        });

        const time = (parseFloat(this.settingsService.settings.BookingRoomTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);
    }

    makePage() {
        this.rooms        = this.stateService.availableRooms.slice(this.pageIx * 3, this.pageIx * 3 + 3);
        this.showing      = this.langService.translate('page') + " " + (this.pageIx + 1).toString() + " " + this.langService.translate('of') + " " + this.pageCount.toString();
        this.prevDisabled = (this.pageIx === 0);
        this.nextDisabled = (this.pageIx === (this.pageCount - 1));
    }

    onNextPage() {
        this.pageIx++;
        this.makePage();
    }

    onPrevPage() {
        this.pageIx--;
        this.makePage();
    }

    selectRoom(room: Room) {
        this.selectedRoom = room.name;
        this.stateService.selectedRoom = room.name;
        this.stateService.paymentData.isFixAmount = false;
        this.stateService.paymentData.fixAmount = room.price;
    }

    onNextClick() {
        if (this.isNoRoom) {
            this.navService.goTo('/categorychoice');
        } else if (this.selectedRoom) {
            this.stateService.selectedRoom = this.selectedRoom;
            this.navService.goTo('/guests');
        } else {
            this.isError = true;
        }
    }

    onBackClick() {
        this.navService.goTo('/categorychoice');
    }

}

