import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  private selectedFile: File | null = null;
  gifUrl: string | null = null;
  message: string | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = null;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('video', this.selectedFile);

      this.http.post<{ message: string, outputFilePath: string }>(`${environment.apiUrl}/convert`, formData)
        .subscribe({
          next: response => {
            this.message = null;
            this.message = response.message;
            this.gifUrl = `${environment.apiUrl}${response.outputFilePath}`;
          },
          error: error => {
            this.message = "An error occurred while converting the video.";
          }
        });
    } else {
      alert('No file selected or file does not meet the requirements.');
    }
  }
}
