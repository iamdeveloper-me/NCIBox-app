import { InjectionToken } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_DE_NAME, LANG_DE_TRANS } from './lang-de';
import { LANG_IT_NAME, LANG_IT_TRANS } from './lang-it';
import { LANG_ES_NAME, LANG_ES_TRANS } from './lang-es';
import { LANG_FR_NAME, LANG_FR_TRANS } from './lang-fr';
import { LANG_RU_NAME, LANG_RU_TRANS } from './lang-ru';

// translation token
export const translations = new InjectionToken('translations');

// all translations
const dictionary = {
    'EN': LANG_EN_TRANS,
    'DE': LANG_DE_TRANS,
    'IT': LANG_IT_TRANS,
    'ES': LANG_ES_TRANS,
    'FR': LANG_FR_TRANS,
    'RU': LANG_RU_TRANS
};

// providers
export const translationProviders = [
    { provide: translations, useValue: dictionary },
];
