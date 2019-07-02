import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
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

  constructor(public navctl: NavController,
              public navParams: NavParams,
              public auth:AuthServiceService,
              public toastController: ToastController) {
                this.usr = this.auth.getUser();
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {

  }

  async presentToast(mensaje) {
    let toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  public  redirectCambioClave(){
    if(this.validateuser()){
      this.navctl.push('CambioclavePage');
    }
  }

  validateuser(){
    if(!this.auth.valitaSesion()){
      this.presentToast("Inicie una sesión para continuar..");
      return false;
    }
    return true;
  }

  back_action() {
    this.navctl.setRoot('HomePage');
  }

}
