import { Injectable, ElementRef, Renderer } from '@angular/core';

@Injectable()
/**
 * Main class OperacionesMatematicasService
 * @class
 */
export class OperacionesMatematicasService {

    constructor(
        public el: ElementRef,
        public renderer: Renderer
    ){}

    /**
     * @desc Función para redondear al valor menor
     * @function redondearMenorValor
     * @param {Number} valor a redondear
     * @param {Number} menor numero menor limite para redondear
     * @return {Number} valorCampo
     * @example _servicioInjectadoEnConstructor.redondearMenorValor(4564521);
     */
    public redondearMenorValor(valor: number, menor?: number): number {
        let valorCampo: number = Number(valor);
        let menorValor: number = Number(menor) || 500;

        if (valor < 0) {
            return 0;
        }

        if (valorCampo >= 0 && valorCampo < menorValor) {
            valorCampo = 0;
        } else if (valorCampo >= menorValor && valorCampo <= 999) {
            valorCampo = 1000;
        } else {
            let valorModulo: number = valorCampo % 1000;
            if (valorModulo > 0 && valorModulo < menorValor) {
                valorCampo = valorCampo - valorModulo;
            } else if (valorModulo >= menorValor && valorModulo < 999) {
                valorCampo = valorCampo - valorModulo;
                valorCampo = valorCampo + 1000;
            }
        }
        return isNaN(valorCampo) ? 0 : valorCampo;
    }

    /**
    * @desc Función para sumar los campos requeridos del formulario y devolver el resultado
    * @function sumarRestarEnModelo
    * @param {String} operación a realizar +|-
    * @param {Array} campos del modelo con el que se va a operar o se va a obtener los datos
    * @return {Number} resultado;
    * @example _servicioInjectadoEnConstructor.sumarRestarEnModelo('+', , ['cs_id_30','cs_id_36']);
    */
    public sumarRestarEnModelo<T>(operacion:string, modelo:any, campos:T[]):number {
        
        let resultado = 0;
        
        for (let i in campos) {

            //let valorCasilla = !isNaN(modelo[campos[i]]) ? this.redondearMenorValor(modelo[campos[i]]) : 0;
            let valorCasilla = !isNaN(modelo[campos[i]]) ? modelo[campos[i]] : 0;
            let valor = valorCasilla ? Number(valorCasilla) : 0;
            
            if (operacion === '+') {
                resultado += !isNaN(valor) ? valor : 0;
            } 

            if (operacion === '-') {
                if (Number(i) == 0) {
                    resultado = valor;
                    break;
                } else {
                    resultado -= !isNaN(valor) ? valor : 0;
                    //break;
                }
            }                     
        }        

        //resultado = resultado > 0 ? resultado : 0;
        //return this.redondearMenorValor(resultado);
        return resultado > 0 ? resultado : 0;        
    }

}
