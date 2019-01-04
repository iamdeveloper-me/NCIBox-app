import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StateService } from './state.service';
import { SettingsService } from './settings.service';

@Injectable()
export class NavService {
    constructor(private router: Router, private route: ActivatedRoute, private stateService: StateService,private settingsService: SettingsService ) { }

    private paths: string[] = ['/', '/instructions', '/dates', '/persons',
            // '/categorychoice',
            '/roomchoice', '/guests', '/payment', '/closeup'];
    private goToRoute: string[];
    public currRoute: string = '/';
    public previousRoute: string = '';

    // this.paths = ['/', '/instructions', '/dates', '/persons', 'categorychoice' ,'/guests','/singing','/scanning','/payment', '/closeup'];

    buildPath(type: string) {
        if (type == 'new') {
            this.paths = ['/', '/instructions', '/dates', '/persons', '/categorychoice' , '/guests', '/payment', '/closeup'];
        };

        if (type == 'code') {
            this.paths = ['/', '/reservation', '/guests', '/payment', '/closeup'];
        }

        if (type == 'isPaid') {
            this.paths = ['/', '/reservation', '/guests', '/closeup'];
        }
    }

    goFwd() {
        this.previousRoute = this.currRoute;
        this.goToRoute = this.getNextPage();

        if (this.router.navigate(this.goToRoute)) {
            this.currRoute = this.goToRoute[0];
            if (this.currRoute === '/') this.stateService.setDefault();
        }
    };

    goTo(path: string) {
        this.previousRoute = this.currRoute;
        this.router.navigate([path]);
        this.currRoute = path;
    }

    goBack() {
        if (this.currRoute === '/company') {
            this.stateService.paymentData.billToCompany = false;
            this.goTo('/payment');
        } else if (this.currRoute === '/signature') {
            this.goTo('/guests');
        } else if (this.currRoute === '/scanning') {
            if (this.settingsService.settings.signing !== '0') {
                this.goTo('/signature');
            } else {
                this.goTo('/guests');
            }
        } else if (this.currRoute === '/payment') {
            if (this.settingsService.settings.scanning !== '0') {
                this.goTo('/scanning');
            } else if (this.settingsService.settings.signing !== '0') {
                this.goTo('/signature');
            } else  {
                this.goTo('/guests');
            }
        } else {
            this.goToRoute = this.getPreviousPage();
            if (this.router.navigate(this.goToRoute)) {
                this.currRoute = this.goToRoute[0]
                if (this.currRoute === '/') this.stateService.setDefault();
            }
        }
    }

    goHome() {
        this.buildPath('new');
        this.goToRoute = ['/'];
        if (this.router.navigate(this.goToRoute)) {
            this.currRoute = this.goToRoute[0];
            this.stateService.setDefault();
        }
    }

    goConn() {
        this.goToRoute = ['/conn']
        if (this.router.navigate(this.goToRoute)) {
            this.currRoute = this.goToRoute[0];
        }
    }

    goErrorPage() {
        this.goToRoute = ['/errorpage'];
        if (this.router.navigate(this.goToRoute)) {
            this.currRoute = this.goToRoute[0];
        }
    }

    cancel() {
        if (this.currRoute === '/company') {
            this.stateService.paymentData.billToCompany = false;
            this.goTo('/payment');
        } else {
            this.goHome();
        }
    }

    private getPreviousPage() {
        var ix = this.paths.indexOf(this.currRoute);
        if (ix === -1) return [this.paths[0]];
        else if (ix > 0) return [this.paths[ix - 1]];
        else return [this.paths[0]];
    }

    private getNextPage() {
        if (this.currRoute === '/screensaver') return [this.paths[0]];

        var ix = this.paths.indexOf(this.currRoute);
        if (ix === -1) return [this.paths[0]]
        else if (ix != this.paths.length-1) return [this.paths[ix + 1]]
        else return [this.paths[0]];
    };
}
