import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutenticacionPage } from './autenticacion';

@NgModule({
  declarations: [
    AutenticacionPage,
  ],
  imports: [
    IonicPageModule.forChild(AutenticacionPage),
  ],
})
export class AutenticacionPageModule {}
