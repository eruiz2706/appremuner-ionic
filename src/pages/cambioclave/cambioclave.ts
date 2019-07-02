import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';

/**
 * Generated class for the CambioclavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cambioclave',
  templateUrl: 'cambioclave.html',
})
export class CambioclavePage {
  public loading: any;
  claveActual:any;
  nuevaClave:any;
  confirmClave:any;
  usr: any;
  mensaje:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alert: AlertController,
    public auth: AuthServiceService,
    public loadingCtrl: LoadingController) {
    this.usr = this.auth.getUser();
    this.mensaje='';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CambioclavePage');
  }

  async presentAlert(mensaje) {
    const alert = await this.alert.create({
      title: '',
      subTitle: mensaje,
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }
  
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create({
      content: mensaje,
    });
    await this.loading.present();
  }

  back_action() {
    this.navCtrl.setRoot('UsuarioPage');
  }

  actualizar(){

    if(this.claveActual == undefined || this.claveActual == ''){
      this.presentAlert("Debe agregar la clave actual");
      return;
    }
    if(this.nuevaClave == undefined || this.nuevaClave == ''){
      this.presentAlert("Debe agregar la nueva clave");
      return;
    }
    if(this.nuevaClave.length<8){
      this.presentAlert("La clave debe tener al menos 8 caracteres ");
      return;
    }
    if(this.confirmClave == undefined || this.confirmClave == ''){
      this.presentAlert("Debe agregar la confirmacion de la clave");
      return;
    }
    if(!(this.nuevaClave == this.confirmClave)){
      this.presentAlert("La nueva clave y la confirmacion deben ser iguales");
      return;
    }

    
    this.presentLoading("Cargando...");
    this.auth.setActualizarClave(
      this.usr.token_app,
      this.usr.user.correo,
      this.usr.user.documento,
      this.claveActual,
      this.nuevaClave
    ).then((response) =>
    {
      this.loading.dismiss();
     // console.log(response);
      if(response['resp']['0'].CODE == 1){
        this.mensaje = "Procedimiento con éxito, clave actualizada.";
        this.presentAlert(this.mensaje);
      }
      else{
        var detal = "";
        if(response['resp']['0'].CODE != undefined || response['resp']['0'].CODE != null ){
          
          detal = response['resp']['0'].DETALLE;
          this.mensaje = "No fue posible realizar el procedimiento, motivo: '"+detal+"'.";
          this.presentAlert(this.mensaje);
        }
        else{
          this.mensaje = "Se presento un inconveniente al procesar solicitud.";
          this.presentAlert(this.mensaje);
        }
      }
    })
    .catch((error) =>
    {
      this.loading.dismiss();
      this.presentAlert("Se presento un inconveniente al intentar realizar el cambio de clave");
    });
  
  }

}
