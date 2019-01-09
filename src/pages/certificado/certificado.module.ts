import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificadoPage } from './certificado';

@NgModule({
  declarations: [
    CertificadoPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificadoPage),
  ],
})
export class CertificadoPageModule {}
