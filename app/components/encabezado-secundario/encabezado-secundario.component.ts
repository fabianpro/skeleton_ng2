import { Component, OnInit, Input, Inject } from '@angular/core';
import { DDatosCompartidosCabecera } from '../../to/ddatos-compartidos-cabecera';


@Component({
    moduleId: module.id,
    selector: 'encabezado-secundario',
    templateUrl: 'encabezado-secundario.component.html',
    styleUrls: ['encabezado-secundario.component.css']
})
export class EncabezadoSecundarioComponent {

    @Input()
    dDatosCompartidosCabecera: DDatosCompartidosCabecera;

    constructor() {}
    
    private paginaSelector() {
        window.location.href = location.origin + '/WebDiligenciamiento/DefDiligenciamientoFormularios.faces';
    }
}
