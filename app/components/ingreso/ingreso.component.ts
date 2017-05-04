// Imports Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// Imports Aplicacion
import { DError, DContextoMuiscaServicio } from '@dian/core';
import { DRutServicios } from '@dian/api-rut';
import { DNotificacionServicio } from '@dian-cmp/notificaciones';
import { DDocumento, DDocumentoAtributos, DDocumentoData } from '@dian/api-formulario';
import { DListaDocumentos } from '@dian/api-formulario';
//import { DCarbonoServicio } from '../../api-carbono/servicios/dcarbono.servicio';
import { MensajesConstantes } from '../../constants/mensajes';
import { DProcesarContextoUsuario } from '../../impl/dprocesar-contexto-usuario';
import { DContextoUsuarioServicio } from '@dian/api-identidad';

@Component({
    moduleId: module.id,
    selector: 'ingreso',
    templateUrl: 'ingreso.component.html',
    styleUrls: ['ingreso.component.css'],
    providers: [
        //DCarbonoServicio,
        DRutServicios,
        DNotificacionServicio,
        DContextoUsuarioServicio
    ]
})
export class IngresoComponent implements OnInit {

    private arrDocumentosDiligenciamiento:DListaDocumentos|DError;
    private arrDocumentosPresentados:DListaDocumentos|DError;
    private constribuyenteId:any;
    private enProceso:boolean = true;
    private mostrarDocumentosEnProceso = true;
    private mostrarDocumentosEnBorrador = true;
    private periodicidadSelecionada =  { value: '0', viewValue: 'Bimestral' };
    private periodicidadDeshabilitada = true;
    private anioSeleccionado = { value: '2017' };
    private periodoSeleccionado = null;   
    private periodicidad = [
        { value: '0', viewValue: 'Bimestral' },
      //  { value: '1', viewValue: 'Cuatrimestral' },
      //  { value: '2', viewValue: 'Anual' }
    ];
    private anio = [
        { value: '2017' }
    ];
    private periodo = [
        { value: '1', viewValue: 'Enero - Febrero' },
        { value: '2', viewValue: 'Marzo - Abril'  },
        //{ value: '3' },
        //{ value: '4' },
        //{ value: '5' },
        //{ value: '6' }
    ];

    /**
     * @constructs ConfiguracionSelectorComponent
     */
    constructor(
        private router: Router,
        private _notificaciones: DNotificacionServicio,
        //private dServicioREST: DCarbonoServicio,
        private dRutServicios: DRutServicios,
        private dContextoUsuarioServicio: DContextoUsuarioServicio
    ) { 
        this.arrDocumentosDiligenciamiento = new DListaDocumentos();
        this.arrDocumentosPresentados = new DListaDocumentos();
    }

    /**
    * Interface for on init document.
    * @interface
    */
    ngOnInit() { 
        this.enProceso = true;
        let precargaProceso = this._notificaciones.mostarDialogoCarga();      

        setTimeout(()=>{
            precargaProceso.close();
        }, 1000);

        /*let servicioDiligenciamiento = this.dServicioREST.consultarFormulariosEstado('pendiente'); 
        let servicioPresentados = this.dServicioREST.consultarFormulariosEstado('presentado');

        Observable
            .forkJoin(servicioDiligenciamiento,servicioPresentados)
            .subscribe(
                res => {
                    this.arrDocumentosDiligenciamiento = res[0];                    
                    this.arrDocumentosPresentados = res[1];
                    //precargaProceso.close();
                    this.enProceso = false;
                },
                error => {                    
                    //precargaProceso.close();
                    this._notificaciones.mostarDialogoError(MensajesConstantes.SIN_DOCUMENTOS);                    
                }
            );  

        // identidad     
        let dProcesarContextoUsuario = new DProcesarContextoUsuario();
        let observableRespuesta = this.dContextoUsuarioServicio.consultarContextoUsuarioMuisca();
        dProcesarContextoUsuario.setObservable(observableRespuesta);        

        observableRespuesta.subscribe(
            res => {
                let datosRespuesta:any = dProcesarContextoUsuario.respuesta;
                this.consultarTipoContribuyente(datosRespuesta.ANombrePropio ? datosRespuesta.NitUsuario : datosRespuesta.NitOrganizacion);                            
            },                     
            error =>{  
                this._notificaciones.mostarDialogoError(MensajesConstantes.ERROR_CON_IDENTIDAD);                      
            }
        );    */
    }

