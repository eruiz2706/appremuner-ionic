import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';

@IonicPage()
@Component({
  selector: 'page-autenticacion',
  templateUrl: 'autenticacion.html',
})
export class AutenticacionPage {

  public fecha:any;// = new Date().toISOString();
  public usr:any;
  public tmp:any;
  public documento:any    = "";
  public email:any        = "";
  public empresa:any      = "";
  public empresas:any      = "";
  public preg:boolean     = false;
  public resp:any;
  public loading:any;
  public contador = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth:AuthServiceService,
              public navctl:NavController,
              public toastController: ToastController,
              public alert:AlertController,
              public loadingCtrl: LoadingController) {
                this.usr = this.auth.getUser();
                ////console.log(this.usr);
                this.cargarEmpresas();
  }

  ionViewDidLoad() {
   // //console.log('ionViewDidLoad AutenticacionPage');
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
     let datof = ar[2]+"/"+ar[1]+"/"+ar[0];
     this.presentLoading("Varificando informacion.");
      this.auth.autenticar(this.documento,this.email,datof)
      .then((response) =>
        {
          this.loading.dismiss();
          ////console.log(response['resp'].estado);
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
          this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
        });
  }

  verificar(){
    this.contador++;
    let validation = false;
    if(this.tmp.preg.length > 0){
      validation = true;
    }
    for(var i = 0 ; i < this.tmp.preg.length ; i++){
      //console.log(this.tmp.preg[i]);
      if(this.tmp.preg[i].VALOR != this.tmp.preg[i].resp){
        validation = false;
      }
    }
    if(validation){
      this.crearUsuario();
    }
    else{
      this.presentAlert("Verificacion de usuario fallida, las respuestas no son correctas. "+
      "Numero de intentos "+this.contador+" de 3");
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
        enableBackdropDismiss: false,
        buttons: [ {
          text: 'Aceptar',
          handler: () => {
            if(this.contador >= 3){
              this.cambioTab();
            }
          }
        }]
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
      this.cambioTab();
    }

    crearUsuario(){
      this.presentLoading("Confirmando Respuestas.");
      this.auth.activarUsr(this.email,this.documento,this.empresa)
      .then((response) =>
        {
          this.loading.dismiss();
          if(response['resp']['0'].VALOR == "Exito"){
            this.showConfirm("Procedimiento con éxito, generamos un correo con la información de ingreso.");
          }
          else{
            let detal = "";
            if(response['resp']['0'].VALOR != undefined || response['resp']['0'].VALOR != null ){
              detal = response['resp']['0'].DETALLE;
              this.showConfirm("No fue posible realizar la activacion del usuario, motivo: '"+detal+"'.");
            }
            else{
              this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
            }
          }
        })
        .catch((error) =>
        {
          this.loading.dismiss();
          this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
        });

    }

    showConfirm(mensaje) {
      const confirm = this.alert.create({
        title: 'Remuner',
        message: mensaje,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.cambioTab();
            }
          }
        ]
      });
      confirm.present();
    }

    cambioTab(){
      this.documento  = "";
      this.email      = "";
      this.empresa    = "";
      this.preg       = false;
      this.contador   = 0;
      this.navctl.parent.select(0);
    }

   cargarEmpresas(){
      this.presentLoading("Cargando...");
      this.auth.getEmpresas(
      ).then((response) =>
      {
        this.empresas   = [];
        this.loading.dismiss();
        if(response['resp'] == null){
          this.presentAlert("No se encontraron empresas.");
        }
        else{
          this.empresas = response['resp'];
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar  solicitud.");
      });
  }
}






