import { Component } from '@angular/core';
import { DDatosCompartidosCabecera } from './to/ddatos-compartidos-cabecera';

@Component({
  selector: 'app-root',   
  templateUrl: './app/app.component.html'
})
export class AppComponent { 

	public dDatosCompartidos:DDatosCompartidosCabecera;
  
    constructor () {  
        this.dDatosCompartidos = new DDatosCompartidosCabecera();
    }

}
