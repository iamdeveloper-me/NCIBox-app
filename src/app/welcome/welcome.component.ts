import { Component } from '@angular/core';

import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { DataService } from '../_services/data.service';
import { SettingsService } from '../_services/settings.service';
import { StateService } from '../_services/state.service';

@Component({
    selector: 'app-welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent {

    isWantRoom:boolean = false;

    constructor(private navService: NavService,
        public settingsService: SettingsService,
        private langService: LangService,
        private dataService: DataService,
        private stateService: StateService) { }

    ngOnInit() {
        this.stateService.isReservationCode = false;
        this.stateService.reservationCode = '';
        this.langService.setLang(this.settingsService.settings.defLang.Abbreviation.toUpperCase());
        this.stateService.currentLanguage = this.settingsService.settings.defLang.LangId;
        this.isWantRoom = (this.settingsService.settings.searchByRoom !== '0' || this.settingsService.settings.searchByCategory !== '0');
    }

    onWantRoomClick() {
        if (this.dataService.isOpen()) {
            this.dataService.getTermsAndConditioins();
            this.navService.buildPath('new');
            this.navService.goTo('/instructions');
        } else {
            this.navService.goErrorPage();
        }
    }

    onHaveRoomClick() {
        if (this.dataService.isOpen()) {
            this.navService.buildPath('code');
            this.stateService.isReservationCode = true;
            this.navService.goTo('/reservation');
        } else {
            this.navService.goErrorPage();
        }
    }

    onPinRecovery() {
        this.navService.goTo('/pinrecovery');
    }

    changeLang(lang: string, langId: string) {
        this.langService.setLang(lang.toUpperCase());
        this.stateService.currentLanguage = langId;
        this.dataService.getTranslation();
    }

}
