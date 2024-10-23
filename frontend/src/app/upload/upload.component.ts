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

      video.onloadedmetadata = () => {
        if (video.videoWidth > 1024 || video.videoHeight > 768) {
          this.errorMessage = 'Video dimensions should not exceed 1024x768.';
          this.selectedFile = null;
        } else if (video.duration > 10) {
          this.errorMessage = 'Video duration should not exceed 10 seconds.';
          this.selectedFile = null;
        }
      };
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('video', this.selectedFile);

      this.http.post('http://localhost:3000/convert', formData, { responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');

          this.gifUrl = url;

          a.href = url;
          a.download = 'output.gif';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    } else {
      alert('No file selected or file does not meet the requirements.');
    }
  }
}
