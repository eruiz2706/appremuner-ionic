import { MainFunctions } from './../util/MainFunctions';
import { Component } from '@angular/core';
import { App,IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  empresa:any;
  correo:any = "";
  pass:any;
  loading:any;

  empresas:any;


  constructor(
    public navCtrl: NavController, public navParams: NavParams,public auth:AuthServiceService,
    public alert: AlertController,public mainf: MainFunctions,public loadingCtrl: LoadingController,
    public app: App) {
       this.cargarEmpresas();
  }

  ionViewDidLoad() {

  }

  validarSesion(){
    if(this.empresa == undefined || this.empresa == ''){
      this.mainf._presentToast("Debe seleccionar una empresa.");
      return;
    }
    else
    if(this.correo == undefined || this.correo == ''){
      this.mainf._presentToast("El correo es requerido");
      return;
    }
    else
    if(this.pass == undefined || this.pass == ''){
      this.mainf._presentToast("La clave es requerida");
      return;
    }
    this.presentLoading("Validando ingreso...");
    this.auth.login(this.correo,this.empresa,this.pass)
    .then((response) =>
      {
        this.loading.dismiss();
        if(response['resp']['0'].VALOR == "Exito"){
          this.mostrarDialogToken();
        }
        else{
          let detal = "";
          response['resp'].map(
            r => {
              detal += " "+r.DETALLE;
            }
          );
          this.presentAlert("No fue posible realizar la validacion, motivo: '"+detal+"'.");
        }
      }).catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  mostrarDialogToken() {
    const prompt = this.alert.create({
      title: 'Codigo de seguiridad',
      enableBackdropDismiss: false,
      message: "Emitimos un código de seguridad al correo electrónico registrado, por favor escríbelo para continuar.",
      inputs: [
        {
          name: 'token',
          placeholder: 'Codigo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {

          }
        },
        {
          text: 'Continuar',
          handler: data => {
            this.validarToken(data.token);
          }
        }
      ]
    });
    prompt.present();
  }

  validarToken(_token){

    this.presentLoading("Validando ingreso...");
    this.auth.valtoken(this.correo,_token,this.empresa)
    .then((response) =>
      {
        this.loading.dismiss();
        console.log(response['resp']['0'].DETALLE);
        if(response['resp']['0'].VALOR != undefined ){
          if(response['resp']['0'].VALOR == "Exito"){
            this.mainf._presentToast("Verificacion exitosa.");
            localStorage.setItem("user", JSON.stringify(response['resp']['wss']));
            //this.navCtrl.setRoot('HomePage');
            this.app.getRootNav().setRoot('HomePage');
          }
          else{
            let detal = "";
            response['resp'].map(
                  r => {
                    detal += " "+r.DETALLE;
                  }
            );
            detal = response['resp']['0'].DETALLE;
            this.presentAlert("No fue posible realizar la validacion, motivo: '"+detal+"'.");
          }
        }
        else{
          this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  openRecuperar(){
    if(this.empresa == undefined || this.empresa == ''){
      this.mainf._presentToast("Debe seleccionar una empresa.");
      return;
    }
    else
    if(this.correo == undefined || this.correo == ''){
      this.mainf._presentToast("El correo es requerido");
      return;
    }
    this.presentLoading("Validando ingreso...");
    this.auth.recuerar(this.correo,this.empresa)
    .then((response) =>
      {
        this.loading.dismiss();
        if(response['resp']['0'].VALOR == "Exito"){
          this.presentAlert("Procedimiento con éxito, generamos un correo con la información de recuperación.");
        }
        else{
          let detal = "";
          if(response['resp']['0'].VALOR != undefined || response['resp']['0'].VALOR != null ){
            detal = response['resp']['0'].DETALLE;
            this.presentAlert("No fue posible realizar el procedimiento, motivo: '"+detal+"'.");
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

    async presentLoading(mensaje:string) {
      this.loading = await this.loadingCtrl.create({
        content: mensaje,
      });
      await this.loading.present();
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
