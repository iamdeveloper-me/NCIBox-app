import { Component, OnInit, Input } from '@angular/core';

import { NavService } from '../_services/nav.service';


@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent implements OnInit {
    @Input() title: string;
    date: string;
    navDisabled: boolean = false;

    constructor(private navService: NavService) {
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
        this.navDisabled = (this.navService.currRoute == '/closeup');
    }


  onBackClick() {
      this.navService.goBack();
  }

}
