// Imports Angular
import { Component, HostListener, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { DOCUMENT } from '@angular/platform-browser';

// Imports Application
import { DContextoMuisca } from '@dian/core';
import { DNotificacionServicio } from '@dian-cmp/notificaciones';
import { DContextoUsuarioServicio } from '@dian/api-identidad';
import { DDocumento, DDocumentoAtributos, DDocumentoData } from '@dian/api-formulario';
import { DProcesarContextoUsuario } from '../../impl/dprocesar-contexto-usuario';
//import { DCarbonoServicio } from '../../api-carbono/servicios/dcarbono.servicio';
import { MensajesConstantes } from '../../constants/mensajes';


@Component({
    moduleId: module.id,
    selector: 'encabezado-contenedor',
    templateUrl: 'encabezado-contenedor.component.html',
    styleUrls: ['encabezado-contenedor.component.css'],
    providers: [
        DContextoUsuarioServicio,
        //DCarbonoServicio,
        //DNotificacionServicio
    ]
})
export class EncabezadoContenedorComponent {

    private dProcesarContextoUsuario: DProcesarContextoUsuario;    
    private datosRespuesta:DContextoMuisca;    
    private hiddenGuardarSideNav:boolean = false;
    private hiddenFirmarSideNav:boolean = false;
    private hiddenPresentarSideNav:boolean = false;
    private nombreUsuario:string;
    private nombreOrganizacion:string;
    private precargaCabecera:boolean = true;
    private tiempo:Date;
    private horaReal:string;
    //public navIsFixed: boolean = false;

    
    constructor(
        private activatedRoute: ActivatedRoute,
        //private _notificaciones: DNotificacionServicio,
        private dContextoUsuarioServicio: DContextoUsuarioServicio,        
        //private dServicioREST: DCarbonoServicio
        //@Inject(DOCUMENT) private document: Document
    ) {
        this.dProcesarContextoUsuario = new DProcesarContextoUsuario();
        let observableRespuesta = this.dContextoUsuarioServicio.consultarContextoUsuarioMuisca();
        this.dProcesarContextoUsuario.setObservable(observableRespuesta);        

        observableRespuesta.subscribe(
            result=>{
                this.precargaCabecera = false;
                this.datosRespuesta = this.dProcesarContextoUsuario.respuesta;
                this.nombreUsuario = this.datosRespuesta.nombreUsuario;
                this.nombreOrganizacion = this.datosRespuesta.nombreOrganizacion;
                
                let horaConsulta = this.datosRespuesta.fechaConsulta;
                this.tiempo = horaConsulta ? new Date(horaConsulta) : new Date();               

                setInterval(()=>{
                    let segundos = this.tiempo.getSeconds();
                    this.tiempo.setSeconds(segundos + 1);
                    let tiempo = {
                        hora: this.tiempo.getHours() < 10 ? '0' + this.tiempo.getHours() : this.tiempo.getHours(),
                        minutos: this.tiempo.getMinutes() < 10 ? '0' + this.tiempo.getMinutes() : this.tiempo.getMinutes(),
                        segundos: this.tiempo.getSeconds() < 10 ? '0' + this.tiempo.getSeconds() : this.tiempo.getSeconds()
                    };
                    this.horaReal = tiempo.hora + ':' + tiempo.minutos + ':' + tiempo.segundos;             
                }, 1000);

            }
        );  

        // habilitar y deshabilitar los botones del sidenav segun el estado del documento
       /* this.activatedRoute
            .queryParams
            .subscribe((params: Params) => {
                let ids = Object.keys(params);                
                if (ids.length) {
                    this.habilitarOpcionesSideNav(params);                   
                } else {
                    this.hiddenGuardarSideNav = true;
                    this.hiddenFirmarSideNav = true;
                    this.hiddenPresentarSideNav = true;
                }
            });     */
    }

    /**
    * @desc Función para habilitar las opciones del sidenav dependiendo del estado del documento (Firmar, Presentar, Guardar)
    */
    /*public habilitarOpcionesSideNav(params:any) {
        let observableServicio;
        let cargaBorrador = this._notificaciones.mostarDialogoCarga();

        if (params.concepto === 'inicial') {
            observableServicio = this.dServicioREST.obtenerBorradorInicial(params.anio, params.periodicidad, params.periodo);
        } 

        if (params.concepto === 'correccion') {   
            let documentoCorreccion = params.hasOwnProperty('documento') && params.documento ? params.documento : null;   
            observableServicio = this.dServicioREST.obtenerBorradorCorreccion(params.anio, params.periodicidad, params.periodo, documentoCorreccion);
        }

        observableServicio.subscribe(
            res  => { 
                let modelo:any = res.doc;            
                if (modelo.doc.cab.cs_id_4) {  
                    let respuestaAtributosDocumentos:any = new DDocumentoAtributos();
                    let observableAtributos = this.dServicioREST.consultarFormularioAtributos(modelo.doc.cab.cs_id_4);
                    observableAtributos.subscribe(
                        res => {  
                            respuestaAtributosDocumentos = res;
                            if (respuestaAtributosDocumentos.docAtributos.enProcesoFirmas) {
                                this.hiddenGuardarSideNav = false;
                                this.hiddenFirmarSideNav = true;
                                this.hiddenPresentarSideNav = true;                                            
                            } else if (respuestaAtributosDocumentos.docAtributos.esPresentado) {
                                this.hiddenGuardarSideNav = false;
                                this.hiddenFirmarSideNav = false;
                                this.hiddenPresentarSideNav = false;                                            
                            } else if (respuestaAtributosDocumentos.docAtributos.esEditable) {
                                this.hiddenGuardarSideNav = true;
                                this.hiddenFirmarSideNav = true;
                                this.hiddenPresentarSideNav = false;                                            
                            } else {
                                this.hiddenGuardarSideNav = false;
                                this.hiddenFirmarSideNav = false;
                                this.hiddenPresentarSideNav = false;                                                        
                            }  
                        }, 
                        error => {  
                            this._notificaciones.mostarDialogoError('Error obteniendo atributos del documento', MensajesConstantes.ATRIBUTOS_DOC_ERROR);   
                        }
                    )                                       
                }            
            },
            error => {
                if(error && error.codigo === 500){
                    this._notificaciones.mostarDialogoError(MensajesConstantes.ERROR_OBTENIENDO_BORRADOR);
                }                
            }
        );     
    }  */

    /**
    * @desc Función para redireccionar a un link especifico de Muisca
    */
    public hrefButton (href:string) {
        window.location.href = location.origin + href;
    }

    /**
    * @desc Función para hacer el logout de la aplicación
    */
    public logoutApp() {
        console.log("Logout sin implementar");
    }

    /*@HostListener("window:scroll", [])
    onWindowScroll() {
        let number = this.document.body.scrollTop;
        this.navIsFixed = number > 100 ? true : this.navIsFixed && number < 10 ? false : true;
    } */   

}