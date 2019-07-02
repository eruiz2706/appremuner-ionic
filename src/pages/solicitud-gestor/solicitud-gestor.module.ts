import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitudGestorPage } from './solicitud-gestor';

@NgModule({
  declarations: [
    SolicitudGestorPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitudGestorPage),
  ],
})
export class SolicitudGestorPageModule {}
