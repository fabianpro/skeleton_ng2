//Imports Angular
import { Pipe, PipeTransform } from "@angular/core";

const PADDING = "000000";

@Pipe({
    name: "formateoValor"
})
/**
* @class FormateoValorPipe
* @implements PipeTransform
*/
export class FormateoValorPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    /**
    * @constructor
    */
    constructor() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = ".";
        this.THOUSANDS_SEPARATOR = ",";
    }

    /**
    * @desc Function of interface for transform a value
    * @param {Number|String} value
    * @param {Number} fractionSize
    * @return {String}
    */
    public transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "").toString().split(this.DECIMAL_SEPARATOR);
        fraction = fractionSize > 0 ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize) : "";
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
        return integer === '' ? '0' : integer;
    }

    /**
    * @desc Function of interface for transform a value
    * @param {String} value
    * @param {Number} fractionSize
    * @return {String}
    */
    public parse(value: string, fractionSize: number = 2): string {
        let [integer, fraction = ""] = (value || "").split(this.DECIMAL_SEPARATOR);
        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");
        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";
        return integer;
    }
}
