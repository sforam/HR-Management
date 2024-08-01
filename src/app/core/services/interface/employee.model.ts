export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    employeeId: string;
    joiningDate: string;
    phone: string;
    company: string;
    departmentId: number;
    designationId: number;
    modulePermissions:  ModulePermission[]; // Adjust this if you have a specific type for ModulePermissions
  }

  
  export interface ModulePermission {
    id: number;
    moduleName: string;
    read: boolean;
    write: boolean;
    create: boolean;
    delete: boolean;
    import: boolean;
    export: boolean;
    employeeId: number;
  }
  

  // Define the ModalData interface
  export interface ModalData {
    isEditMode: boolean;
    employee: any; // Adjust type as necessary
  }
  