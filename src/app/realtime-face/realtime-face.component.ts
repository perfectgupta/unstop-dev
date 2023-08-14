import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlazeFaceService } from '../blaze-face.service';

@Component({
  selector: 'app-realtime-face',
  templateUrl: './realtime-face.component.html',
  styleUrls: ['./realtime-face.component.scss']
})
export class RealtimeFaceComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor(private blazeFaceService: BlazeFaceService) {}

  async ngOnInit() {
    await this.blazeFaceService.loadModel();
    // this.startVideo();
    // this.startFaceDetection(); // Start real-time face detection
    this.startVideoAndFaceDetection(); // Start real-time face detection
  }

  // async startVideo() {
  //   const video = this.videoElement.nativeElement;
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     video.srcObject = stream;
  //   } catch (error) {
  //     console.error('Error accessing camera:', error);
  //   }
  // }

  // async startFaceDetection() {
  //   const canvas = this.canvasElement.nativeElement;
  //   const context = canvas.getContext('2d');

  //   if (!context) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }

  //   const video = this.videoElement.nativeElement;


  //   const detectFacesLoop = async () => {
  //     canvas.width = video.videoWidth; // Set canvas width to match video width
  //     canvas.height = video.videoHeight;
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //     const predictions = await this.blazeFaceService.detectFaces(imageData);
  //     // console.log(predictions);

  //     context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame again

  //     this.drawFaceBoxes(context, predictions);

  //     setTimeout(detectFacesLoop, 50); // Run the loop again after 1 second (1000 milliseconds)
  //   };

  //   video.addEventListener('play', () => {
  //     detectFacesLoop(); // Start the loop when the video is playing
  //   });
  // }

  async startVideoAndFaceDetection() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Could not get 2D context for canvas.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }

    video.addEventListener('play', () => {
      canvas.width = video.videoWidth; // Set canvas width to match video width
      canvas.height = video.videoHeight;

      const detectFacesLoop = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const predictions = await this.blazeFaceService.detectFaces(imageData);

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame again

        this.drawFaceBoxes(context, predictions);

        // requestAnimationFrame(detectFacesLoop); // Use requestAnimationFrame for smoother animation
      };

      // detectFacesLoop(); // Start the loop when the video is playing
      setInterval(detectFacesLoop, 50);
    });
  }


  drawFaceBoxes(context: CanvasRenderingContext2D, faces: any[]) {
    for (const face of faces) {
      const start = face.topLeft;
      const end = face.bottomRight;

      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.beginPath();
      context.rect(start[0], start[1], end[0] - start[0], end[1] - start[1]);
      context.stroke();
      const probability = face.probability;
      context.font = '12px Arial';
      context.fillStyle = 'red'; // Change text color to white
      // context.fillText(`P: ${probability}`, start[0], end[1] + 20);
      // context.font = '12px Arial';
      // context.fillStyle = 'red';

      const text = `P: ${probability}`;
      const textWidth = context.measureText(text).width;
      const textHeight = 12; // Assuming the font size is set in pixels

      const backgroundX = start[0];
      const backgroundY = end[1] + 20 - textHeight;
      const backgroundWidth = textWidth + 8; // Add padding to text width
      const backgroundHeight = textHeight;

      context.fillStyle = 'white'; // Background color
      context.fillRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight);

      context.fillStyle = 'red'; // Text color
      context.fillText(text, start[0] + 4, end[1] + 20);
    }
  }


}
