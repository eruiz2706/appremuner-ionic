import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';

/**
 * Generated class for the UsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {
  usr: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth:AuthServiceService) {
                this.usr = this.auth.getUser();
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {

  }
}
