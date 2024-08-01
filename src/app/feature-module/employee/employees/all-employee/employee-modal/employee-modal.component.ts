import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { DepartmentService } from 'src/app/core/services/department.service'; 
import { DesignationService } from 'src/app/core/services/designation.service';
import { Department } from 'src/app/core/services/interface/department.model'; 
import { Designation } from 'src/app/core/services/interface/designation.model';
import { Employee, ModulePermission } from 'src/app/core/services/interface/employee.model';
import { DatePipe } from '@angular/common';
import { SharedService ,ModalData} from 'src/app/core/services/shared.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class EmployeeModalComponent implements OnInit {
  
  public addEmployeeForm!: FormGroup;
  public departments: Department[] = [];
  public designations: Designation[] = [];
  public permissions = [
    { name: 'Holidays', read: true, write: false, create: false, delete: false, import: false, export: false },
    { name: 'Leaves', read: true, write: true, create: true, delete: false, import: false, export: false },
    { name: 'Clients', read: true, write: true, create: true, delete: false, import: false, export: false },
    { name: 'Projects', read: true, write: false, create: false, delete: false, import: false, export: false },
    { name: 'Tasks', read: true, write: true, create: true, delete: true, import: false, export: false },
    { name: 'Chats', read: true, write: true, create: true, delete: true, import: false, export: false },
    { name: 'Assets', read: true, write: true, create: true, delete: false, import: false, export: false },
    { name: 'Timing Sheets', read: true, write: true, create: true, delete: true, import: false, export: false }
  ];

  isEditMode: boolean = false;
  public employeeData: Employee | null = null;
  // @Output() close = new EventEmitter<void>();
  showModal: boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private router: Router
    
  ) {
    
  }

  ngOnInit(): void {
   
    
    this.initializeForm();
    this.loadDepartments();
    this.loadDesignations();
    this.sharedService.modalData$.subscribe((data: ModalData | null) => {
      if (data) {
        this.isEditMode = data.isEditMode;
        this.employeeData = data.employee;
        console.log("Employee data is", this.employeeData);
        this.initializeForm();
        this.showModal = true; // Open modal when data is received
      } else {
        this.showModal = false; // Close modal when data is null
      }
    });
  }

  closeModal(): void {
    this.sharedService.closeModal();
  }


  private initializeForm(): void {
    this.addEmployeeForm = this.formBuilder.group({
      FirstName: [this.employeeData?.firstName || '', [Validators.required]],
      LastName: [this.employeeData?.lastName || ''],
      UserName: [this.employeeData?.username || '', [Validators.required]],
      Password: ['', this.isEditMode ? [] : [Validators.required]],
      ConfirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
      DepartmentId: [this.employeeData?.departmentId || '', [Validators.required]],
      DesignationId: [this.employeeData?.designationId || '', [Validators.required]],
      Email: [this.employeeData?.email || '', [Validators.required, Validators.email]],
      Phone: [this.employeeData?.phone || ''],
      
      JoiningDate: [this.isEditMode ? this.datePipe.transform(this.employeeData?.joiningDate, 'dd/MM/yyyy') : '', [Validators.required]],
      Company: [this.employeeData?.company || '', [Validators.required]],
      EmployeeID: [this.employeeData?.employeeId || '', [Validators.required]],
      ModulePermissions: this.formBuilder.array([])
    }, { validator: this.passwordMatchValidator() });

    if (this.employeeData) {
      this.populateForm();
    } else {
      this.initializeModulePermissions(this.permissions.map(permission => ({
        id: 0,
        moduleName: permission.name,
        read: permission.read,
        write: permission.write,
        create: permission.create,
        delete: permission.delete,
        import: permission.import,
        export: permission.export,
        employeeId: 0
      })));
    }
  }

  private populateForm(): void {
    if (this.employeeData) {
      this.addEmployeeForm.patchValue({
        FirstName: this.employeeData.firstName,
        LastName: this.employeeData.lastName,
        UserName: this.employeeData.username,
        Email: this.employeeData.email,
        Phone: this.employeeData.phone,
        
        JoiningDate: this.datePipe.transform(this.employeeData.joiningDate, 'short'),
        Company: this.employeeData.company,
        EmployeeID: this.employeeData.employeeId,
        DepartmentId: this.employeeData.departmentId,
        DesignationId: this.employeeData.designationId
      });

      if (this.isEditMode) {
        this.addEmployeeForm.get('Password')?.clearValidators();
        this.addEmployeeForm.get('ConfirmPassword')?.clearValidators();
      }

      this.addEmployeeForm.updateValueAndValidity();
      this.initializeModulePermissions(this.employeeData.modulePermissions);
    } 
    
  } 
  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data?.$values || [];
        console.log('Departments loaded:', this.departments);
      },
      error => {
        console.error('Error loading departments', error);
      }
    );
  }

  private loadDesignations(): void {
    this.designationService.getDesignations().subscribe(
      (data: any) => {
        this.designations = data?.$values || [];
        console.log('Designations loaded:', this.designations);
      },
      error => {
        console.error('Error loading designations', error);
      }
    );
  }

  private initializeModulePermissions(permissions: any): void {
    // Check if the permissions object has a $values property
    const permissionsArray = Array.isArray(permissions) ? permissions : permissions?.$values || [];

    if (!Array.isArray(permissionsArray)) {
        console.error("Expected permissions to be an array but got:", permissions);
        return; // Exit if permissionsArray is not an array
    }
    
    const modulePermissionsArray = this.addEmployeeForm.get('ModulePermissions') as FormArray;
    modulePermissionsArray.clear();

    permissionsArray.forEach((permission: ModulePermission) => {
        modulePermissionsArray.push(this.formBuilder.group({
            id: [permission.id],
            moduleName: [permission.moduleName],
            read: [permission.read],
            write: [permission.write],
            create: [permission.create],
            delete: [permission.delete],
            import: [permission.import],
            export: [permission.export],
            employeeId: [permission.employeeId]
        }));
    });
}



  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const password = formGroup.get('Password')?.value;
      const confirmPassword = formGroup.get('ConfirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

 

  onSubmitAddEmployee(): void {
    console.log('Form submission triggered');
    if (this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;

      // Log employeeData to debug
      console.log('Employee data before submission:', employeeData);

      if (this.isEditMode) {
        // Ensure the id is included in the employee data for update
        const updatedEmployeeData = { ...employeeData, id: this.employeeData?.id };
        console.log("Employee ID for update:", updatedEmployeeData.id);

        if (!updatedEmployeeData.id) {
          console.error('Employee ID is missing');
          return;
        }

        // For updating an employee
        this.employeeService.updateEmployee(updatedEmployeeData).subscribe(
          response => {
            this.showSuccessAlert('Employee Updated successfully!');
            
            console.log('Employee updated successfully:', response);
            this.sharedService.notifyEmployeeUpdated();
            this.resetFormAndCloseModal();
           
            this.router.navigate(['/employees/employee-list']);
          },
          error => {
            console.error('Error updating employee:', error);
          }
        );
      } else {
        // For adding a new employee
        this.employeeService.addEmployee(employeeData).subscribe(
          response => {
            this.showSuccessAlert('Employee added successfully!');
            console.log('Employee added successfully:', response);
            this.sharedService.notifyEmployeeAdded();
          
            this.resetFormAndCloseModal();
           
            this.router.navigate(['/employees/employee-list']);
          },
          error => {
            console.error('Error adding employee:', error);
          }
        );
      }
    }
    else {
      this.addEmployeeForm.markAllAsTouched(); // Trigger validation display
    }
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


  




  resetFormAndCloseModal(): void {
    
    this.addEmployeeForm.reset();
    this.initializeForm();
    console.log("toggle modal",this.toggleModal() );
    //this.toggleModal();
    this.employeeData = null; 
  }
  toggleModal(): void {
    
      this.showModal = !this.showModal;
      this.isEditMode= false;
 
      this.addEmployeeForm.reset();  
    }


  get modulePermissions() {
    return this.addEmployeeForm.get('ModulePermissions') as FormArray;
  }
}
