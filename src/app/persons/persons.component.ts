import { Component, OnInit } from '@angular/core';

import { NavService } from '../_services/nav.service';
import { StateService } from '../_services/state.service';
import { DataService } from '../_services/data.service';
import { LangService } from '../_services/lang.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})

export class PersonsComponent implements OnInit {
    headerTitle: string;
    adults: number;
    children: number;

    constructor(private navService: NavService, private langService: LangService, private stateService: StateService, private dataService: DataService) { }

    ngOnInit() {
        this.headerTitle = this.langService.translate('Persons')
        this.adults = this.stateService.adults;
        this.children = this.stateService.children;
    }

    onNextClick() {
        this.stateService.adults = this.adults;
        this.stateService.children = this.children;
        this.dataService.getAvailableCategories();
    }

    incAdults() {
        this.adults++;
    }

    decAdults() {
        if (this.adults > 1) {
            this.adults--;
        }
    }

    incChildren() {
        this.children++;
    }

    decChildren() {
        if (this.children > 0) {
            this.children--;
        }
    }

}
