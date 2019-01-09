import { Injectable } from "@angular/core";

@Injectable()
export class UtilDate {

    public start:any = new Date();


    public getMaxYear(){
        return this.start.getFullYear()+1;
    }

    public getNameMonth(){

        return 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre';
    }

}
