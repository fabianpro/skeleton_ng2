import './rxjs-extensions';

// Imports Angular
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { Logger } from 'angular2-logger/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Compiler } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Imports Material / Visual Components
import { MaterialModule } from '@angular/material';
//import { BrowserAnimationsModule } from '@angular/animations';
//import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatepickerModule } from 'angular2-material-datepicker';

// Imports DIAN
import { DContextoMuiscaServicio } from '@dian/core';
import { DContextoMuiscaDesaServicio } from '@dian/core';
import { DLogger } from '@dian/core';
import { DLoggerConsola } from '@dian/core';
import { DLoggerAngular } from '@dian/core';
import { DFormularioServicio } from '@dian/api-formulario';
import { DNotificacionServicio } from '@dian-cmp/notificaciones';
import { DNotificacionesComponente } from '@dian-cmp/notificaciones';

// Import component
import { AppComponent } from './app.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { FirmaComponent } from './components/globales/firma/firma.component';
import { EncabezadoContenedorComponent } from './components/encabezado-contenedor/encabezado-contenedor.component';
import { EncabezadoSecundarioComponent } from './components/encabezado-secundario/encabezado-secundario.component';
import { CuerpoComponent } from './components/cuerpo/cuerpo.component';
import { PieComponent } from './components/pie/pie.component';
import { SpeedDialComponent } from './components/globales/speed-dial/speed-dial.component';

// Import Directives
import { FormatoMonedaDirective } from './directivas/formato-moneda.directive';
import { ValidadorRequireInputsDirective } from './directivas/validador-require-input.directive';

// Import Pipes
import { FormateoValorPipe } from './pipes/formateo-valor.pipe';

const is_desa = false;
const appRoutes: Routes = [
    { path: '', component: IngresoComponent },
    { path: 'ingreso', component: IngresoComponent },  
    { path: 'formulario', component: PrincipalComponent }
];


@NgModule({
    imports: [
        //Angular
        BrowserModule, 
        FormsModule,
        HttpModule, 
        JsonpModule, 
        RouterModule.forRoot(appRoutes),
        //Material
        MaterialModule,
        //NoopAnimationsModule,
        //BrowserAnimationsModule,
        FlexLayoutModule,
        DatepickerModule        
    ],
    declarations: [
        // Components
        AppComponent, 
        EncabezadoContenedorComponent, 
        EncabezadoSecundarioComponent, 
        CuerpoComponent, 
        PieComponent, 
        PrincipalComponent,
        IngresoComponent, 
        DNotificacionesComponente,
        FirmaComponent,
        SpeedDialComponent,
        // Directives
        FormatoMonedaDirective,
        ValidadorRequireInputsDirective,
        // Pipes        
        FormateoValorPipe
    ],
    providers: [
        CookieService, 
        Compiler,
        Logger,
        DNotificacionServicio,
        {
            provide: DLogger,
            useFactory: (logger:Logger) => {
                return new DLoggerAngular(logger);     
            },
            deps: [Logger]
        },
        {
            provide: DContextoMuiscaServicio,
            useFactory: (http:Http, cookieService:CookieService, compiler:Compiler,logger:DLogger,dNotificacionServicio:DNotificacionServicio) => {
                if (is_desa) {                   
                    return new DContextoMuiscaDesaServicio(http, cookieService, compiler,logger,dNotificacionServicio);                   
                } else {
                    return new DContextoMuiscaServicio(http, cookieService, compiler,logger,dNotificacionServicio);
                }
            },
            deps: [Http, CookieService, Compiler,DLogger,DNotificacionServicio]
        },
        {
            provide:  DFormularioServicio,
            useFactory: (contextoServicio:DContextoMuiscaServicio) => {
                return new DFormularioServicio(contextoServicio);    
            },
            deps: [DContextoMuiscaServicio]            
        },   
        { 
            provide: LOCALE_ID, 
            useValue: "es-ES" 
        },     
        FormateoValorPipe        
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        DNotificacionesComponente,
        FirmaComponent        
    ]
})
export class AppModule { }
