import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';

/**
 * Generated class for the AutenticacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-autenticacion',
  templateUrl: 'autenticacion.html',
})
export class AutenticacionPage {

  public fecha:any;// = new Date().toISOString();
  public usr:any;
  public tmp:any;
  public documento:any = "";//31306051
  public email:any     = "";//mireya.arcila@vibeconsulting.com.co
  public preg:boolean  = false;
  public resp:any;
  public loading:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth:AuthServiceService,
              public navctl:NavController,
              public toastController: ToastController,
              public alert:AlertController,
              public loadingCtrl: LoadingController) {
                this.usr = this.auth.getUser();
                console.log(this.usr);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AutenticacionPage');
  }

  solicitarPreguntas(){
    if(this.documento == "" || this.documento == undefined){
      this.presentToast("El numero de documento es requerido.");
      return;
    }
    if(this.email == "" || this.email == undefined){
      this.presentToast("El correo electronico es requerido.");
      return;
    }

    if(this.fecha == "" || this.fecha == undefined){
      this.presentToast("La fecha de nacimiento es requerida.");
      return;
    }
    let ar =  this.fecha.split("-");
     let datof = ar[2]+"/"+ar[1]+"/"+ar[0];//"05/05/1984";//
     //console.log(this.documento+" "+this.email+" "+datof);
     this.presentLoading("Varificando informacion.");
      this.auth.autenticar(this.documento,this.email,datof)
      .then((response) =>
        {
          this.loading.dismiss();
          console.log(response['resp'].estado);
          if(response['resp'].estado == "NULL"){
            this.presentAlert("No existe coincidencia para los datos de usuario ingresados.");
          }
          else{
              this.tmp  = response['resp'].user;
              this.resp = response['resp'];
              this.preg = true;
          }

        })
        .catch((error) =>
        {
          this.loading.dismiss();
          //console.error('API Error : ', error.status);
          //console.error('API Error : ', error);
          this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
        });
  }

  verificar(){
    console.log(this.tmp.preg);
    let validation = false;
    if(this.tmp.preg.length > 0){
      validation = true;
    }
    for(var i = 0 ; i < this.tmp.preg.length ; i++){
      console.log(this.tmp.preg[i]);
      if(this.tmp.preg[i].VALOR != this.tmp.preg[i].resp){
        validation = false;
      }
    }
    if(validation){
      this.presentToast("Verificacion exitosa.");
      localStorage.setItem("user", JSON.stringify(this.resp));
      this.navctl.setRoot('HomePage');
    }
    else{
      this.presentAlert("Verificacion de usuario fallida, las respuestas no son correctas. ");
    }
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

    async presentLoading(mensaje:string) {
      this.loading = await this.loadingCtrl.create({
        content: mensaje,
      });
      await this.loading.present();
    }

    back_action(){
      this.navctl.setRoot('HomePage');
    }

}






