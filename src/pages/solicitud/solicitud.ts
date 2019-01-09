import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ItemSliding,Item } from 'ionic-angular';
import { AuthServiceService } from '../auth-service.service';
import { UtilDate } from '../util/util.datetime';

@IonicPage()
@Component({
  selector: 'page-solicitud',
  templateUrl: 'solicitud.html',
})
export class SolicitudPage {

  ngsol: any;
  meses: string;
  year: any;
  usr: any;
  comps: any[];
  tipos: any[];
  solicituds: any[];
  subtipo: any[];
  public loading: any;
  verificado: boolean = false;
  fechaini:any;
  fechafin:any;
  ngsub:any;
  numDias:number;

  activeItemSliding: ItemSliding = null;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthServiceService,
    public utild: UtilDate,
    public toastController: ToastController,
    public alert: AlertController,
    public loadingCtrl: LoadingController) {
    this.meses = this.utild.getNameMonth();
    this.year = this.utild.getMaxYear();
    this.usr = this.auth.getUser();
    this.cargarTipos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudPage');
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


  cargarTipos(){
    this.presentLoading("Cargando...");
      this.auth.getTipoSolicitud(
        this.usr.token_app,
      ).then((response) =>
      {
        this.tipos  = [];
        this.solicituds = new Array();
        this.loading.dismiss();
        if(response['resp'] == null){
          this.presentAlert("No se encontraron tipos de solicitud.");
        }
        else{
          this.tipos = response['resp'];
          for (let x = 0; x < this.tipos.length; x++) {
              let exis = 0;
              if(this.solicituds == undefined){
                this.solicituds.push(this.tipos[x]);
              }
              else{
                  for (let i = 0; i < this.solicituds.length; i++) {
                    if(this.tipos[x].COD_SOLICITUD === this.solicituds[i].COD_SOLICITUD){
                      exis = 1;
                      break;
                    }
                  }
                  if(exis == 0){
                    this.solicituds.push(this.tipos[x]);
                  }
              }
          }
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  cambioSoltd(){
    this.subtipo = new Array();
    for (let x = 0; x < this.tipos.length; x++) {
      if(this.tipos[x].COD_SOLICITUD == this.ngsol){
        this.subtipo.push(this.tipos[x]);
      }
    }
  }

  verificarSolicitud(){

    if(this.ngsol == "" || this.ngsol == undefined){
      this.presentToast("La solicitud es requerida.");
      return;
    }
    if(this.ngsub == "" || this.ngsub == undefined){
      this.presentToast("El tipo de solicitud es requerido.");
      return;
    }

    if(this.numDias < 0 || this.numDias == undefined || (this.numDias+"") == ''){
      this.presentToast("Se requiere un numero de dias valido.");
      return;
    }

    if(this.fechaini == "" || this.fechaini == undefined){
      this.presentToast("La fecha de inicio es requerida.");
      return;
    }

    this.presentLoading("Cargando...");
      this.auth.getFechaFin(
        this.usr.token_app,
        this.usr.user.documento,
        this.ngsol,
        this.ngsub,
        this.fechaini,
        this.numDias
      ).then((response) =>
      {
        this.loading.dismiss();
        if(response['resp'] == null || response['resp'] == "null" || response['resp'] == undefined){
          this.presentAlert("No fue posible procesar solicitud, verifique su informacion.");
        }
        else{
          if(response['resp'].hasOwnProperty("estado")){
            if(response['resp'].estado == 0){
              this.presentConfirm(response['resp'].fecha);
            }
            else{
              this.presentAlert(response['resp'].mensaje);
            }
          }
          else{
            this.presentAlert("No fue posible procesar solicitud, verifique su informacion.");
          }
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  presentConfirm(fechaend) {
    this.fechafin   = fechaend;
    this.verificado = true;
    /*let alert = this.alert.create({
      title: 'Fecha de finalizacion',
      message: 'Asignaremos a '+fechaend+' como la fecha de finalizacion de tu solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
         text: 'Aceptar',
          handler: () => {
            this.fechafin   = fechaend;
            this.verificado = true;
          }
        }
      ]
    });
    alert.present();*/
  }

  presentAprobado() {
    let alert = this.alert.create({
      title: 'Confirmacion de solicitud',
      message: 'Solicitud aprobada y registrada con exito.',
      buttons: [
        {
         text: 'Aceptar',
          handler: () => {
            this.fechafin   = "";
            this.verificado = false;
            this.ngsol   = "";
            this.ngsub   = "";
            this.fechaini   = "";
            this.fechafin   = "";
            this.numDias   = null;
          }
        }
      ]
    });
    alert.present();
  }


  aprobar(){
    if(this.ngsol == "" || this.ngsol == undefined){
      this.presentToast("La solicitud es requerida.");
      return;
    }
    if(this.ngsub == "" || this.ngsub == undefined){
      this.presentToast("El tipo de solicitud es requerido.");
      return;
    }

    if(this.fechaini == "" || this.fechaini == undefined){
      this.presentToast("La fecha de inicio es requerida.");
      return;
    }

    if(this.fechafin == "" || this.fechafin == undefined){
      this.presentToast("La fecha de finalizacion es requerida.");
      return;
    }

    if(this.numDias < 0 || this.numDias == undefined ){
      this.presentToast("Se requiere un numero de dias valido.");
      return;
    }

    this.presentLoading("Cargando...");
      this.auth.confirmar_solicitud(
        this.usr.token_app,
        this.usr.user.documento,
        this.ngsol,
        this.ngsub,
        this.fechaini,
        this.fechafin,
        this.numDias
      ).then((response) =>
      {
        this.loading.dismiss();
        if(response == "null" || response == undefined ){
          this.presentAlert("No fue posible aprobar solicitud, intente de nuevo.");
        }
        else{
          if(response.hasOwnProperty("estado")){
            if(response['estado'] == 0){
              this.presentAprobado();
            }
            else{
              this.presentAlert(response['mensaje']);
              this.fechafin = "";
              this.verificado = false;
            }
          }
          else{
            this.presentAlert("No fue posible aprobar solicitud, intente de nuevo.");
          }
          console.log(response);
        }
      })
      .catch((error) =>
      {
        this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar tu solicitud.");
      });
  }

  cancelar(){
    this.fechafin   = "";
    this.verificado = false;
    this.ngsol      = "";
    this.ngsub      = "";
    this.fechaini   = "";
    this.fechafin   = "";
    this.numDias    = null;
    this.presentToast("Solicitud cancelada.");
  }

}
