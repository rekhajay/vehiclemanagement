import { NextRequest, NextResponse } from 'next/server';
import DatabaseConnection from '@/lib/database.js';
import { UpdateVehicleRequest, Vehicle } from '@/types/vehicle';

const db = DatabaseConnection.getInstance();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    pool = await db.getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          Id, Make, Model, Year, VIN, OwnerName, OwnerEmail, OwnerPhone,
          Location, EventType, EventDate, EventDescription, Mileage,
          CreatedAt, UpdatedAt
        FROM Vehicles 
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const row = result.recordset[0];
    const vehicle: Vehicle = {
      id: row.Id,
      make: row.Make,
      model: row.Model,
      year: row.Year,
      vin: row.VIN,
      ownerName: row.OwnerName,
      ownerEmail: row.OwnerEmail,
      ownerPhone: row.OwnerPhone,
      location: row.Location,
      eventType: row.EventType,
      eventDate: new Date(row.EventDate),
      eventDescription: row.EventDescription,
      mileage: row.Mileage,
      createdAt: new Date(row.CreatedAt),
      updatedAt: new Date(row.UpdatedAt),
    };

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await db.closeConnection(pool);
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    const body: UpdateVehicleRequest = await request.json();
    
    pool = await db.getConnection();
    
    // Build dynamic update query based on provided fields
    const updateFields = [];
    const request = pool.request().input('id', id);

    if (body.make !== undefined) {
      updateFields.push('Make = @make');
      request.input('make', body.make);
    }
    if (body.model !== undefined) {
      updateFields.push('Model = @model');
      request.input('model', body.model);
    }
    if (body.year !== undefined) {
      updateFields.push('Year = @year');
      request.input('year', body.year);
    }
    if (body.vin !== undefined) {
      updateFields.push('VIN = @vin');
      request.input('vin', body.vin);
    }
    if (body.ownerName !== undefined) {
      updateFields.push('OwnerName = @ownerName');
      request.input('ownerName', body.ownerName);
    }
    if (body.ownerEmail !== undefined) {
      updateFields.push('OwnerEmail = @ownerEmail');
      request.input('ownerEmail', body.ownerEmail);
    }
    if (body.ownerPhone !== undefined) {
      updateFields.push('OwnerPhone = @ownerPhone');
      request.input('ownerPhone', body.ownerPhone);
    }
    if (body.location !== undefined) {
      updateFields.push('Location = @location');
      request.input('location', body.location);
    }
    if (body.eventType !== undefined) {
      updateFields.push('EventType = @eventType');
      request.input('eventType', body.eventType);
    }
    if (body.eventDate !== undefined) {
      updateFields.push('EventDate = @eventDate');
      request.input('eventDate', new Date(body.eventDate));
    }
    if (body.eventDescription !== undefined) {
      updateFields.push('EventDescription = @eventDescription');
      request.input('eventDescription', body.eventDescription);
    }
    if (body.mileage !== undefined) {
      updateFields.push('Mileage = @mileage');
      request.input('mileage', body.mileage);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('UpdatedAt = GETUTCDATE()');

    const result = await request.query(`
      UPDATE Vehicles 
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.Id, INSERTED.Make, INSERTED.Model, INSERTED.Year, INSERTED.VIN,
             INSERTED.OwnerName, INSERTED.OwnerEmail, INSERTED.OwnerPhone,
             INSERTED.Location, INSERTED.EventType, INSERTED.EventDate, 
             INSERTED.EventDescription, INSERTED.Mileage,
             INSERTED.CreatedAt, INSERTED.UpdatedAt
      WHERE Id = @id
    `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const row = result.recordset[0];
    const vehicle: Vehicle = {
      id: row.Id,
      make: row.Make,
      model: row.Model,
      year: row.Year,
      vin: row.VIN,
      ownerName: row.OwnerName,
      ownerEmail: row.OwnerEmail,
      ownerPhone: row.OwnerPhone,
      location: row.Location,
      eventType: row.EventType,
      eventDate: new Date(row.EventDate),
      eventDescription: row.EventDescription,
      mileage: row.Mileage,
      createdAt: new Date(row.CreatedAt),
      updatedAt: new Date(row.UpdatedAt),
    };

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await db.closeConnection(pool);
    }
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    pool = await db.getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query('DELETE FROM Vehicles WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await db.closeConnection(pool);
    }
  }
}
