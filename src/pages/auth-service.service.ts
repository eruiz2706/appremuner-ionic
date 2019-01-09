import { Platform, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { FileOpener } from '@ionic-native/file-opener';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthServiceService {
  usr: any       = null;
  host: string   = "18.219.29.74";//18.222.54.204";//13.59.105.209
  loading        = null;
  numtime:number = 50000;

  constructor(public http: Http, public iab: InAppBrowser,private document: DocumentViewer,
    private _file: File, private transfer: FileTransfer, private plataforma: Platform,
    private fileopen: FileOpener, private alertCtrl: AlertController,
    private toastController: ToastController,private loadingCtrl: LoadingController) {}

  public autenticar(documento, correo, fecha) {
    let body = {
      documento: documento,
      email: correo,
      fecha: fecha,
      version: "0.0.1"
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/autenticar",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          console.log("API Response : ", response.json());
          resolve(response.json());
        })
        .catch(error => {
          console.error("API Error : ", error.status);
          console.error("API Error : ", JSON.stringify(error));
          reject(error);
        });
    });
  }

  public getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  public valitaSesion() {
    this.usr = JSON.parse(localStorage.getItem("user"));
    if (this.usr == null) {
      return false;
    }
    if (!this.usr.hasOwnProperty("token_app")) {
      return false;
    }
    return true;
  }

  public getComprobantes(documento, token, anio, mes) {
    let body = {
      documento: documento,
      year: anio,
      month: mes,
      token_app: token,
      version: "0.0.1",
      descargar: "NO"
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/comprobante",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getCertificado(documento, token, anio, mes) {
    let body = {
      documento: documento,
      year: anio,
      month: mes,
      token_app: token,
      version: "0.0.1",
      descargar: "NO"
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/certificado",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getComprob_email(documento, token, anio, mes, id, nombre, email) {
    let bod = {
      documento: documento,
      year: anio,
      month: mes,
      token_app: token,
      version: "0.0.1",
      email: email,
      nombre: nombre,
      periodo: id
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/comprobante_email",bod,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getRetencion_email(documento, token, anio, mes, id, nombre, email) {
    let bod = {
      documento: documento,
      year: anio,
      month: mes,
      token_app: token,
      version: "0.0.1",
      email: email,
      nombre: nombre,
      periodo: id
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/retencion_email",bod,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getCertificado_email(documento,token,anio,mes,id,nombre,email,certificado) {
    let bod = {
      documento: documento,
      year: anio,
      month: mes,
      token_app: token,
      version: "0.0.1",
      email: email,
      nombre: nombre,
      reporte: id,
      certificado: certificado
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/certificado_email",bod,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getTipoSolicitud(token) {
    let body = {token_app: token,version: "0.0.1"};
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/tiposolicitud",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getFechaFin(token,documento,solicitud,tiposolicitud,fechaini,tiempo) {
    let body = {
      token_app: token,
      version: "0.0.1",
      documento: documento,
      solicitud: solicitud,
      tiposolicitud: tiposolicitud,
      fecha: fechaini,
      tiempo: tiempo
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/fechasolicitud",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public confirmar_solicitud(token,documento,solicitud,tiposolicitud,fechaini,fechafin,tiempo) {
    let body = {
      token_app: token,
      version: "0.0.1",
      documento: documento,
      solicitud: solicitud,
      tiposolicitud: tiposolicitud,
      fechaini: fechaini,
      fechafin: fechafin,
      tiempo: tiempo
    };
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/confirmarsolicitud",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  public validaToken(token) {
    let body = {token_app: token,};
    let headers = new Headers({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http
        .post("http://" + this.host + "/remuner/public/api/tokenIsExpired",body,options)
        .timeout(this.numtime)
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public downPdf(parametros,name) {
    let url   = "http://" +this.host +parametros;
    let path  = null;
    this.presentLoading("Descargando documento.");
    path      =  (this.plataforma.is('ios')) ? this._file.documentsDirectory : this._file.externalDataDirectory ;
    const transfer = this.transfer.create();
    transfer.download(url,path + name+'.pdf').then(
      entry =>{
        this.dismissLoading();
        this.alertOpenFile(entry.toURL(),name);
        //this.document.viewDocument(path+ name+'.pdf', 'application/pdf',{});
      },
      error =>{
        this.presentToast("Se presento un inconveniente al descargar el documento. "+error.code);
        this.dismissLoading();
      }
    );
  }

  public alertOpenFile(_url,name){
    const confirm = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Deseas ver el documento ('+name+'.pdf) descargado?',
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.fileopen.open(_url, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e =>
                //console.log('Error opening file', e)
                this.presentToast("No se pudo abrir el documento descargado.")
              );
          }
        },
        { text: 'NO',handler: () => {} }
      ]
    });
    confirm.present();
  }

  public async presentToast(mensaje) {
      let toast = await this.toastController.create({message: mensaje,duration: 3000});
      toast.present();
  }

  public async presentLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create(
      {content: mensaje,enableBackdropDismiss: true,dismissOnPageChange: true});
    await this.loading.present();
  }

  public dismissLoading(){
    if(this.loading != null){
      this.loading.dismiss();
    }
  }

  public toNameFile(s){
    return s.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

}
