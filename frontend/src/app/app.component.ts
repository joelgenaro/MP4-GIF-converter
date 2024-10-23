import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, UploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Video-Gif';
}
