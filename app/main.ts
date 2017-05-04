import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';

const platform = platformBrowserDynamic();
if(window.location.origin==='https://muisca.dian.gov.co'){
	enableProdMode();
}

platform
	.bootstrapModule(AppModule)
	.catch((err: any) => console.error(err));
