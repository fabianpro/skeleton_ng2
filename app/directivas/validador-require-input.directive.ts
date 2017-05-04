import { Directive, ElementRef, Renderer } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[validadorRequireInput]',
  providers: [{
  	provide: NG_VALIDATORS, 
  	useExisting: ValidadorRequireInputsDirective, 
  	multi: true
  }]
})
export class ValidadorRequireInputsDirective implements Validator  {

	public element: ElementRef;

	constructor(
		private el: ElementRef,
		private renderer: Renderer
	){
		this.element = el;
	}
	
	validate(control: AbstractControl): {[key: string]: any} {
		
		let nativeElement = this.element.nativeElement;		
		let nativeElementLabel = document.querySelector("label[for=" + nativeElement.id + "]");
		
		if(typeof control.value === 'string'){
			if (!control.value) {
				nativeElementLabel.innerHTML = nativeElementLabel.innerHTML + ' (Obligatorio)*';
				this.renderer.setElementStyle(nativeElementLabel, 'color', 'red');				
				this.renderer.setElementClass(nativeElement, 'input-error', true);	
				return {'validadorRequireInput' : true}
			} else {
				this.renderer.setElementStyle(nativeElementLabel, 'color', '');								
				this.renderer.setElementClass(nativeElement, 'input-error', false);	
				return null;
			}					
		}else{
			// Se agrega para hacer toda la validación del formulario de forma automatica con la propiedad formGroup del formulario
			// this.renderer.setElementAttribute(nativeElement, 'formControlName', nativeElement.id); 
			return null;
		}
	}

}