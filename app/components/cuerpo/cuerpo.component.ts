// Imports Angular
import { Component, ElementRef, ViewChild, OnInit, Input, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

// Imports componentes visuales
import { FirmaComponent } from '../globales/firma/firma.component';
import { OperacionesMatematicasService } from '../../services/operaciones-matematicas.service';
import { OperacionesModeloService } from '../../services/operaciones-modelo.service';

// Imports Aplicacion
import { DError } from '@dian/core';
import { DRutServicios } from '@dian/api-rut';
import { DNotificacionServicio } from '@dian-cmp/notificaciones';
import { DDatosCompartidosCabecera } from '../../to/ddatos-compartidos-cabecera';
import { IOperacionesBasicasForm } from '../../interfaces/ioperaciones-basicas-form';
import { DDocumento, DDocumentoAtributos, DDocumentoData } from '@dian/api-formulario';
//import { DCarbonoServicio } from '../../api-carbono/servicios/dcarbono.servicio';
//import { Tarifas } from '../../models/tarifas';
import { DocumentoAtributos } from '../../models/documento-atributos';
//import { DListaTarifas } from '../../api-carbono/to/dlista-tarifas';
import { MensajesConstantes } from '../../constants/mensajes';
import { FormularioConstantes } from '../../constants/formulario';

// implements
//import { DProcesarTarifas } from '../../impl/dprocesar-tarifas';


@Component({
    moduleId: module.id,
    selector: 'cuerpo-component',
    templateUrl: 'cuerpo.component.html',
    styleUrls: ['cuerpo.component.css'],
    providers: [
        DNotificacionServicio,
        OperacionesMatematicasService,
        OperacionesModeloService,
        //DCarbonoServicio,
        DRutServicios
    ]
})
export class CuerpoComponent implements OnInit { //IOperacionesBasicasForm

    //private constantesDocumento: Tarifas;
    private contribuyenteId:any;
    private modelo: DDocumento;
    private modeloBorrador: DDocumento;
    private esExtemporaneo: boolean = false;
    private paramsUrl: any;

    // slide cards
    private cardDeclarante: boolean = true;   
    private cardCasillas: boolean = true;   

    // botones md-fab
    private mostrarFabOpciones: boolean = false;
    private habilitarFabOpciones: boolean = true;
    private mostrarGuardarBtn: boolean = false;
    private mostartFirmaBtn: boolean = false;
    private mostrarPresentarBtn: boolean = false;
    private mostrarPagarBtn: boolean = false;
    private mostrarPdfBtn: boolean = false;

    @Input() public dDatosCompartidosCabecera: DDatosCompartidosCabecera;
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private _notificaciones: DNotificacionServicio,
        private _operacionesMatematicasService: OperacionesMatematicasService,
        private _operacioneModeloService: OperacionesModeloService,
        //private dServicioREST: DCarbonoServicio,
        private dRutServicios: DRutServicios        
    ) {
        this.modelo = new DDocumento(); 
        //this.constantesDocumento = new Tarifas();  
    }

    /**
    * @desc Función para llamar todos los metodos que carguen los elementos del formulario
    * como tambien los datos del formulario
    */
    ngOnInit() {
        let cargaBorrador = this._notificaciones.mostarDialogoCarga();

        this.activatedRoute
            .queryParams
            .subscribe((params: Params) => {    
                this.paramsUrl = params;                   
                let documentoCorreccion = this.paramsUrl.hasOwnProperty('documento') && this.paramsUrl.documento ? this.paramsUrl.documento : null; 
                //this.obtenerBorradorFormulario(documentoCorreccion); 
                //this.obtenerTarifas();  
                this.mostrarFabOpciones = true; 
                this.mostrarGuardarBtn = true;
                this.mostartFirmaBtn = true;
                this.mostrarPresentarBtn = true;
                this.mostrarPdfBtn = true;
                this.mostrarPagarBtn = true;
                this.mostrarFabOpciones = true;    

                setTimeout(()=>{
                    cargaBorrador.close();
                }, 1000);  
            });
    }  

    /**
    * @desc Función que se ejecuta al destruirse la vista
    */
    /*ngOnDestroy() {

    }*/

    // ====== Metodos propios del formulario ======

    /**
     * @desc Función para cambiar el foco de los input
     * @function processKeyUp
     * @ignore
     * @param e Event evento que contiene el keycode
     * @param el HtmlElement a pasar el foco
     */
    private processKeyUp(e, el) {
        if (e.keyCode == 13) { // 13 = Enter | Intro
            el.focus();
        }
    }  

    /**
    * @desc Función para redirigir al dashboard
    * @function paginaDashboard
    * @ignore
    */
    private paginaDashboard() {
        window.location.href = location.origin + '/WebDashboard/DefDashboard.faces';
    }

    /**
    * @desc Función para compartir datos entre componentes
    * @function compartirInformacionCabecera
    * @ignore
    */
    public compartirInformacionCabecera() {
        this.dDatosCompartidosCabecera.numFormulario = this.modelo.doc.cab.id;
        this.dDatosCompartidosCabecera.anio = this.modelo.doc.cab.cs_id_1;
        (<any>Object).assign(this.dDatosCompartidosCabecera, this.dDatosCompartidosCabecera);
    }

    /**
    * @desc Función para obtener las tarifas y guardarlas en una variable para luego ser usadas desde cualquier lugar
    */
    /*private obtenerTarifas() {
        let objTarifas = new DListaTarifas();
        let procesarTarifas = new DProcesarTarifas(objTarifas);    
        let observableTarifas = this.dServicioREST.consultarTarifas();    
        procesarTarifas.setObservable(observableTarifas);
        observableTarifas.subscribe(
            res => {   
                for(let i in objTarifas.tarifas) {
                    this.constantesDocumento[objTarifas.tarifas[i].tipoCombustible] = objTarifas.tarifas[i].tarifa;
                }
            });
    }*/

    /**
    * @desc Función para inicializar los campos de formulario
    */
    private inicializarCamposFormulario(){
        this.modelo.doc.cuerpo.cs_id_26 = this.modelo.doc.cuerpo.cs_id_26 || 0;
        this.modelo.doc.cuerpo.cs_id_32 = this.modelo.doc.cuerpo.cs_id_32 || 0;
        this.modelo.doc.cuerpo.cs_id_27 = this.modelo.doc.cuerpo.cs_id_27 || 0;
        this.modelo.doc.cuerpo.cs_id_33 = this.modelo.doc.cuerpo.cs_id_33 || 0;              
    }

    // ====== Metodos creados por el desarrollador para operaciones extras como (validacionesEnCampos, etc) ======


    /**
    * @desc Function para calcular casilla 38
    */
    private operacionCs38():void {    
        let campos = ['cs_id_26','cs_id_32'];
        let resultadoSuma = this._operacionesMatematicasService.sumarRestarEnModelo('+', this.modelo.doc.cuerpo, campos);
        this.modelo.doc.cuerpo.cs_id_38 = String(resultadoSuma);                    
    }

    /**
    * @desc Function para calcular casilla 39
    */
    private operacionCs39():void {
        let campos = ['cs_id_27','cs_id_33'];
        let resultadoSuma = this._operacionesMatematicasService.sumarRestarEnModelo('+', this.modelo.doc.cuerpo, campos);
        this.modelo.doc.cuerpo.cs_id_39 = String(resultadoSuma);                
    }



    // ====== Metodos Obligatarios implementados desde la interfaz de IOperacionesBasicasForm para realizar operaciones al servidor ======
    
    /**
    * @desc Función para consultar el tipo de contribuyente
    * @param {string} nit del contribuyente
    */
    /*public consultarTipoContribuyente(nit: string) {
        let observableServicio = this.dRutServicios.consultarTipoContribuyente(nit);
        observableServicio.subscribe(
            res => {
                let datosRespuesta:any = res;
                this.contribuyenteId = datosRespuesta.id;                
            },
            error => {
                this.mostrarPagarBtn = false;
                this._notificaciones.mostarDialogoError(MensajesConstantes.ERROR_OBTENIENDO_CONTRIBUYENTE);                
            }
        );
    }  

    /**
    * @desc Función para consultar si el documento es extemporaneo
    * @param {string} ideDocumento del contribuyente
    */
    /*public obtenerExtemporaneidad(ideDocumento: string) {
        let observableAtributos = this.dServicioREST.esExtemporaneo(ideDocumento);
        observableAtributos.subscribe(
            res => {
                this.esExtemporaneo = res.esExtemporaneo;
            }
        );
    }     

    /**
    * @desc Función para obtener el borrador del formulario
    * @param {string} docCorregir
    */
    /*public obtenerBorradorFormulario(docCorregir?:string) {
        let observableServicio;
        //let cargaBorrador = this._notificaciones.mostarDialogoCarga();

        if (this.paramsUrl.concepto === 'inicial') {
            observableServicio = this.dServicioREST.obtenerBorradorInicial(this.paramsUrl.anio, this.paramsUrl.periodicidad, this.paramsUrl.periodo);
        } 

        if (this.paramsUrl.concepto === 'correccion') {     
            observableServicio = this.dServicioREST.obtenerBorradorCorreccion(this.paramsUrl.anio, this.paramsUrl.periodicidad, this.paramsUrl.periodo, docCorregir);
        }

        observableServicio.subscribe(
            res  => { 
                this.modelo.doc = res.doc;
                
                if (this.paramsUrl.concepto === 'inicial') {
                    this.inicializarCamposFormulario();                
                } 

                if (this.modelo.doc.cab.cs_id_4) {        
                    this.obtenerExtemporaneidad(this.modelo.doc.cab.cs_id_4);
                    this.obtenerAtributosDocumento(this.modelo.doc.cab.cs_id_4);                    
                } else {
                    this.mostrarGuardarBtn = true;
                }
                
                this.consultarTipoContribuyente(this.modelo.doc.cab.cs_id_5);
                this.compartirInformacionCabecera();
                cargaBorrador.close();
            },
            error => {
                if(error && error.codigo === 500){
                    cargaBorrador.close();
                    this._notificaciones.mostarDialogoError(MensajesConstantes.ERROR_OBTENIENDO_BORRADOR);
                }                
            });        
    }

    /**
    * @desc Función para obtener los atributos del documento cuando se ejecuta (Firmar, Presentar, Guardar, Autorizar y Desautorizar)
    * @param {string} ideDocumento del contribuyente
    */
    /*public obtenerAtributosDocumento(ideDocumento: string) {
        this.habilitarFabOpciones = false; 
        let respuestaAtributosDocumentos:any = new DDocumentoAtributos();

        if(ideDocumento){
            let observableAtributos = this.dServicioREST.consultarFormularioAtributos(ideDocumento);
            observableAtributos.subscribe(
                res => {  
                    respuestaAtributosDocumentos = res;
                    if (respuestaAtributosDocumentos.docAtributos.enProcesoFirmas) {
                        this.mostrarGuardarBtn = false;
                        this.mostartFirmaBtn = true;
                        this.mostrarPresentarBtn = true;
                        this.mostrarPdfBtn = true;
                        this.mostrarPagarBtn = false;
                        this.mostrarFabOpciones = true;                        
                    } else if (respuestaAtributosDocumentos.docAtributos.esPresentado) {
                        this.mostrarGuardarBtn = false;
                        this.mostartFirmaBtn = false;
                        this.mostrarPresentarBtn = false;
                        this.mostrarPdfBtn = true;
                        this.mostrarPagarBtn = true;
                        this.mostrarFabOpciones = true;                        
                    } else if (respuestaAtributosDocumentos.docAtributos.esEditable) {
                        this.mostrarGuardarBtn = true;
                        this.mostartFirmaBtn = true;
                        this.mostrarPresentarBtn = false;
                        this.mostrarPdfBtn = true;
                        this.mostrarPagarBtn = false;
                        this.mostrarFabOpciones = true;                        
                    } else {
                        this.mostrarGuardarBtn = false;
                        this.mostartFirmaBtn = false;
                        this.mostrarPresentarBtn = false;
                        this.mostrarPdfBtn = false;
                        this.mostrarPagarBtn = false;
                        this.mostrarFabOpciones = false;                                    
                    } 
                    this.habilitarFabOpciones = true;   
                }, 
                error => {  
                    this._notificaciones.mostarDialogoError('Error obteniendo atributos del documento', MensajesConstantes.ATRIBUTOS_DOC_ERROR);   
                }
            )
        }
    }   

    /**
    * @desc Función para guardar el borrador del formulario
    */
    /*public guardarActualizarBorrador() {
        this.modeloBorrador = this.modelo;
        this.modeloBorrador.doc.cuerpo = this._operacioneModeloService.transformarDatosModelo(this.modeloBorrador.doc.cuerpo, "number", FormularioConstantes.REGLAS_FORMUALRIO);                

        // guardar
        if (String(this.modelo.doc.cab.id) === "-1") {
            // Es extemporaneo
            if (this.esExtemporaneo && (!this.modeloBorrador.doc.cuerpo.cs_id_65 || Number(this.modeloBorrador.doc.cuerpo.cs_id_65) <= 0)) {
                this._notificaciones.mostarDialogoInformacion(MensajesConstantes.EXTEMPORANEO_TITULO, MensajesConstantes.EXTEMPORANEO_MSG);     
            }

            // No es extemporaneo
            if (!this.esExtemporaneo && (!this.modeloBorrador.doc.cuerpo.cs_id_65 || Number(this.modeloBorrador.doc.cuerpo.cs_id_65) >= 0)) {
                let extemporaneidadModal = this._notificaciones.mostarDialogoConfirmacion(MensajesConstantes.EXTEMPORANEO_TITULO, MensajesConstantes.NO_EXTEMPORANEO_MSG);
                
                extemporaneidadModal.afterClosed().subscribe(result => {
                    if (result) {  
                        this.modeloBorrador.doc.cuerpo = this._operacioneModeloService.transformarDatosModelo(this.modeloBorrador.doc.cuerpo, "number", FormularioConstantes.REGLAS_FORMUALRIO);                                        
                        let precargaProceso = this._notificaciones.mostarDialogoCarga();
                        let observableServicio = this.dServicioREST.crearFormulario(this.modeloBorrador);
                        observableServicio.subscribe(
                            res => {
                                this.modelo.doc = res.doc;
                                this.compartirInformacionCabecera();
                                this.obtenerAtributosDocumento(this.modelo.doc.cab.cs_id_4);
                                this._notificaciones.mostarDialogoInformacion(MensajesConstantes.BORRADOR_GUARDADO);                          
                                precargaProceso.close();
                            },
                            error => {      
                                if(error){
                                    precargaProceso.close();
                                    let mensajeError = error.codigo === 409 ? error.respuesta.datosMensaje.mensajeDetallado : error.mensaje;
                                    this._notificaciones.mostarDialogoError(MensajesConstantes.BORRADOR_ERROR_GUARDADO, mensajeError);
                                }
                            }
                        );
                    }
                });        
            }  
        }
        // actualizar
        else {
            this.modeloBorrador.doc.cuerpo = this._operacioneModeloService.transformarDatosModelo(this.modeloBorrador.doc.cuerpo, "number", FormularioConstantes.REGLAS_FORMUALRIO);                                         
            let precargaProceso = this._notificaciones.mostarDialogoCarga();
            let observableServicio = this.dServicioREST.actualizarFormulario(String(this.modeloBorrador.doc.cab.id), this.modeloBorrador);
            observableServicio.subscribe(
                res => {
                    this.compartirInformacionCabecera();
                    this._notificaciones.mostarDialogoInformacion(MensajesConstantes.BORRADOR_ACTUALIZADO);                              
                    precargaProceso.close();
                },
                error => {      
                    if(error){
                        precargaProceso.close();
                        let mensajeError = error.codigo === 409 ? error.respuesta.datosMensaje.mensajeDetallado : error.mensaje;
                        this._notificaciones.mostarDialogoError(MensajesConstantes.BORRADOR_ERROR_ACTUALIZADO, mensajeError);          
                    }
                }
            );
        }
    }  

    /**
    * @desc Función para presentar el formulario
    */
    /*public presentarFormulario() {
        let precargaProceso = this._notificaciones.mostarDialogoCarga();
        this.mostrarFabOpciones = false;

        let observableServicio = this.dServicioREST.presentarFormulario(this.modelo.doc.cab.cs_id_4);        
        observableServicio.subscribe(
            respuesta  => {
                this.mostrarFabOpciones = true;
                this.obtenerAtributosDocumento(this.modelo.doc.cab.cs_id_4);
                precargaProceso.close();
                this._notificaciones.mostarDialogoInformacion('Documento presentado', MensajesConstantes.PRESENTACION_EXITOSA);                        
            },                 
            error =>{
                this.mostrarFabOpciones = true;
                precargaProceso.close();
                this._notificaciones.mostarDialogoError(MensajesConstantes.PRESENTACION_NO_EXITOSA, error.mensaje);                  
            }
        );
    }

    /**
    * @desc Función para pagar el formulario
    */
    /*public pagarFormulario() {
        this.mostrarFabOpciones = false;
        let numDocumento = this.modelo.doc.cab.cs_id_4;
        let anioGravable = this.modelo.doc.cab.cs_id_1;        
        window.location.href = location.origin + '/WebDiligenciamiento/DefLiquidarDocumento.faces?numDocumento=' + numDocumento + '&numRepeticion=1&numPeriodo=1&annoGravable=' + anioGravable + '&estadoDoc=5&tipoDeclarante=' + this.contribuyenteId + '&idFormato=150&liquidacionGenerica=true';        
    }    

    /**
    * @desc Función para imprimir el formulario
    */
    /*public imprimirFormulario() {
        let precargaProceso = this._notificaciones.mostarDialogoCarga();
        this.mostrarFabOpciones = false;
       
        if (this.modelo.doc.cab.cs_id_4) {       

            let dprocesarPdf = this.dServicioREST.descargarFormulario(this.modelo.doc.cab.cs_id_4);
            let dinfodescarga:any = new DDocumentoData(); 

            dprocesarPdf.subscribe(
                res  => {
                    this.mostrarFabOpciones = true;  
                    dinfodescarga = res;              
                    var mediaType = 'application/pdf';
                    var blob = new Blob([dinfodescarga._body], {type: mediaType});
                    var filename = this.modelo.doc.cab.cs_id_4 + '.pdf';                            
                    window['saveAs'](blob, filename);   
                    precargaProceso.close();                 
                },                 
                error =>{
                    this.mostrarFabOpciones = true;
                    precargaProceso.close();
                    this._notificaciones.mostarDialogoError(MensajesConstantes.PROBLEMAS_CONSULTANDO_DOC + this.modelo.doc.cab.cs_id_4, error.mensaje);
                }
            );        
        } else {
            this.mostrarFabOpciones = false;
            precargaProceso.close();
            this._notificaciones.mostarDialogoError(MensajesConstantes.IDENTIFICADOR_DOC_NO_DEFINIDO);                    
        }
    }

    /**
    * @desc Función para consultar los firmantes y mostrar dialogo para realizar la firma
    */
    /*public consultarFirmantes() {
        this.mostrarFabOpciones = false;          
        let dialog =  this._operacioneModeloService.firmarDocumentoModelo(this.modelo.doc.cab.cs_id_4, this.dServicioREST);             
        
        dialog.afterClosed().subscribe(
            result => {
                if(result && result.firmado){
                    this._notificaciones.mostarDialogoInformacion(MensajesConstantes.DOCUMENTO_FIRMADO);                     
                }
                this.obtenerAtributosDocumento(this.modelo.doc.cab.cs_id_4);            
                this.mostrarFabOpciones = true;
            }
        );
    }*/

}
