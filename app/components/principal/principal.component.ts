import { Component } from '@angular/core';
import { DDatosCompartidosCabecera } from '../../to/ddatos-compartidos-cabecera';

@Component({
  moduleId: module.id,
  selector: 'principal-component',  
  templateUrl: 'principal.component.html'
})
export class PrincipalComponent {
    
    public dDatosCompartidosCabecera:DDatosCompartidosCabecera;

    constructor () {  
       this.dDatosCompartidosCabecera = new DDatosCompartidosCabecera();
    }
       
}