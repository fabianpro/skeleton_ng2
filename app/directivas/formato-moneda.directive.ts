import { Directive, ElementRef, HostListener, OnInit, Input } from '@angular/core';
import { FormateoValorPipe } from "../pipes/formateo-valor.pipe";


@Directive({
    selector: '[formatoMoneda]'
})
export class FormatoMonedaDirective implements OnInit {
  
    private SEPARADOR_DECIMAL:string;
    private valueString:string;
    private numberValue:number;
    private VALOR_REDONDEO_MENOR:number = 500;
    
    private el: HTMLInputElement;

    @Input('redondear') redondear:boolean; 
  
    constructor(
        private elementRef: ElementRef,
        private monedaPipe: FormateoValorPipe
    ) { 
        this.el = this.elementRef.nativeElement;
    }
    
    ngOnInit() {    
        if(this.el.value){
            this.ejecutarProceso(this.el.value);           
        }
    }
    
    @HostListener("focus", ["$event.target.value"])
    onFocus(value) {  
        this.el.value = this.monedaPipe.parse(value);         
    }

    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        this.ejecutarProceso(value);      
    }

    /*@HostListener("keyup", ["$event"])
    onKeyup(event) {
        if (event.keyCode == 13) { // 13 = Enter | Intro
            this.ejecutarProceso(this.el.value);      
            //this.el.value = this.redondear ? this.redondearValor(this.el.value) : this.formatearValor(this.el.value); 
        }
    }*/

    /**
    * @desc Función para verificar el parametro de la directiva y ejecutar el proceso correspondiente
    * @param {String|Number} value
    */
    private ejecutarProceso(value:any){
        if (this.redondear) {
            this.redondearValor(value);
        } else {
            this.formatearValor(value);
        }
    }
         
    /**
    * @desc Funcion que transforma el valor de la casilla
    * @param {String} value
    * @ignore
    */
    private formatearValor(value:string){         
        let valorCasilla:number = Number(value);
        this.el.value = this.monedaPipe.transform(isNaN(valorCasilla) ? 0 : valorCasilla);
    }

    /**
    * @desc Funcion que redondea el valor de la casilla
    * @param {String} value
    * @ignore
    */
    private redondearValor(value:string){
        let valorCasilla:number = Number(value);
      
        if (valorCasilla >= 0 && valorCasilla < this.VALOR_REDONDEO_MENOR) {
            valorCasilla = 0;       
        } else if (valorCasilla >= this.VALOR_REDONDEO_MENOR && valorCasilla <= 999) {
            valorCasilla = 1000;
        } else { 
            var valorModulo:number = valorCasilla % 1000;    
            if (valorModulo > 0 && valorModulo < this.VALOR_REDONDEO_MENOR) {
                valorCasilla = valorCasilla - valorModulo;          
            } else if (valorModulo >= this.VALOR_REDONDEO_MENOR && valorModulo < 999) {
                valorCasilla = valorCasilla - valorModulo;  
                valorCasilla = valorCasilla + 1000;
            }
        }
        
        this.el.value = this.monedaPipe.transform(isNaN(valorCasilla) ? 0 : valorCasilla);
    }
      
}