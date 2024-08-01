import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModulePermission } from './interface/module-permission.model'; // Adjust the path as needed
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulePermissionService {
  private apiUrl =   `${environment.apiUrl}/Employees`;// Replace with your API URL

  constructor(private http: HttpClient) { }

  
}
