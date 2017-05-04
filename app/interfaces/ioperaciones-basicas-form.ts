
export interface IOperacionesBasicasForm {

	consultarTipoContribuyente(nit: string);   
    obtenerExtemporaneidad(ideDocumento: string);
    //consultarFormulario(ideDocumento: string);
    obtenerBorradorFormulario(concepto: string, anio: number, periodicidad:string, periodo:number, docCorregir?:string);
    obtenerAtributosDocumento(ideDocumento: string);
    /*desautorizarFirmante(nit: string);
    autorizarFirmante(nit: string);
    firmarDocumento(nit: string);
    callbackFirmaDocumento(xmlDocFirmado: string);*/
    consultarFirmantes();
    guardarActualizarBorrador();    
    presentarFormulario();
    pagarFormulario();
    imprimirFormulario();

}