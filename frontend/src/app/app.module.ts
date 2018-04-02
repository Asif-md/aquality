import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {GeneralModule} from "./general/general.module";
import {AppRoutingModule} from './app-routing.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
// services
import {AuthService} from './auth.service';
import {CustomHttpService} from "./custom-http.service";
import {AutoCompleteModule, PickListModule, ConfirmDialogModule, SharedModule} from 'primeng/primeng';
import {UploadService} from './upload.service';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //routing module
    AppRoutingModule,
    //user defines modules
    GeneralModule,
    NgxQRCodeModule,
    QRCodeModule,
    AutoCompleteModule, PickListModule, ConfirmDialogModule, SharedModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    CustomHttpService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
