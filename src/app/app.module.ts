import { MainFunctions } from './../pages/util/MainFunctions';
import { LoginPageModule } from './../pages/login/login.module';
import { TabsPageModule } from './../pages/tabs/tabs.module';
import { ModalcomprobantePageModule } from './../pages/modalcomprobante/modalcomprobante.module';
import { HomePageModule } from './../pages/home/home.module';
import { EducacionPageModule } from './../pages/educacion/educacion.module';

import { ComprobantePageModule } from './../pages/comprobante/comprobante.module';
import { CertificadoPageModule } from './../pages/certificado/certificado.module';
import { AutenticacionPageModule } from './../pages/autenticacion/autenticacion.module';
import { UsuarioPageModule } from './../pages/usuario/usuario.module';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { AuthServiceService } from '../pages/auth-service.service';
//import { UsuarioPage } from './../pages/usuario/usuario';

import { HttpModule } from "@angular/http";
import { UtilDate } from '../pages/util/util.datetime';

import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";
import { DocumentViewer } from "@ionic-native/document-viewer";
import { FileOpener } from '@ionic-native/file-opener';


@NgModule({
  declarations: [
    MyApp,
    //HomePage,
    //UsuarioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    UsuarioPageModule,
    AutenticacionPageModule,
    CertificadoPageModule,
    ComprobantePageModule,
    EducacionPageModule,
    HomePageModule,
    ModalcomprobantePageModule,
    TabsPageModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppBrowser,
    AuthServiceService,
    UtilDate,
    File,
    FileTransfer,
    DocumentViewer,
    FileOpener,
    MainFunctions,
  ]
})
export class AppModule {}
