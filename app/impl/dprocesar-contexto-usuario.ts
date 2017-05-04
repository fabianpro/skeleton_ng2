/*
* http://usejsdoc.org/
*/
import { DProcesarRespuestaRest } from '@dian/core';
import { DContextoMuisca } from '@dian/core';

export class DProcesarContextoUsuario extends DProcesarRespuestaRest {

    respuesta: DContextoMuisca;
    constructor();
    constructor(dContextoMuisca: DContextoMuisca);
    constructor(dContextoMuisca?: DContextoMuisca) {
        if (dContextoMuisca){
            super(dContextoMuisca);
        } else {
            super();
        }
    }

}