import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraCaptureComponent } from './camera-capture/camera-capture.component';
import { HttpClientModule } from '@angular/common/http';
import { FaceAnalyserComponent } from './face-analyser/face-analyser.component';
import { FaceExtractionComponent } from './face-extraction/face-extraction.component';
import { RealtimeFaceComponent } from './realtime-face/realtime-face.component';
import { FaceVerificationComponent } from './face-verification/face-verification.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraCaptureComponent,
    FaceAnalyserComponent,
    FaceExtractionComponent,
    RealtimeFaceComponent,
    FaceVerificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
