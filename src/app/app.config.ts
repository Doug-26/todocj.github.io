import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideNativeDateAdapter } from '@angular/material/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "angular-todo-app-5d1ec", 
      appId: "1:102938392478:web:e420c7b5001d15f792488f", 
      storageBucket: "angular-todo-app-5d1ec.firebasestorage.app", 
      apiKey: "AIzaSyA73IEm3YBGPNeF_Oa_1Z-EfuaPhVrACBo", 
      authDomain: "angular-todo-app-5d1ec.firebaseapp.com", 
      messagingSenderId: "102938392478" 
    })), 
    provideFirestore(() => getFirestore()),
    provideNativeDateAdapter()
  ]
};
