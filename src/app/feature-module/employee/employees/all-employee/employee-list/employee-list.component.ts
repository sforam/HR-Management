import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { DepartmentService } from 'src/app/core/services/department.service'; 
import { DesignationService } from 'src/app/core/services/designation.service';
// import { SharedService } from 'src/app/core/services/shared.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Department } from 'src/app/core/services/interface/department.model'; 
import { Designation } from 'src/app/core/services/interface/designation.model';

import { MatDialog } from '@angular/material/dialog';

import { Employee } from 'src/app/core/services/interface/employee.model';

import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import { SharedService } from 'src/app/core/services/shared.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  
  dataSource: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'employeeId', 'email', 'phone', 'joiningDate', 'designationId', 'actions'];
  selectedEmployee: Employee | null = null;
  designations: Designation[] = [];
  selected: string = '';
  public searchEmployeeId = '';
  public searchEmployeeName = '';
  totalData = 0;
  public currentPage = 1;
  public pageSize = 10;
  public pageNumberArray: number[] = [];
  private employeeAddedSubscription!: Subscription;
  private  employeeUpdatedSubscription!:Subscription;

  
  showModal = false; // To control modal visibility
  modalData: any = {}; // To pass data to the modal
  @ViewChild('paginator') paginator!: any;
 
  routes = {
    adminDashboard: '/admin-dashboard' // Replace with your actual route path
  };


  constructor(
   
    private employeeService: EmployeeService,
    private designationService: DesignationService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
    this.loadEmployees();

    // Subscribe to the employeeAdded$ observable to refresh the list when notified
    this.employeeAddedSubscription = this.employeeService.employeeAdded$.subscribe(() => {
      this.loadEmployees();
    });


    this.employeeUpdatedSubscription = this.employeeService.employeeUpdated$.subscribe(() => {
      this.loadEmployees();
    });
    

  }
  
  // ngAfterViewInit(): void {
  //   if (this.paginator) {
  //     this.dataSource.paginator = this.paginator;
  //     this.paginator.page.subscribe((event: PageEvent) => {
  //       this.getMoreData(event);
  //     });
  //   }
  // }
  
  ngOnDestroy(): void {
    if (this.employeeAddedSubscription) {
      this.employeeAddedSubscription.unsubscribe();

    }
    if(this.employeeUpdatedSubscription){
      this.employeeUpdatedSubscription.unsubscribe();
    }
  }

 
  loadEmployees(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    this.employeeService.getEmployees(pageIndex, pageSize, this.searchEmployeeId, this.searchEmployeeName).subscribe({
      next: (response: any) => {
        const employees = response.$values || response;
        if (Array.isArray(employees)) {
          this.dataSource = employees;
          this.totalData = employees.length;
          this.updatePagination();
        } else {
          console.error('Expected an array but got:', employees);
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error.message || error);
        // Optional: Provide user feedback here
      }
    });
  }

  
  loadDesignations(): void {
    this.designationService.getDesignations().subscribe(
      (data: any) => {
        console.log('API response for designations:', data);
        this.designations = Array.isArray(data) ? data : data.$values || [];
        console.log('Designations loaded:', this.designations);
      },
      error => {
        console.error('Error loading designations', error);
        this.designations = [];
      }
    );
  }

    applyFilter(): void {
      this.currentPage = 1; // Reset to the first page on filter change
      this.loadEmployees();
    }

    changePageSize(event: PageEvent): void {
      this.pageSize = event.pageSize; // Update pageSize
      this.currentPage = event.pageIndex; // Update currentPage
      this.loadEmployees(this.currentPage, this.pageSize);
    }
  
  sortData(sort: Sort): void {
    const sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
    // Implement sorting logic if needed
    this.loadEmployees(0, this.pageSize);
  }
  
  openAddEmployeeModal(): void {
    console.log('Opening Add Employee Modal');
    this.modalData = { isEditMode: false, employee: {} }; 
    
    this.showModal = true;
    
  }
  
  editEmployee(employeeId: number): void {
    console.log('Opening EDit Employee Modal');
    this.employeeService.getEmployee(employeeId).subscribe(
      data => {
        console.log('Employee data received:', data);
        const modalData = { isEditMode: true, employee: data };
        this.sharedService.openModal(modalData);
        
      },
      error => {
        console.error('Error fetching employee:', error);
      }
    );
  }
  closeModal(): void {
    this.showModal = false;
    this.modalData = {}; // Clear modal data
  }


   onSave(): void {
    if (this.modalData.isEditMode) {
      // For editing existing employee
      this.employeeService.updateEmployee(this.modalData.employee).subscribe(() => {
        this.onModalSave('saved');
       
      });
    } else {
      // For adding new employee
      this.employeeService.addEmployee(this.modalData.employee).subscribe(() => {
        this.onModalSave('saved');
      
      });
    }
  }
  
 
  onModalSave(result: any): void {
    console.log('Modal closed with result:', result);
    if (result === 'saved') {
      this.loadEmployees();
    }
    this.closeModal();
  }
   
  getMoreData(event: PageEvent): void { 
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.loadEmployees(pageIndex, pageSize);
  }


  // confirmDelete(employee: Employee): void {
  //   if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
  //     this.deleteEmployee(employee.id);
  //   }
  // }

  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
      timer: 3000
    });
  }

  showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      showConfirmButton: true,
      timer: 3000
    });
  }

  deleteEmployee(employeeId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(employeeId).subscribe(
          () => {
            this.showSuccessAlert('Employee deleted successfully!');
            this.loadEmployees();
          },
          (error) => {
            this.showErrorAlert('Failed to delete employee. Please try again.');
            console.error('Error deleting employee:', error);
          }
        );
      }
    });
  }


  moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadEmployees(pageNumber - 1); // Page number is 1-based, index is 0-based
  }


    updatePagination(): void {
    const totalPages = Math.ceil(this.totalData / this.pageSize);
    this.pageNumberArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getDesignationName(id: number): string {
    const designation = this.designations.find(d => d.id === id);
    return designation ? designation.name : 'N/A'; // 'N/A' if designation is not found
  }
  

  get displayRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalData);
    return `Showing ${start} to ${end} of ${this.totalData} entries`;
  }
}
