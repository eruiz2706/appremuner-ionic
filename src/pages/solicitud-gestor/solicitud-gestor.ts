import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ItemSliding,Item } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';
/**
 * Generated class for the SolicitudGestorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()  
@Component({
  selector: 'page-solicitud-gestor',
  templateUrl: 'solicitud-gestor.html',
})
export class SolicitudGestorPage {

  activeItemSliding: ItemSliding = null;
  public loading: any;
  usr: any;
  respHistorial:any[];
  selectEstados:any[];
  ngEstado:string='';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthServiceService,
    public toastController: ToastController,
    public alert: AlertController,
    public loadingCtrl: LoadingController) {
    this.usr = this.auth.getUser();
    this.cargaEstados();
    this.cargarTabla();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudGestorPage');
  }

  async presentLoading(mensaje: string) {
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

  cargaEstados(){
    this.auth.getVacacionesEstado(
      this.usr.token_app,
      this.usr.user.correo
    ).then((response) =>
    {
      //console.log('estados=>'+response['resp']);
      this.selectEstados = response['resp'];
    })
    .catch((error) =>
    {
    });
  }

  cargarTabla(){
    this.presentLoading("Cargando...");
    this.auth.getVacacionPendiente(
      this.usr.token_app,
      this.usr.user.correo
    ).then((response) =>
    {
      //console.log(response['resp']);
      this.respHistorial  = response['resp'];
      this.loading.dismiss();
    })
    .catch((error) =>
    {
      this.loading.dismiss();
      this.presentAlert("Se presento un inconveniente al intentar cargar los datos");
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

  guardar(vacationId,estadoId,indice){
    this.presentLoading("Cargando...");
    this.auth.setApruebaSolicitud(
      this.usr.token_app,
      this.usr.user.correo,
      vacationId,
      estadoId
    ).then((response) =>
    {
      //this.cargarTabla();
      this.presentAlert(response['resp'][0]['DETALLE']);
      this.respHistorial.splice(indice,1);
      this.loading.dismiss();
    })
    .catch((error) =>
    {
      this.loading.dismiss();
      this.presentAlert("Se presento un inconveniente al intentar realizar la accion");
    });
    console.log("estado=>"+estadoId);
    console.log("vacationId=>"+vacationId);
  }

  sumaDias(disfrutadoValor,compensadoValor){
    let disfrutado:number= 0;
    let compensado:number= 0;

    disfrutado = (disfrutadoValor==undefined || disfrutadoValor=='') ? 0 : parseInt(disfrutadoValor);
    compensado = (compensadoValor==undefined || compensadoValor=='') ? 0 : parseInt(compensadoValor);

    return disfrutado+compensado;
  }

}
