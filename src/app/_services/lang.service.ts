import { Injectable, Inject } from '@angular/core';
// import { translations } from '../_shared/translation';
import { SettingsService } from '../_services/settings.service';

@Injectable()
export class LangService {
    currLang = 'DE';
    _translations = {};
    // constructor( @Inject(translations) private _translations: any) { }

    constructor( private settingsService: SettingsService) { }

    setLang(lang: string) {
        if (this.currLang === lang) { return; }
        this.currLang = lang;
    }

    translate(key: string): string {

        // private perform translation
        // if (this._translations[this.currLang] && this._translations[this.currLang][key]) {
        //     return this._translations[this.currLang][key];
        // }
        if (this.settingsService && this.settingsService.translations[key]) {
            return this.settingsService.translations[key];
        }

        return key;
    }
}
