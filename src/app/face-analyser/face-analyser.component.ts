import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-face-analyser',
  templateUrl: './face-analyser.component.html',
  styleUrls: ['./face-analyser.component.scss']
})
export class FaceAnalyserComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  imageData: string | undefined;
  response: any | undefined;
  capturing: boolean = false;
  reset: boolean = true;

  gender_images = {
    "Woman": "",
    "Man": ""
  }

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


  EMOTION_IMAGES = {
    "happy": "https://em-content.zobj.net/source/microsoft-teams/363/slightly-smiling-face_1f642.png",
    "neutral": "https://em-content.zobj.net/source/microsoft-teams/363/neutral-face_1f610.png",
    "angry": "https://em-content.zobj.net/source/microsoft-teams/363/pouting-face_1f621.png",
    "disgust": "https://em-content.zobj.net/source/microsoft-teams/363/disguised-face_1f978.png",
    "fear": "https://em-content.zobj.net/source/microsoft-teams/363/fearful-face_1f628.png",
    "sad": "https://em-content.zobj.net/source/microsoft-teams/363/frowning-face_2639-fe0f.png",
    "surprise": "https://em-content.zobj.net/source/microsoft-teams/363/face-with-open-mouth_1f62e.png",
  };

  getEmotionImage(dominant_emotion: string) {
    return this.EMOTION_IMAGES[dominant_emotion as keyof typeof this.EMOTION_IMAGES] || "https://em-content.zobj.net/source/microsoft-teams/363/slightly-smiling-face_1f642.png"; // Add your default image URL here
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
    const apiUrl = 'http://13.233.168.88/face/analyse'; // Replace with your API URL

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

};
