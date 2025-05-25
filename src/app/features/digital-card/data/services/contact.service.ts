import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientUsername: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  sendContactForm(formData: ContactFormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/send`, formData);
  }
}
