import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Designation } from './interface/designation.model'; // Adjust the path as necessary
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private apiUrl = `${environment.apiUrl}/Designations`; // Adjust to your API endpoint

  constructor(private http: HttpClient) { }

  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(this.apiUrl);
  }

  // Example method to fetch a single designation by ID
  getDesignationById(id: number): Observable<Designation> {
    return this.http.get<Designation>(`${this.apiUrl}/${id}`);
  }

 
}
