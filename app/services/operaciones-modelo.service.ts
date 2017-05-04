// Imports Angular
import { Injectable, ElementRef, Renderer } from '@angular/core';

// Imports Material / Visual Components
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

// Imports componentes visuales
import { OperacionesMatematicasService } from './operaciones-matematicas.service';
import { FirmaComponent } from '../components/globales/firma/firma.component';


@Injectable()
/**
 * Main class OperacionesModeloService
 * @class
 */
export class OperacionesModeloService {

    constructor(
        public el: ElementRef,
        public renderer: Renderer,
        private _operacionesMatematicasService: OperacionesMatematicasService,
        public dialog: MdDialog
    ){}

    /**
     * @desc Function para mostrar el dialogo de firma y realizar las operaciones pertinentes como (autorizar|desautorizar|firmar)
     * @return {MdDialogRef}
     * @example from component
     *   let dialog = this._servicioInjectadoEnConstructor.firmarDocumentoModelo(4085652214, servicioAPI);
     *           
     *   dialog.afterClosed().subscribe(result => {
     *      console.log(`********Dialog result: ${result}`); 
     *   });
     *
     *   setTimeout(()=>{
     *      dialog.close();
     *   }, 2000);
     */
    public firmarDocumentoModelo(
        idDocumento:any,
        servicioAPI:any
    ): MdDialogRef<FirmaComponent> {
        let objectDialog = {
            height: '489px',
            width: '80%',
            disableClose: true
        };

        let dialogRef = this.dialog.open(FirmaComponent, objectDialog); 
        dialogRef.componentInstance.idDocumento = idDocumento; 
        dialogRef.componentInstance.servicioAPI = servicioAPI;   

        return dialogRef;
    }

    /**
     * @desc Función para transformar los datos de un modelo
     * @function transformarDatosModelo
     * @param {Object} modelo que contiene los datos a transformar
     * @param {String} tipoTransformacion (number|float|string)
     * @param {boolean} regexExtraer
     * @return {Object}
     * @example 
     *   _servicioInjectadoEnConstructor.transformarDatosModelo({cs_id_4: "0"}, "number");
     *   _servicioInjectadoEnConstructor.transformarDatosModelo({cs_id_4: "0"}, "number", ['cs_id_4'], true);
     */
    public transformarDatosModelo<T>(modelo: any, tipoTransformacion:string, campos?:any, regexExtraer?:boolean): any {
        
        let keys = campos && campos.length ? campos : Object.keys(modelo);
        
        for(let i in keys){    
            if (tipoTransformacion === "number" || tipoTransformacion === "float") {
                let valorInicial:any;
                if (campos.length && typeof campos[i] === 'object') {
                    valorInicial = regexExtraer ? modelo[campos[i].casilla].match(/[0-9]/g).join('') : modelo[campos[i].casilla];                               
                } else {
                    valorInicial = regexExtraer ? modelo[keys[i]].match(/[0-9]/g).join('') : modelo[keys[i]];                               
                }

                if (!isNaN(valorInicial)) {                    
                    if (typeof campos[i] === 'object') {
                        let operacionResultado = campos[i].redondear ? this._operacionesMatematicasService.redondearMenorValor(valorInicial) : valorInicial;                    
                        modelo[campos[i].casilla] = tipoTransformacion === "number" ? Number(operacionResultado) : parseFloat(operacionResultado);
                    } else {
                        modelo[keys[i]] = tipoTransformacion === "number" ? Number(valorInicial) : parseFloat(valorInicial);
                    }                                                    
                }
            } 

            if (tipoTransformacion === "string") {
                let valorInicial = regexExtraer ? modelo[keys[i]].match(/[a-zA-Z]/g).join('') : modelo[keys[i]];  
                if (isNaN(valorInicial)) {
                    modelo[keys[i]] = String(valorInicial);
                }
            }             
            
        }
   
        return modelo;
    }

}
