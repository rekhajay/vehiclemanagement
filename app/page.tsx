'use client';

import { useState, useEffect } from 'react';
import { Vehicle, CreateVehicleRequest } from '@/types/vehicle';
import VehicleForm from '@/components/VehicleForm';
import VehicleList from '@/components/VehicleList';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (vehicleData: CreateVehicleRequest) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vehicle');
      }

      const newVehicle = await response.json();
      setVehicles([newVehicle, ...vehicles]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateVehicle = async (vehicleData: CreateVehicleRequest) => {
    if (!editingVehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update vehicle');
      }

      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
      setEditingVehicle(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete vehicle');
      }

      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading vehicles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Vehicle Management System - Mod5</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Vehicle
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}

        <VehicleList 
          vehicles={vehicles}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />
      </div>

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
