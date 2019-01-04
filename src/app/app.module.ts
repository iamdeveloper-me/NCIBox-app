import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { NgDatepickerModule } from 'ng2-datepicker';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import { StorageServiceModule } from 'angular-webstorage-service';
import { SignaturePadModule } from 'angular2-signaturepad';

import { DataService } from './_services/data.service';
import { LangService } from './_services/lang.service';
import { NavService } from './_services/nav.service';
import { SettingsService } from './_services/settings.service';
import { StateService } from './_services/state.service';
import { CountryService } from './_services/country.service';
import { WebSocketService } from './_services/websocket.service';

import { TranslatePipe } from './_shared/translate.pipe';
import { PhonePipe } from './_shared/phone.pipe';
import { SafeHtml } from './_shared/safeHtml.pipe';
import { translationProviders } from './_shared/translation';

import { AppComponent } from './app.component';
import { ScreenSaverComponent } from './screen-saver/screen-saver.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { DatesComponent } from './dates/dates.component';
import { PersonsComponent } from './persons/persons.component';
import { RoomChoiceComponent } from './room-choice/room-choice.component';
import { CategoryChoiceComponent } from './category-choice/category-choice.component';
import { PaymentComponent } from './payment/payment.component';
import { GuestsComponent } from './guests/guests.component';
import { CloseUpComponent } from './close-up/close-up.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { ConnectionParamsComponent } from './connection-params/connection-params.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { CompanyComponent } from './company/company.component';
import { SignatureComponent } from './signature/signature.component';
import { SignatureFieldComponent } from './signature/signature-field/signature-field.component';
import { ScanningComponent } from './scanning/scanning.component';
import { ReservationComponent } from './reservation/reservation.component';
import { PinRecoveryComponent } from './pin-recovery/pin-recovery.component';
import { TermsAndConditionComponent } from './termsandcondition/termsandcondition.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { MyDatePickerModule } from 'mydatepicker';


const appRoutes: Routes = [
    { path: '', component: ScreenSaverComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'screensaver', component: ScreenSaverComponent },
    { path: 'instructions', component: InstructionsComponent },
    { path: 'dates', component: DatesComponent },
    { path: 'persons', component: PersonsComponent },
    { path: 'categorychoice', component: CategoryChoiceComponent },
    { path: 'roomchoice', component: RoomChoiceComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'guests', component: GuestsComponent },
    { path: 'signature', component: SignatureComponent },
    { path: 'scanning', component: ScanningComponent },
    { path: 'closeup', component: CloseUpComponent },
    { path: 'conn', component: ConnectionParamsComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'reservation', component: ReservationComponent },
    { path: 'pinrecovery', component: PinRecoveryComponent },
    { path: 'termsandconditions', component: TermsAndConditionComponent },
    { path: 'errorpage', component: ErrorPageComponent }
];

// electron build and packing
// npm run electron- build
// electron - packager. --platform= win32--overwrite

@NgModule({
    declarations: [
        AppComponent,
        ScreenSaverComponent,
        WelcomeComponent,
        InstructionsComponent,
        DatesComponent,
        PersonsComponent,
        RoomChoiceComponent,
        CategoryChoiceComponent,
        PaymentComponent,
        GuestsComponent,
        SignatureComponent,
        SignatureFieldComponent,
        ScanningComponent,
        CloseUpComponent,
        PageHeaderComponent,
        PageFooterComponent,
        TranslatePipe,
        PhonePipe,
        SafeHtml,
        ConnectionParamsComponent,
        KeyboardComponent,
        CompanyComponent,
        ReservationComponent,
        PinRecoveryComponent,
        TermsAndConditionComponent,
        ErrorPageComponent
    ],
    imports: [
        BrowserModule,
        JWBootstrapSwitchModule,
        BrowserAnimationsModule,
        StorageServiceModule,
        FormsModule,
        NgDatepickerModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),
        Ng4LoadingSpinnerModule.forRoot(),
        SignaturePadModule,
        MyDatePickerModule
    ],
    providers: [DataService, LangService, NavService, SettingsService, StateService, translationProviders, WebSocketService, CountryService],
    bootstrap: [AppComponent]
})
export class AppModule { }
