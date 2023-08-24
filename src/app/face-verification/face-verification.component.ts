import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-face-verification',
  templateUrl: './face-verification.component.html',
  styleUrls: ['./face-verification.component.scss']
})
export class FaceVerificationComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  videoStream!: MediaStream;
  image1: string = '';
  image2: string = '';
  result: any = {};
  bothImagesCaptured: boolean = false;
  checkboxValue: boolean = false;

  ngAfterViewInit() {
    this.startCamera();
  }

  async startCamera() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.videoStream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  captureImage() {
    const canvas = document.createElement('canvas');
    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL('image/jpeg');

      if (!this.image1) {
        this.image1 = image;
      } else if (!this.image2) {
        this.image2 = image;
        console.log('Image 2 captured:', this.image2); // Add this line for debugging
        this.videoStream.getTracks().forEach(track => track.stop());
        this.bothImagesCaptured = true;
      }

      // Enable the "Capture Again" button and reset both images
      // if (this.image1 && this.image2) {
      //   console.log("ddx");
      //   this.image1 = '';
      //   this.image2 = '';
      //   this.result = {};
      // }
    } else {
      console.error('Failed to get canvas context');
    }
  }

  uploadImage(imageNumber: number, event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target?.result as string;
        if (imageNumber === 1 && !this.image1) {
          this.image1 = imageDataURL;
        } else if (imageNumber === 2 && !this.image2) {
          this.image2 = imageDataURL;
          this.bothImagesCaptured = true;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  resetImages() {
    this.image1 = '';
    this.image2 = '';
    this.result = {};
    this.bothImagesCaptured = false; // Reset the flag
    this.startCamera(); // Re-display the video element
  }


  sendImages(checkboxValue: boolean) {
    const formData = new FormData();
    formData.append('main', this.dataURItoBlob(this.image1), 'image1.jpg');
    formData.append('verifier', this.dataURItoBlob(this.image2), 'image2.jpg');

    // Replace this URL with your actual API endpoint
    if (checkboxValue) {
      var apiUrl = 'http://127.0.0.1:8086/face/verify2';
    } else {
      var apiUrl = 'http://127.0.0.1:8086/face/verify';
    }

    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data);
      this.result = data; // Update the result with API response
    })
    .catch(error => {
      console.error('API error:', error);
    });
  }

  getFaceBoxStyle(faceArea: any) {
    return {
      left: `${faceArea.x}px`,
      top: `${faceArea.y}px`,
      width: `${faceArea.w}px`,
      height: `${faceArea.h}px`,
    };
  }


  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
}
