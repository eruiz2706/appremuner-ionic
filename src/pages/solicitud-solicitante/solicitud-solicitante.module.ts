import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitudSolicitantePage } from './solicitud-solicitante';

@NgModule({
  declarations: [
    SolicitudSolicitantePage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitudSolicitantePage),
  ],
})
export class SolicitudSolicitantePageModule {}
