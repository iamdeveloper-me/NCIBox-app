import { Component, OnInit } from '@angular/core';

import { NavService } from '../_services/nav.service';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.css'],
})
export class PageFooterComponent implements OnInit {
    navDisabled: boolean = false;
  constructor(private navService: NavService) { }

  ngOnInit() {
      this.navDisabled = (this.navService.currRoute == '/closeup');
  }

  onCancelClick() {
      this.navService.cancel();
  }

}
