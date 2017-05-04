/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
      'angular2-logger': 'node_modules/angular2-logger',
      '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
      '@angular/flex-layout' : 'npm:@angular/flex-layout/bundles/flex-layout.umd.js',
      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'angular2-cookie': 'npm:angular2-cookie',
      'angular2-material-datepicker': 'npm:angular2-material-datepicker',
      // CORE DIAN
      '@dian/core': 'npm:@dian/core',
      '@dian/api-identidad': 'npm:@dian/api-identidad',
      '@dian/api-firma': 'npm:@dian/api-firma',
      '@dian/api-rut': 'npm:@dian/api-rut',
      '@dian/api-formulario': 'npm:@dian/api-formulario',
      '@dian-cmp/notificaciones': 'npm:@dian-cmp/notificaciones'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular2-cookie': {
          main: './core.js',
          defaultExtension: 'js'
        },
      'angular2-material-datepicker': {
    	  main: './index.js',
        defaultExtension: 'js'
      },
      'angular2-logger': { 
        defaultExtension: 'js' 
      },
      '@dian/core': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      },
      '@dian/api-identidad': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      },
      '@dian/api-firma': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      },
      '@dian/api-rut': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      },
      '@dian/api-formulario': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      },
      '@dian-cmp/notificaciones': { 
        main: 'index.js', 
        defaultExtension: 'js' 
      }
    }
  });
})(this);
