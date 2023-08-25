import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-face-extraction',
  templateUrl: './face-extraction.component.html',
  styleUrls: ['./face-extraction.component.scss']
})
export class FaceExtractionComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  imageData: string | undefined;
  response: any | undefined;
  capturing: boolean = false;
  reset: boolean = true;
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initCamera();
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.stopCamera();
    this.isLoading = false;
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
        this.isLoading = false;
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
    this.isLoading = false;
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageData = e.target?.result as string;
        this.sendImageToAPI(this.imageData);
        this.capturing = true; // Display the uploaded image
        const video = this.videoElement.nativeElement;
        video.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  sendImageToAPI(imageData: string) {
    this.isLoading = true;
    const apiUrl = 'http://127.0.0.1:8086/face/detect'; // Replace with your API URL

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
        this.isLoading = false;
      },
      (error) => {
        console.error('Error sending image to API:', error);
        this.isLoading = false;
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
