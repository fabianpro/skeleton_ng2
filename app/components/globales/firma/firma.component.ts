// Imports Angular
import { Component, ElementRef, ViewChild, OnInit, Input, NgZone, OnDestroy } from '@angular/core';

// Imports Material
import { MdDialogRef } from '@angular/material';

// Imports Application
import { DMensajeFirmado } from '@dian/api-firma';
import { MensajesConstantes } from '../../../constants/mensajes';
import { DProcesarContextoUsuario } from '../../../impl/dprocesar-contexto-usuario';
import { DContextoUsuarioServicio } from '@dian/api-identidad';

@Component({
    moduleId: module.id,
    //selector: 'firma-component',
    templateUrl: 'firma.component.html',
    styleUrls: ['firma.component.css'],
    providers: [
        DContextoUsuarioServicio
    ]    
})

/**
 * Main class FirmaComponent
 * @class
 */
export class FirmaComponent implements OnInit {
    
    public idDocumento:any;
    public servicioAPI:any;    

    private xmlDocSinFirmar:string = null;
    private enProceso:boolean = true;
    private firmantes:any;
    private mensaje:{} = {};
    private nit:any;
    
    /**
     * @constructs FirmaComponent
     */
    constructor(
        private dialogRef: MdDialogRef<FirmaComponent>,
        private dContextoUsuarioServicio: DContextoUsuarioServicio,
        private ngZone: NgZone
    ) {
        // Referencia para ser encontrado por el script de AdmFirmaDigital.js
        window['angularComponentRef'] = {component: this, zone: ngZone};
    }
    
    ngOnInit() {         
        // identidad     
        let dProcesarContextoUsuario = new DProcesarContextoUsuario();
        let observableRespuesta = this.dContextoUsuarioServicio.consultarContextoUsuarioMuisca();
        dProcesarContextoUsuario.setObservable(observableRespuesta);        

        observableRespuesta.subscribe(
            res => {
                let datosRespuesta:any = dProcesarContextoUsuario.respuesta;
                this.nit = datosRespuesta.NitUsuario;
                this.consultarDocumentoFirma();                
            },                     
            error =>{  
                this.enProceso = false; 
                this.mensaje = {
                    mostrar: true,
                    error: true,
                    titulo: "Error en Identidad",
                    mensaje: MensajesConstantes.ERROR_CON_IDENTIDAD
                };                            
            }
        );        
    }

    ngOnDestroy() {
        window['angularComponentRef'] = null;
    }

    /**
     * Function to close dialog
     * @param {Any} option selected
     */
    private closeDialog(option?:any) {
        this.dialogRef.close(option);
    }

    /**
    * @desc Función que consulta el documento XML que se va a firmar
    */
    private consultarDocumentoFirma() {
        let observableServicioXML = this.servicioAPI.consultarMensajeFormularioFirma(this.idDocumento);

        observableServicioXML.subscribe(
            res  => {           
                this.xmlDocSinFirmar = res.mensaje;
                this.consultarFirmantes();                           
            },                     
            error =>{  
                this.enProceso = false; 
                this.mensaje = {
                    mostrar: true,
                    error: true,
                    titulo: "Error en Firma",
                    mensaje: MensajesConstantes.PROBLEMAS_MENSAJE_FIRMA
                };                            
            }
        );  
    }

    /**
    * @desc Función para consultar los firmantes
    * @param {Number} indexFirmante para cambiar el estado del firmante
    * @param {boolean} puedeFirmar estado del firmante
    */
    private consultarFirmantes(indexFirmante?:number, puedeFirmar?:boolean) {
        this.enProceso = true; 
        this.mensaje = {};
        let observableServicioFirmantes = this.servicioAPI.consultarFirmantes(this.idDocumento);

        observableServicioFirmantes.subscribe(
            res => {
                this.firmantes = res.firmantes.firmantes;
                
                if(indexFirmante) {
                    this.firmantes[indexFirmante].puedeFirmar = puedeFirmar;     
                }
                
                // asignar boton firma segun nit
                for (let i in this.firmantes) {
                    if(Number(this.firmantes[i].contribuyente.identificacion.nroDocumento) === this.nit){
                        this.firmantes[i].puedeFirmar = true;
                    }                    
                }

                this.enProceso = false;                                                  
            }, 
            error => {
                this.enProceso = false;   
                this.mensaje = {
                    mostrar: true,
                    error: true,
                    titulo: "Error en Firma",
                    mensaje: MensajesConstantes.PROBLEMAS_OBTENIENDO_FIRMANTES
                }; 
            } 
        )
    }

    /**
    * @desc Función para desautorizar los firmantes
    * @param {Number} idFirmante
    */
    private desautorizarFirmante (idFirmante, indexFirmante) {
        this.enProceso = true;
        this.mensaje = {};
        let observableServicioFirmantes = this.servicioAPI.desautorizarFirmante(this.idDocumento, idFirmante);

        observableServicioFirmantes.subscribe(
            res => {
                this.consultarFirmantes(indexFirmante, false);                                                            
            },                 
            error =>{
                this.enProceso = false;
                this.mensaje = {
                    mostrar: true,
                    error: true,
                    titulo: "Error en Firma",
                    mensaje: MensajesConstantes.ERROR_DESAUTORIZANDO
                };
            }
        );
    }

    /**
    * @desc Función para autorizar los firmantes
    * @param {Number} idFirmante
    */
    public autorizarFirmante (idFirmante, indexFirmante) {        
        this.enProceso = true;
        this.mensaje = {};
        let observableServicio = this.servicioAPI.autorizarFirmante(this.idDocumento, idFirmante);

        observableServicio.subscribe(
            res => { 
                this.consultarFirmantes(indexFirmante, true);                                            
            },                 
            error =>{
                this.enProceso = false;
                this.mensaje = {
                    mostrar: true,
                    error: true,
                    titulo: "Error en Firma",
                    mensaje: MensajesConstantes.ERROR_AUTORIZANDO
                };              
            }
        );
    }

    /**
    * @desc Función para obtener la respuesta de la firma del documento
    * @param {string} xmlDocFirmado
    */
    public callbackFirmaDocumento(xmlDocFirmado: string) {
        this.enProceso = true;
        this.mensaje = {};
        
        if (this.idDocumento) { 
            let objMensajeFirmado = new DMensajeFirmado();
            objMensajeFirmado.tipo = "XML";
            objMensajeFirmado.firmaMensaje = xmlDocFirmado;
            objMensajeFirmado.mensajeOriginal.mensaje = this.xmlDocSinFirmar;
            objMensajeFirmado.referencia = this.idDocumento;
            objMensajeFirmado.estado = 'firmado';
            objMensajeFirmado.error = null;

            let observableServicio = this.servicioAPI.guardarFirmaFormulario(this.idDocumento, objMensajeFirmado);
            observableServicio.subscribe(
                res => {
                    this.enProceso = false; 
                    this.closeDialog({firmado: true});
                },
                error => {
                    this.enProceso = false;
                    this.mensaje = {
                        mostrar: true,
                        error: true,
                        titulo: "Documento no firmado",
                        mensaje: MensajesConstantes.ERROR_FIRMA
                    };                     
                }
            );
        } else {
            this.enProceso = false;
            this.mensaje = {
                mostrar: true,
                error: true,
                titulo: "Documento no guardado",
                mensaje: MensajesConstantes.ID_DOC_CALLBACK_NO_ASIGNADO
            };
        }    
    }

}