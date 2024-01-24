import { Component } from '@angular/core';
import { Camera } from "web-gphoto2";

@Component({
  selector: 'app-pairing',
  standalone: true,
  imports: [],
  templateUrl: './pairing.component.html',
  styleUrl: './pairing.component.css'
})

export class PairingComponent {

  async connectCamera(device: any) {
    console.log(device)
    let camera = new Camera();
    try {
      await camera.connect();
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


}
