import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera } from "./build/camera";

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent {

  constructor(private elementRef: ElementRef) {
    this.previewMode = false;
    this.camera = new Camera();
    this.delay = new Promise(res => setTimeout(res, 2000));
    this.previewCanvas = elementRef.nativeElement.querySelector('canvas')
    this.captureCanvas = elementRef.nativeElement.querySelector('canvas')
  }

  @ViewChild('preview_canvas', { static: true })
  previewCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('capture_canvas', { static: true })
  captureCanvas: ElementRef<HTMLCanvasElement>;

  previewMode: boolean
  camera: any
  delay: any

  async connectCamera(device: any) {
    console.log(device)
    try {
      await this.camera.connect();
    } catch (e) {
      console.warn(e);
    }
  }

  selectDevice() {
    const filters: any = [];
    navigator.usb
      .requestDevice({ 'filters': filters })
      .then(device => this.connectCamera(device))
  }

  startPreview() {
    this.previewMode = true
    console.log(this.previewMode)
    this.streamPreview()
  }

  stopPreview() {
    this.previewMode = false
    console.log(this.previewMode)
  }

  async drawBlob(blob: Blob, canvas: ElementRef<HTMLCanvasElement>) {
    createImageBitmap(blob).then(imageBitmap => {
      // occio al punto di domanda
      canvas.nativeElement.getContext('2d')?.drawImage(imageBitmap, 0, 0, canvas.nativeElement.width, canvas.nativeElement.height)
    })
  }

  async streamPreview() {
    do {
      console.log('preview=', this.previewMode)
      if (this.camera) {
        try {
          let blob = await this.camera.capturePreviewAsBlob();
          await new Promise(resolve => requestAnimationFrame(resolve));
          this.drawBlob(blob, this.previewCanvas)
        } catch (err) {
          console.error('Could not refresh preview:', err);
        }
      }
      else {
        await this.delay(2000);
      }
    }
    while (this.previewMode == true)

  }

  async captureImage() {
    try {
      const capture_blob = await this.camera.captureImageAsFile();
      this.drawBlob(capture_blob, this.captureCanvas)
    }
    catch (err) {
      console.error('Could not capture image:', err);
    }

  }
}
