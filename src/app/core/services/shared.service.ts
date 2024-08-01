import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalData } from './interface/employee.model'; 

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private employeeAddedSource = new BehaviorSubject<void>(undefined);
  private employeeUpdatedSource = new BehaviorSubject<void>(undefined);
  private modalDataSource = new BehaviorSubject<ModalData | null>(null);

  employeeAdded$ = this.employeeAddedSource.asObservable();
  employeeUpdated$ = this.employeeUpdatedSource.asObservable();
  modalData$ = this.modalDataSource.asObservable();


  
  constructor() { }

  notifyEmployeeAdded(): void {
    this.employeeAddedSource.next();
  }

  notifyEmployeeUpdated(): void {
    this.employeeUpdatedSource.next();
  }

  openModal(data: ModalData): void {
    this.modalDataSource.next(data);
    console.log("Opening modal with data:", data);
  }

  closeModal(): void {
    this.modalDataSource.next(null);
  }
}
export { ModalData };

