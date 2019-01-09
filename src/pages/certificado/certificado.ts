import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ItemSliding, Item } from 'ionic-angular';
import { UtilDate } from '../util/util.datetime';
import { AuthServiceService } from '../auth-service.service';

@IonicPage()
@Component({
  selector: 'page-certificado',
  templateUrl: 'certificado.html',
})
export class CertificadoPage {

  meses: string;
  year: any;
  usr: any;
  comps: any[];
  public loading: any;
  public periodo: any = new Date().toISOString();
  activeItemSliding: ItemSliding = null;

  constructor(public navCtrl: NavController,public navParams: NavParams,public auth: AuthServiceService,
    public utild: UtilDate,public toastController: ToastController,public alert: AlertController,
    public loadingCtrl: LoadingController) {

      this.meses = this.utild.getNameMonth();
      this.year = this.utild.getMaxYear();
      this.usr = this.auth.getUser();
      //console.log(this.usr);
      this.tipoCertificados();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CertificadoPage');
  }

  tipoCertificados(): any {
    let mes = "-1";
    let anio = "-1";
    if (this.periodo == "" || this.periodo == undefined) {
      this.presentToast("El periodo de pago es requerido.");
      return;
    }
    if (this.periodo.hasOwnProperty("month")) {
      mes = this.periodo.month.value + "";
      anio = this.periodo.year.value + "";
    }
    else {
      let ar = this.periodo.split("-");
      mes = ar[1];
      anio = ar[0];
    }
    this.presentLoading("Consultando certificados.");
    this.auth.getCertificado(this.usr.user.documento,this.usr.token_app,anio,mes)
    .then((response) => {
      this.comps = [];
      this.loading.dismiss();
      if (response['resp'] == "null") {
        this.presentAlert("Sin certificados disponibles.");
      }
      else {
        if (response['resp']['comp'] == null || response['resp']['comp'] == undefined) {
          this.presentAlert("Sin certificados disponibles.");
          return;
        }

        let keys = Object.keys(response['resp']['comp']);
        keys.map(
          k => {
            this.comps.push(response['resp']['comp'][k]);
          }
        );
      }
      console.log(this.comps);

    })
      .catch((error) => {
        this.loading.dismiss();
        //console.error('API Error : ', error.status);
        console.error('API Error : ', error);
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  back_action() {
    this.navCtrl.setRoot('HomePage');
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

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create({
      content: mensaje,
    });
    await this.loading.present();
  }

  descargaPdf(id) {
    let mes = "-1";
    let anio = "-1";
    if (this.periodo == "" || this.periodo == undefined) {
      this.presentToast("El periodo de pago es requerido.");
      return;
    }
    if (this.periodo.hasOwnProperty("month")) {
      mes = this.periodo.month.value + "";
      anio = this.periodo.year.value + "";
    }
    else {
      let ar = this.periodo.split("-");
      mes = ar[1];
      anio = ar[0];
    }
    //this.usr.user.documento,this.usr.token_app,anio,mes,id
    let parametro = "/remuner/public/certificadopdf/?" + "documento=" +this.usr.user.documento +
    "&year=" +anio +"&month=" +mes +"&token_app=" +this.usr.token_app +"&version=" +"0.0.1" +
    "&descargar=" +"SI" +"&reporte=" +id+"&correo="+this.usr.user.correo+"&nombre="+this.usr.user.nombre;
    let name    = this.auth.toNameFile("certificado_"+id+"_"+anio+"_"+mes);
    this.auth.downPdf(parametro,name);
  }

  certificado_email(id,nombre){
    let mes = "-1";
    let anio = "-1";
    if(this.periodo == "" || this.periodo == undefined){
      this.presentToast("El periodo es requerido.");
      return;
    }
    if(this.periodo.hasOwnProperty("month")){
      mes  = this.periodo.month.value+"";
      anio = this.periodo.year.value+"";
    }
    else{
      let ar =  this.periodo.split("-");
      mes  = ar[1];
      anio = ar[0];
    }
    this.presentLoading("Solicitando correo de certificado.");
      this.auth.getCertificado_email(this.usr.user.documento,this.usr.token_app,anio,mes,id,
        this.usr.user.nombre,this.usr.user.correo,nombre)
      .then((response) =>{
          this.loading.dismiss();
          console.log(response['resp']);
          if(response['resp'].hasOwnProperty('mensaje')){
            if(response['resp']['mensaje']== 'OK'){
              this.presentToast("Emitimos un mensaje a tu cuenta de correo registrada, si no logras ver el mensaje por favor verifica la opción de spam.");
            }
            else{
              this.presentToast("Procedimiento no confirmado");
            }
          }
          else{
            this.presentToast("No fue posible realizar tu solicitud.");
          }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  openOption(itemSlide: ItemSliding, item: Item) {

    if (this.activeItemSliding !== null) //use this if only one active sliding item allowed
      this.closeOption();

    this.activeItemSliding = itemSlide;

    let swipeAmount = 194; //set your required swipe amount
    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);

    itemSlide.setElementClass('active-options-right', true);
    itemSlide.setElementClass('active-swipe-right', true);

    item.setElementStyle('transition', null);
    item.setElementStyle('transform', 'translate3d(-' + swipeAmount + 'px, 0px, 0px)');
  }

  closeOption() {
    console.log('closing item slide..');

    if (this.activeItemSliding) {
      this.activeItemSliding.close();
      this.activeItemSliding = null;
    }
  }


}
