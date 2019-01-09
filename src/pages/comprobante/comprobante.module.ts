import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComprobantePage } from './comprobante';

@NgModule({
  declarations: [
    ComprobantePage,
  ],
  imports: [
    IonicPageModule.forChild(ComprobantePage),
  ],
})
export class ComprobantePageModule {}
