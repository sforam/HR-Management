import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ToasterService } from './core/services/toaster/toaster.service';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'; 

import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
   
    ReactiveFormsModule
  ],
  providers: [ToasterService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
