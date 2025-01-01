/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/three-men.config';
import { AppComponent } from './app/three-men.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
