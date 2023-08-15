import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-camera-capture',
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.scss']
})
export class CameraCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  imageData: string | undefined;
  response: any | undefined;
  capturing: boolean = false;
  reset: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  initCamera() {
    const constraints = {
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }

  stopCamera() {
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  captureImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.imageData = canvas.toDataURL('image/jpeg');
    this.sendImageToAPI(this.imageData);

    this.capturing = true; // Display the captured image
    video.style.display = 'none';
  }

  captureAgain() {
    this.reset = true;
    this.clearResponse;
    this.capturing = false;
    this.imageData = undefined;
    this.initCamera();
    this.videoElement.nativeElement.style.display = 'block';
  }

  sendImageToAPI(imageData: string) {
    const apiUrl = 'http://13.233.140.130/face/detect'; // Replace with your API URL

    // Convert base64 image data to Blob
    const byteCharacters = atob(imageData.split(',')[1]);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: 'image/jpeg' });

    // Create FormData and append blob as image field
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    // Set headers
    const headers = new HttpHeaders({
      'Accept-Encoding': 'gzip, deflate, br',
      'accept': 'application/json',
      'Cache-Control': 'no-cache'
    });

    // Make the API request using HttpClient
    this.http.post(apiUrl, formData, { headers }).subscribe(
      (response) => {
        this.response = response;
        this.reset = false;
      },
      (error) => {
        console.error('Error sending image to API:', error);
      }
    );
  }

  getBoundaryBoxStyles(facialArea: any) {
    if (!facialArea) {
      return {};
    }

    const styles = {
      position: 'absolute',
      left: `${facialArea.x}px`,
      top: `${facialArea.y}px`,
      width: `${facialArea.w}px`,
      height: `${facialArea.h}px`,
      border: '2px solid green',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return styles;
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    // Check if capturing is false before capturing the image
    if (!this.capturing) {
      this.captureImage();
    } else {
      this.captureAgain();
    }
  }

  clearResponse(): void {
    this.response = null;
    this.reset = true;
  }

}
