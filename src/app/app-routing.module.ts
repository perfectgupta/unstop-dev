import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraCaptureComponent } from './camera-capture/camera-capture.component';
import { FaceAnalyserComponent } from './face-analyser/face-analyser.component';
import { FaceExtractionComponent } from './face-extraction/face-extraction.component';
import { RealtimeFaceComponent } from './realtime-face/realtime-face.component';
import { FaceVerificationComponent } from './face-verification/face-verification.component';

// const routes: Routes = [];
const routes: Routes = [
  // { path: '', redirectTo: '/detect', pathMatch: 'full' },
  { path: 'detect', component: CameraCaptureComponent },
  { path: 'analyser', component: FaceAnalyserComponent },
  { path: 'extractor', component: FaceExtractionComponent },
  { path: 'realtime', component: RealtimeFaceComponent },
  { path: 'verifier', component: FaceVerificationComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
