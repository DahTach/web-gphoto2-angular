import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera } from "./build/camera.js";

// new Worker(new URL('./build/libapi.worker.js', import.meta.url))
import initModule from './build/libapi.mjs';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

//export function rethrowIfCritical(err: any) {
//  if (err?.constructor !== Error) {
//    throw err;
//  }
//}
//
//const INTERFACE_CLASS = 6; // PTP
//const INTERFACE_SUBCLASS = 1; // MTP
//let ModulePromise: any
//
//export class CameraComponent {
//
//  #queue = Promise.resolve();
//  #context: any = null;
//
//  static showPicker(): Promise<void>;
//  static async showPicker() {
//    // @ts-ignore
//    await navigator.usb.requestDevice({
//      filters: [
//        {
//          classCode: INTERFACE_CLASS,
//          subclassCode: INTERFACE_SUBCLASS
//        }
//      ]
//    });
//  }
//
//  connect(): Promise<void>;
//  async connect() {
//    if (!ModulePromise) {
//      ModulePromise = initModule();
//    }
//    let Module = await ModulePromise;
//    this.#context = await new Module.Context();
//  }
//
//  disconnect(): Promise<void>;
//  async disconnect() {
//    if (this.#context && !this.#context.isDeleted()) {
//      this.#context.delete();
//    }
//  }
//
//  getConfig(): Promise<{
//    name: string;
//    info: string;
//    label: string;
//    readonly: boolean;
//  } & {
//    type: "window";
//    children: Record<string, import("./build/libapi.mjs").Config>;
//  } & {
//    type: "window";
//  }>;
//  async getConfig() {
//    return this.#schedule(context => context.configToJS());
//  }
//
//  getSupportedOps(): Promise<import("./build/libapi.mjs").SupportedOps>;
//  async getSupportedOps() {
//    if (this.#context) {
//      return await this.#context.supportedOps();
//    }
//    throw new Error('You need to connect to the camera first');
//  }
//
//
//  setConfigValue(name: string, value: string | number | boolean): Promise<void>;
//  async setConfigValue(name: string, value: string | number | boolean) {
//    let uiTimeout;
//    await this.#schedule(context => {
//      // This is terrible, yes... but some configs return too quickly before they're actually updated.
//      // We want to wait some time before updating the UI in that case, but not block subsequent ops.
//      uiTimeout = new Promise(resolve => setTimeout(resolve, 800));
//      return context.setConfigValue(name, value);
//    });
//    await uiTimeout;
//  }
//
//  capturePreviewAsBlob(): Promise<Blob>;
//  async capturePreviewAsBlob() {
//    return this.#schedule(context => context.capturePreviewAsBlob());
//  }
//  captureImageAsFile(): Promise<File>;
//  async captureImageAsFile() {
//    return this.#schedule(context => context.captureImageAsFile());
//  }
//  consumeEvents(): Promise<boolean>;
//  async consumeEvents() {
//    return this.#schedule(context => context.consumeEvents());
//  }
//
//  async #schedule(op: any) {
//    let res = this.#queue.then(() => op(this.#context));
//    this.#queue = res.catch(rethrowIfCritical);
//    return res;
//  }
//}
//
//

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
