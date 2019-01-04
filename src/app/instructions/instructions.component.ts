import { Component, OnInit } from '@angular/core';

import { NavService } from '../_services/nav.service';
import { LangService } from '../_services/lang.service';
import { StateService } from '../_services/state.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {
    headerTitle: string;
    constructor(private navService: NavService, public stateService: StateService, private langService: LangService) { }


    ngOnInit() {
        this.headerTitle = this.langService.translate('Instructions');
    }

    onNextClick() {
        this.navService.goFwd();
    }

}
