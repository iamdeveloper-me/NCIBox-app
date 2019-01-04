import { Component,Input,OnInit } from '@angular/core';
import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { SettingsService } from '../_services/settings.service';

@Component({
    selector: 'app-termsandconditions',
    templateUrl: './termsandcondition.component.html',
    styleUrls: ['./termsandcondition.component.css']
})

export class TermsAndConditionComponent implements OnInit {
    headerTitle: string;

    ngOnInit() {
        this.dataService.getTermsAndConditioins();
        this.dataService.onTermsAndConditions.subscribe( data => {
        });
    }

    @Input() title: string;
    date: string;

    constructor(private navService: NavService, private langService: LangService, public stateService: StateService, private dataService: DataService, private settingsService: SettingsService) {
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

    onAcceptClick() {
        history.go(-1);
    }
}
