import { Component, OnInit } from '@angular/core';
import { Category } from '../_shared/models';
import { NavService } from '../_services/nav.service';
import { SettingsService } from '../_services/settings.service';
import { DataService } from '../_services/data.service';
import { StateService } from '../_services/state.service';
import { LangService } from '../_services/lang.service';

@Component({
  selector: 'app-category-choice',
  templateUrl: './category-choice.component.html',
  styleUrls: ['./category-choice.component.css']
})

export class CategoryChoiceComponent implements OnInit {
    headerTitle: string;
    categories: Category[];
    selectedCategory: string;
    isError: boolean = false;
    buttonCaption: string = "";
    isNoRoom: boolean = false;
    prevDisabled: boolean = false;
    nextDisabled: boolean = false;
    showing: string = "";
    pageCount: number = 0;
    pageIx: number = 0;
    date: string;
    customBookingError: string;

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
        // this.headerTitle = this.langService.translate('Choose Category');
        this.isNoRoom = (this.stateService.availableCategories.length === 0);
        if (!this.isNoRoom) {
            this.buttonCaption = this.langService.translate('buttonChooseRoomOK');
        } else {
            this.buttonCaption = this.langService.translate('buttonChooseRoomNoRoom');
        }

        this.pageIx = 0;
        this.pageCount = Math.ceil(this.stateService.availableCategories.length / 3);
        this.makePage();

        this.dataService.onBookingFailure.subscribe( data => {
            this.customBookingError = this.langService.translate(data);
        });

        const time = (parseFloat(this.settingsService.settings.BookingRoomTimeOut) * 1000);
        setTimeout(() => this.navService.goHome(), time);

    }

    makePage() {
        this.categories = this.stateService.availableCategories.slice(this.pageIx * 3, this.pageIx * 3 + 3);
        this.showing = this.langService.translate('page') + " " + (this.pageIx + 1).toString() + " " + this.langService.translate('of') + " " + this.pageCount.toString();
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

    selectCategory(value: string) {
        this.selectedCategory = value;
        this.stateService.selectedCat = value;
    }

    onNextClick() {
        if (this.isNoRoom) {
            this.navService.goTo('/dates');
        } else if (this.selectedCategory) {
            this.stateService.selectedCat = this.selectedCategory;
            this.dataService.getPrice();
        } else {
            this.isError = true;
        }
    }

    showRoomsClick(selectedCategory: string) {
        this.selectCategory(selectedCategory);
        this.stateService.selectedCat = selectedCategory;
        this.navService.goTo('/roomchoice');
    }

    onBackClick() {
        this.navService.goTo('/persons');
    }

}

