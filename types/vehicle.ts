export interface Vehicle {
  id?: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  location: string;
  eventType: 'registration' | 'maintenance' | 'accident' | 'inspection' | 'other';
  eventDate: Date;
  eventDescription: string;
  mileage?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  vin: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  location: string;
  eventType: 'registration' | 'maintenance' | 'accident' | 'inspection' | 'other';
  eventDate: string;
  eventDescription: string;
  mileage?: number;
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  id: number;
}
