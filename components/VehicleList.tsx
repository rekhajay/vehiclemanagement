'use client';

import { Vehicle } from '@/types/vehicle';

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
}

export default function VehicleList({ vehicles, onEdit, onDelete }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <h3>No vehicles found</h3>
        <p>Click "Add New Vehicle" to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Make/Model</th>
            <th>Year</th>
            <th>VIN</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Mileage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <div>
                  <strong>{vehicle.make}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{vehicle.model}</small>
                </div>
              </td>
              <td>{vehicle.year}</td>
              <td>
                <code style={{ 
                  fontSize: '0.875rem', 
                  backgroundColor: '#f8f9fa', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '3px' 
                }}>
                  {vehicle.vin}
                </code>
              </td>
              <td>
                <div>
                  <div>{vehicle.ownerName}</div>
                  <small style={{ color: '#666' }}>{vehicle.ownerEmail}</small>
                  <br />
                  <small style={{ color: '#666' }}>{vehicle.ownerPhone}</small>
                </div>
              </td>
              <td>{vehicle.location}</td>
              <td>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: getEventTypeColor(vehicle.eventType),
                  color: 'white'
                }}>
                  {vehicle.eventType.charAt(0).toUpperCase() + vehicle.eventType.slice(1)}
                </span>
              </td>
              <td>{new Date(vehicle.eventDate).toLocaleDateString()}</td>
              <td>{vehicle.mileage ? vehicle.mileage.toLocaleString() : '-'}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEdit(vehicle)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(vehicle.id!)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getEventTypeColor(eventType: string): string {
  switch (eventType) {
    case 'registration':
      return '#28a745';
    case 'maintenance':
      return '#17a2b8';
    case 'accident':
      return '#dc3545';
    case 'inspection':
      return '#ffc107';
    case 'other':
      return '#6c757d';
    default:
      return '#6c757d';
  }
}
