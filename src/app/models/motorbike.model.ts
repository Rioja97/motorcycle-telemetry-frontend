export interface MotorbikeDTO {
  id: number;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  initialMileage: number;
  userEmail?: string;
  userRole?: 'USER' | 'ADMIN';
}

export interface MileageUpdateDTO {
  currentKm: number;
}

export interface ComponentHealthResponseDTO {
  componentName: string;
  installedAtKm: number;
  lifespanKm: number;
  expirationKm: number;
  currentKm: number;
  remainingKm: number;
  status: 'OK' | 'WARNING' | 'REPLACE';
}

export interface MotorbikeHealthReportDTO {
  motorbikeInfo: string;
  currentKm: number;
  componentsHealth: ComponentHealthResponseDTO[];
}

export interface CatalogComponent {
  id: number;
  name: string;
  lifespanKm: number;
  installedComponents?: any[];
}

export interface InstallationRequestDTO {
  motorbikeId: number;
  catalogComponentId: number;
  installationMileage: number;
  installationDate: string;
}

export interface InstalledComponentResponseDTO {
  id: number;
  motorbikeInfo: string;
  componentName: string;
  installationMileage: number;
  installationDate: string;
}

export interface MaintenanceRequestDTO {
  motorbikeId: number;
  catalogComponentIds: number[];
  maintenanceDate: string;
  currentKm: number;
  description: string;
}

export interface MaintenanceResponseDTO {
  id: number;
  motorbikeInfo: string;
  userEmail: string;
  componentNames: string[];
  maintenanceDate: string;
  currentKm: number;
  description: string;
}

export interface AlertResponseDTO {
  id: number;
  motorbikeId: number;
  componentName: string;
  status: string;
  message: string;
  catalogComponentId: number;
}

export interface AdminResponseDTO {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface AdminRequestDTO {
  name: string;
  email: string;
  password?: string;
}