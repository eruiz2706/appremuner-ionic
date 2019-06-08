import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class MainFunctions {

    constructor(public toastController: ToastController){
    }

   public async _presentToast(mensaje) {
      let toast = await this.toastController.create({
        message: mensaje,
        duration: 3000
      });
      toast.present();
    }

}
