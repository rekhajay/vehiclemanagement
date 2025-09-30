'use client';

import { useState, useEffect } from 'react';
import { Vehicle, CreateVehicleRequest } from '@/types/vehicle';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (data: CreateVehicleRequest) => void;
  onClose: () => void;
}

export default function VehicleForm({ vehicle, onSubmit, onClose }: VehicleFormProps) {
  const [formData, setFormData] = useState<CreateVehicleRequest>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    location: '',
    eventType: 'registration',
    eventDate: new Date().toISOString().split('T')[0],
    eventDescription: '',
    mileage: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        ownerName: vehicle.ownerName,
        ownerEmail: vehicle.ownerEmail,
        ownerPhone: vehicle.ownerPhone,
        location: vehicle.location,
        eventType: vehicle.eventType,
        eventDate: vehicle.eventDate.toISOString().split('T')[0],
        eventDescription: vehicle.eventDescription,
        mileage: vehicle.mileage,
      });
    }
  }, [vehicle]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Year must be between 1900 and next year';
    }
    if (!formData.vin.trim() || formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be exactly 17 characters';
    }
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail.trim() || !/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Valid email is required';
    }
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Owner phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventDescription.trim()) newErrors.eventDescription = 'Event description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? parseInt(value) || undefined : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Make *</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Toyota"
            />
            {errors.make && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.make}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Camry"
            />
            {errors.model && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.model}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="form-input"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            {errors.year && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.year}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">VIN *</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="form-input"
              placeholder="17-character VIN"
              maxLength={17}
            />
            {errors.vin && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.vin}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="form-input"
              placeholder="Full name"
            />
            {errors.ownerName && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.ownerName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Owner Email *</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              className="form-input"
              placeholder="email@example.com"
            />
            {errors.ownerEmail && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.ownerEmail}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Owner Phone *</label>
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              className="form-input"
              placeholder="(555) 123-4567"
            />
            {errors.ownerPhone && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.ownerPhone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="City, State"
            />
            {errors.location && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.location}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Event Type *</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="form-input"
            >
              <option value="registration">Registration</option>
              <option value="maintenance">Maintenance</option>
              <option value="accident">Accident</option>
              <option value="inspection">Inspection</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Event Date *</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="form-input"
            />
            {errors.eventDate && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.eventDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Event Description *</label>
            <textarea
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Describe the event..."
            />
            {errors.eventDescription && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.eventDescription}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Mileage (optional)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Current mileage"
              min="0"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {vehicle ? 'Update Vehicle' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
