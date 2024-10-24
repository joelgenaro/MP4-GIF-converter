import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  errorMessage: string | null = null;

  @ViewChild('videoElement', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.errorMessage = null;

    if (this.selectedFile) {
      const video = this.videoElement.nativeElement;
      video.src = URL.createObjectURL(this.selectedFile);
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('video', this.selectedFile);

      this.http.post<{ message: string, outputFilePath: string }>('http://localhost:3000/convert', formData)
        .subscribe({
          next: response => {
            this.errorMessage = null;
            this.gifUrl = `http://localhost:3000${response.outputFilePath}`;
          },
          error: error => {
            this.errorMessage = "An error occurred while converting the video.";
          }
        });
    } else {
      alert('No file selected or file does not meet the requirements.');
    }
  }
}
