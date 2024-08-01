import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject,of, map, Observable } from 'rxjs';
import { Employee } from './interface/employee.model';
import { environment } from 'src/environments/environment';

import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/Employees`; 

   // Observable for notifying about added employees
   private employeeAddedSubject = new BehaviorSubject<void>(undefined);
   employeeAdded$ = this.employeeAddedSubject.asObservable();
 


   // Observable for notifying about updated employees
  private employeeUpdatedSubject = new BehaviorSubject<Employee | null>(null);
  employeeUpdated$ = this.employeeUpdatedSubject.asObservable();


  // Optional: You can define HTTP options such as headers here if needed
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Get all employees
 // employee.service.ts
 // Updated getEmployees method
getEmployees(pageIndex: number, pageSize: number, search: string, designation: string): Observable<any> {
  let params = new HttpParams()
    .set('pageIndex', pageIndex.toString())
    .set('pageSize', pageSize.toString())
    .set('search', search || '')
    .set('designation', designation || '');

  return this.http.get<any>(this.apiUrl, { params }).pipe(
    map(response => response.$values) // Extract the array of employees from the response
  );
}

// Get a specific employee by ID
getEmployee(id: number): Observable<Employee> {
  return this.http.get<Employee>(`${this.apiUrl}/${id}`);
}

  // Get a specific employee by ID


  // Add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, this.httpOptions).pipe(
      tap(() => this.notifyEmployeeAdded()), // Notify on successful add
      catchError(this.handleError<Employee>('addEmployee'))
    );
  }

  // Update an existing employee
  updateEmployee(employee: Employee): Observable<any> {
    const url = `${this.apiUrl}/${employee.id}`; // Ensure the employee ID is included here
    return this.http.put<any>(url, employee).pipe(
      tap(() => this.notifyEmployeeUpdated(employee)), // Notify on successful update
      catchError(this.handleError<any>('updateEmployee'))
    );
  }
  
  // Delete an employee by ID
  
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}`);
  }
  

  notifyEmployeeAdded(): void {
    this.employeeAddedSubject.next();
  }


  notifyEmployeeUpdated(employee: Employee): void {
    this.employeeUpdatedSubject.next(employee);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
