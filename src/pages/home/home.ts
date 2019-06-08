import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';
import { UsuarioPage } from '../usuario/usuario';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  public usr:any;
  public detusr: boolean = false;
  loading: any;

  constructor(public navParams: NavParams,
              public navctl:NavController,
              public auth:AuthServiceService,
              public toastController: ToastController,
              public alert:AlertController,
              public loadingCtrl: LoadingController,
              public menu:MenuController) {
      /*if(this.auth.valitaSesion()){
        this.usr = this.auth.getUser();
        this.validarToken();
      }*/
  }

  ionViewDidLoad() {
    /*if(this.auth.valitaSesion()){
      this.usr = this.auth.getUser();
      //console.log(this.usr);
      this.detusr = true;
    }
    else{
      this.detusr = false;
    }*/
  }
  
  ionViewWillEnter() {
    if(this.auth.valitaSesion()){
      this.usr = this.auth.getUser();
      this.detusr = true;
      this.validarToken(this.usr.token_app);
    }
    else{
      this.detusr = false;
    }
  }

  public  userDetail(){
    this.menu.close();
    if(!this.detusr){
      //this.navctl.push('AutenticacionPage');
      this.navctl.push('TabsPage');
    }
    else{
      this.navctl.push('UsuarioPage');
    }
  }

  public  comprobante(){
    this.menu.close();
    if(this.validateuser()){
      this.navctl.push('ComprobantePage');
    }
  }

  public  certificado(){
    this.menu.close();
    if(this.validateuser()){
      this.navctl.push('CertificadoPage');
    }
  }

  public  solicitud(){
    this.menu.close();
    if(this.validateuser()){
      this.navctl.push('SolicitudPage');
    }
  }

  public  educacion(){
    this.menu.close();
    if(this.validateuser()){
      this.navctl.push('EducacionPage');
    }
  }

  public borrarSesion(){
    this.menu.close();
    localStorage.setItem("user", null);
    this.detusr = false;
    this.presentAlert("Gracias por utilizar nuestros servicios, sesion finalizada.");
  }

  public borrarExpired(){
    this.menu.close();
    localStorage.setItem("user", null);
    this.detusr = false;
    this.presentAlert("Hemos expirado tu sesión, por favor autentícate de nuevo para seguir utilizando Remuner App.");
  }

  validateuser(){
    if(!this.auth.valitaSesion()){
      this.presentToast("Inicie una sesión para continuar..");
      return false;
    }
    return true;
  }

  async presentToast(mensaje) {
    let toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  async presentAlert(mensaje) {
    const alert = await this.alert.create({
      title: 'Remuner',
      subTitle: 'Mensaje de solicitud',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarToken(token){
    if(this.usr.token_app != undefined){
      this.presentLoading("Verificando sesion.");
        this.auth.validaToken(token)
        .then((response) =>{
          this.loading.dismiss();
        })
        .catch((error) =>{
          if(error.status == 401){
            this.borrarExpired();
          }
          else{
            //this.presentAlert("Por favor verifique su conexion, para seguir utilizando Remuner App.");
            this.presentAlert("Se presento un inconveniente al verificar la sesion.");
          }
          this.loading.dismiss();
        });
    }
  }

  async presentLoading(mensaje:string) {
    this.loading = await this.loadingCtrl.create({
      content: mensaje,
    });
    await this.loading.present();
  }


}
