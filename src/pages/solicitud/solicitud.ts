import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ItemSliding,Item } from 'ionic-angular';
import { SolicitudSolicitantePage } from './../solicitud-solicitante/solicitud-solicitante';
import { SolicitudGestorPage } from './../solicitud-gestor/solicitud-gestor';

@IonicPage()
@Component({
  selector: 'page-solicitud',
  templateUrl: 'solicitud.html',
})
export class SolicitudPage {
  tab1 = SolicitudSolicitantePage;
  tab2 = SolicitudGestorPage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudPage');
  }

  back_action() {
    this.navCtrl.setRoot('HomePage');
  }

}
