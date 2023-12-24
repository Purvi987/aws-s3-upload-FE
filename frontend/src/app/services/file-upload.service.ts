import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = 'http://localhost:3000/api';
  private headers = {
    "Content-Type": "multipart/form-data"
  }

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  uploadFile(url:any, file: any) {
    return this.http.put(url, file, {headers : this.headers});
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  getPreSignUrl(): Observable<any> {
    return this.http.get(`${this.baseUrl}/image-url`);
  }

  geListImage() : Observable<any> {
    return this.http.get(`${this.baseUrl}/album`);
  }
}
