/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './three-men/three-men.config';
import { AppComponent } from './three-men/three-men.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
