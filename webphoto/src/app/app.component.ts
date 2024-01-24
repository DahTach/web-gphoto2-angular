import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PairingComponent } from './pairing/pairing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PairingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webphoto';
}

