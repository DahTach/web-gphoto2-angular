/// <reference types="w3c-web-usb" />
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera } from '../../camera';
//import { Camera } from 'src/camera.js';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent {
  async selectDevice() {
    Camera.showPicker()
  }
}



//export class CameraComponent {
//
//  constructor(private elementRef: ElementRef) {
//    this.previewCanvas = elementRef.nativeElement.querySelector('canvas')
//    this.captureCanvas = elementRef.nativeElement.querySelector('canvas')
//  }
//
//  @ViewChild('preview_canvas', { static: true })
//  previewCanvas: ElementRef<HTMLCanvasElement>;
//  @ViewChild('capture_canvas', { static: true })
//  captureCanvas: ElementRef<HTMLCanvasElement>;
//
//  delay = new Promise(res => setTimeout(res, 2000));
//
//  camera: Camera = new Camera()
//
//  async cameraSelect() {
//    const filters: any = [];
//    await navigator.usb.requestDevice({ 'filters': filters }).then(device => this.connectCamera(device))
//  }
//
//  async connectCamera(device: any) {
//    console.log(device)
//    try {
//      await this.camera.connect();
//    } catch (e) {
//      console.warn(e);
//    }
//  }
//
//}
