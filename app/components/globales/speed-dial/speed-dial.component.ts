// Imports Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'speed-dial-component',
    templateUrl: 'speed-dial.component.html',
    styleUrls: ['speed-dial.component.css']    
})

/**
 * Main class SpeedDialComponent
 * @class
 */
export class SpeedDialComponent {

    // Inputs
    @Input() mostrarFabOpciones: boolean = true;
    @Input() habilitarFabOpciones: boolean = true;
    @Input() habilitarGuardarBtn: boolean = true;
    @Input() habilitarFirmaBtn: boolean = true;
    @Input() habilitarPresentarBtn: boolean = true;
    @Input() habilitarPagarBtn: boolean = true;
    @Input() habilitarPdfBtn: boolean = true;  
    @Input() mostrarGuardarBtn: boolean = false;
    @Input() mostartFirmaBtn: boolean = false;
    @Input() mostrarPresentarBtn: boolean = false;
    @Input() mostrarPagarBtn: boolean = false;
    @Input() mostrarPdfBtn: boolean = false;

    // Outputs
    @Output() imprimirFormulario: EventEmitter<any> = new EventEmitter();
    @Output() pagarFormulario: EventEmitter<any> = new EventEmitter<any>();
    @Output() presentarFormulario: EventEmitter<any> = new EventEmitter<any>();
    @Output() consultarFirmantes: EventEmitter<any> = new EventEmitter<any>();
    @Output() guardarActualizarBorrador: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @constructs SpeedDialComponent
     */
    constructor() { }   

    private lanzarImprimirFormulario(event) {
        this.imprimirFormulario.emit(event);
    }

    private lanzarPagarFormulario(event) {
        this.pagarFormulario.emit(event);
    }

    private lanzarPresentarFormulario(event) {
        this.presentarFormulario.emit(event);
    }

    private lanzarConsultarFirmantes(event) {
        this.consultarFirmantes.emit(event);
    }

    private lanzarGuardarActualizarBorrador(event) {
        this.guardarActualizarBorrador.emit(event);
    }

}