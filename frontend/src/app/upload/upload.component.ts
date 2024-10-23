import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'] // Corrected from styleUrl to styleUrls
})
export class UploadComponent {
  private selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('video', this.selectedFile);

      this.http.post('http://localhost:3000/convert', formData, { responseType: 'blob' })
        .subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'output.gif';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    } else {
      alert('No file selected');
    }
  }
}
