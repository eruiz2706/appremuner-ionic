import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, ModalController,Item, ItemSliding } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';
import { UtilDate } from '../util/util.datetime';

@IonicPage()
@Component({
  selector: 'page-comprobante',
  templateUrl: 'comprobante.html',
})
export class ComprobantePage {
  usr: any;
  public year:any;
  public meses:any;
  public periodo:any = new Date().toISOString();
  public loading:any;
  comps: Array<Object> = [];
  retns: Array<Object> = [];
  public det:any = [];
  public subperi:any;
  public totalp:number = 0;
  activeItemSliding: ItemSliding = null;

  constructor(public navCtrl: NavController,public navParams: NavParams,
              public auth:AuthServiceService,public utild:UtilDate,public toastController: ToastController,
              public alert:AlertController,public loadingCtrl: LoadingController,public modalController: ModalController
            ) {
      this.meses  = this.utild.getNameMonth();
      this.year   = this.utild.getMaxYear();
      this.usr    = this.auth.getUser();
      this.resumenPago();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComprobantePage');
  }

  resumenPago(){
    let mes   = "-1";
    let anio  = "-1";
    if(this.periodo == "" || this.periodo == undefined){
      this.presentToast("El periodo de pago es requerido.");
      return;
    }
    if(this.periodo.hasOwnProperty("month")){
      mes  = this.periodo.month.value+"";
      anio = this.periodo.year.value+"";
    }
    else{
      let ar  =  this.periodo.split("-");
      mes     = ar[1];
      anio    = ar[0];
    }
    this.presentLoading("Consultando comprobantes.");
      this.auth.getComprobantes(this.usr.user.documento,this.usr.token_app,anio,"0"+mes)
      .then((response) =>{
        this.comps  = [];
        this.retns  = [];
        this.loading.dismiss();
        if(response['resp']['comp'] == null && response['resp']['retn'] == null){
          this.presentAlert("Sin registros para el periodo seleccionado.");
        }
        else{
          let keys = Object.keys(response['resp']['comp']);
          keys.map(
            k =>{
              this.comps.push(response['resp']['comp'][k]);
            }
          );
          this.retns = response['resp']['retn'];
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        //console.error('API Error : ', error.status);
        if(error){

        }
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  email_comp(id){
    let mes = "-1";
    let anio = "-1";
    if(this.periodo == "" || this.periodo == undefined){
      this.presentToast("El periodo de pago es requerido.");
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
    this.presentLoading("Solicitando correo de comprobantes.");
      this.auth.getComprob_email(this.usr.user.documento,
        this.usr.token_app,anio,mes,id,this.usr.user.nombre,this.usr.user.correo
      ).then((response) =>{
          this.loading.dismiss();
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
      .catch((error) =>{
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  retenciones(){
    console.log(this.periodo);
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

  async presentModal(selectedValue: any) {
    const modal = await this.modalController.create({
      component: 'ModalcomprobantePage',
      componentProps: { detalle: this.comps[selectedValue] }
    });
    return await modal.present();
  }

  descargaPdf(id) {
    let mes = "-1";
    let anio = "-1";
    if(this.periodo == "" || this.periodo == undefined){
      this.presentToast("El periodo de pago es requerido.");
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
    //this.usr.user.documento,this.usr.token_app,anio,"0"+mes,id
    let parametro = "/remuner/public/comprobantepdf/?" +
      "documento=" +this.usr.user.documento +"&year=" +anio +"&month=" +mes +"&token_app=" +this.usr.token_app +
      "&version=" +"0.0.1" +"&descargar=" +"SI" +"&periodo=" +id+"&correo="+this.usr.user.correo+"&nombre="+this.usr.user.nombre;
    let name    = this.auth.toNameFile("Comprobante_"+id+"_"+anio+"_"+mes);
    this.auth.downPdf(parametro,name);
  }

  openOption(itemSlide: ItemSliding, item: Item) {

    if(this.activeItemSliding!==null) //use this if only one active sliding item allowed
     this.closeOption();

    this.activeItemSliding = itemSlide;

    let swipeAmount = 194; //set your required swipe amount
    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);

    itemSlide.setElementClass('active-options-right', true);
    itemSlide.setElementClass('active-swipe-right', true);

    item.setElementStyle('transition', null);
    item.setElementStyle('transform', 'translate3d(-'+swipeAmount+'px, 0px, 0px)');
   }

   closeOption() {
    console.log('closing item slide..');

    if(this.activeItemSliding) {
     this.activeItemSliding.close();
     this.activeItemSliding = null;
    }
   }

   back_action(){
    this.navCtrl.setRoot('HomePage');
  }

  descargaPdfrtn(id){
    let mes   = "-1";
    let anio  = "-1";
    if(this.periodo == "" || this.periodo == undefined){
      this.presentToast("El periodo de pago es requerido.");
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
    //this.auth.desRetenciones(this.usr.user.documento,this.usr.token_app,anio,"0"+mes,id);
    let parametro = "/remuner/public/retencionpdf/?" +
      "documento=" +this.usr.user.documento +"&year=" +anio +"&month=" +mes +"&token_app=" +this.usr.token_app +
      "&version=" +"0.0.1" +"&descargar=" +"SI" +"&periodo=" +id+"&correo="+this.usr.user.correo+"&nombre="+this.usr.user.nombre;
    let name    = this.auth.toNameFile("RETEN_"+id+"_"+anio+"_"+mes);
    this.auth.downPdf(parametro,name);
  }

  retencion_comp(id){
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
    this.presentLoading("Solicitando correo de comprobante de retencion en la fuente.");
      this.auth.getRetencion_email(
        this.usr.user.documento,
        this.usr.token_app,
        anio,
        mes,
        id,
        this.usr.user.nombre,
        this.usr.user.correo
      ).then((response) =>
      {
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
        //console.error('API Error : ', error.status);
        //console.error('API Error : ', error);
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

}