    /**
    * @desc Función para crear un nuevo borrador
    */
    public crearNuevoBorrador() {
        // mensual, bimestral, cuatrimestral, anual, aperiodico
        let queryStringParams = {
            concepto: 'inicial', 
            anio: this.anioSeleccionado.value, 
            periodicidad: 'bimestral', 
            periodo: this.periodoSeleccionado.value
        };
        this.router.navigate(['/formulario'], { queryParams: queryStringParams })
    }

    /**
    * @desc Función para consultar el tipo de contribuyente
    * @param {string} nit del contribuyente
    */
    /*public consultarTipoContribuyente(nit: string) {
        let observableServicio = this.dRutServicios.consultarTipoContribuyente(nit);
        observableServicio.subscribe(
            res => {
                let datosRespuesta:any = res;
                this.constribuyenteId = datosRespuesta.id;                
            },
            error => {
                this._notificaciones.mostarDialogoError(MensajesConstantes.ERROR_OBTENIENDO_CONTRIBUYENTE);                
            }
        );
    }  

    /**
    * @desc Función para imprimir el formulario
    */
    /*public imprimirFormulario(idFormulario:string) {
        let precargaProceso = this._notificaciones.mostarDialogoCarga();        
        let dprocesarPdf = this.dServicioREST.descargarFormulario(idFormulario);
        let dinfodescarga:any = new DDocumentoData(); 

        dprocesarPdf.subscribe(
            res  => {
                dinfodescarga = res;              
                var mediaType = 'application/pdf';
                var blob = new Blob([dinfodescarga._body], {type: mediaType});
                var filename = idFormulario + '.pdf';                            
                window['saveAs'](blob, filename);   
                precargaProceso.close();                 
            },                 
            error =>{                    
                precargaProceso.close();
                this._notificaciones.mostarDialogoError(MensajesConstantes.PROBLEMAS_CONSULTANDO_DOC + idFormulario, error.mensaje);
            }
        );                
    }

    /**
    * @desc Función para pagar el formulario
    * @param {String} idFormulario
    * @param {String} anioGravable
    */
    /*public pagarFormulario(idFormulario:string, anioGravable:string) {
        window.location.href = location.origin + '/WebDiligenciamiento/DefLiquidarDocumento.faces?numDocumento=' + idFormulario + '&numRepeticion=1&numPeriodo=1&annoGravable=' + anioGravable + '&estadoDoc=5&tipoDeclarante=' + this.constribuyenteId + '&idFormato=150&liquidacionGenerica=true';        
    }   

    /**
    * @desc Función para editar el formulario
    * @param {Object} objetoFormulario
    */
    /*public editarFormulario(objetoFormulario:any){
        let queryStringParams = {
            concepto: 'inicial', 
            anio: objetoFormulario.anio, 
            periodicidad: objetoFormulario.periodicidad, 
            periodo: objetoFormulario.periodo
        };
        this.router.navigate(['/formulario'], { queryParams: queryStringParams })
    }

    /**
    * @desc Función para consultar los formularios por año gravable
    * @param {Number} anio
    */
    /*public consultarFormulariosPorAnio(anio:number){
        this.enProceso = true;
        let precargaProceso = this._notificaciones.mostarDialogoCarga(); 
        let observableServicio = this.dServicioREST.consultarFormulariosEstado('pendiente', anio); 
        observableServicio.subscribe(
            res => {
                this.arrDocumentosPresentados = res;
                precargaProceso.close();
                this.enProceso = false;
            }
        );   
    }

     /**
    * @desc Función para corregir un formulario presentado
    * @param {Object} objetoFormulario
    */
    /*public corregirFormulario(objetoFormulario:any){
        this.enProceso = true;
        let precargaProceso = this._notificaciones.mostarDialogoCarga(); 
        let observableServicio = this.dServicioREST.obtenerBorradorCorreccion(
            objetoFormulario.anio, 
            objetoFormulario.periodicidad, 
            objetoFormulario.periodo, 
            objetoFormulario.identificador.id
        );

        observableServicio.subscribe(
            res => {
                precargaProceso.close();            
                let queryStringParams = {
                    concepto: 'correccion', 
                    anio: objetoFormulario.anio, 
                    periodicidad: objetoFormulario.periodicidad, 
                    periodo: objetoFormulario.periodo,
                    documento: objetoFormulario.identificador.id
                };
                this.router.navigate(['/formulario'], { queryParams: queryStringParams })
            },
            error => {
                precargaProceso.close();
                this._notificaciones.mostarDialogoError(MensajesConstantes.PROBLEMAS_AL_CORREGIR, error.mensaje);
            }
        );
    }*/
    
}
