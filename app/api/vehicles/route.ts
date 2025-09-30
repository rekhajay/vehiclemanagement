import { NextRequest, NextResponse } from 'next/server';
import DatabaseConnection from '@/lib/database.js';
import { CreateVehicleRequest, Vehicle } from '@/types/vehicle';

const db = DatabaseConnection.getInstance();

export async function GET() {
  let pool;
  try {
    pool = await db.getConnection();
    
    const result = await pool.request().query(`
      SELECT 
        Id, Make, Model, Year, VIN, OwnerName, OwnerEmail, OwnerPhone,
        Location, EventType, EventDate, EventDescription, Mileage,
        CreatedAt, UpdatedAt
      FROM Vehicles 
      ORDER BY CreatedAt DESC
    `);

    const vehicles: Vehicle[] = result.recordset.map(row => ({
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
    }));

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await db.closeConnection(pool);
    }
  }
}

export async function POST(request: NextRequest) {
  let pool;
  try {
    const body: CreateVehicleRequest = await request.json();
    
    // Validate required fields
    if (!body.make || !body.model || !body.year || !body.vin || 
        !body.ownerName || !body.ownerEmail || !body.ownerPhone || 
        !body.location || !body.eventType || !body.eventDate || !body.eventDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    pool = await db.getConnection();
    
    const result = await pool.request()
      .input('make', body.make)
      .input('model', body.model)
      .input('year', body.year)
      .input('vin', body.vin)
      .input('ownerName', body.ownerName)
      .input('ownerEmail', body.ownerEmail)
      .input('ownerPhone', body.ownerPhone)
      .input('location', body.location)
      .input('eventType', body.eventType)
      .input('eventDate', new Date(body.eventDate))
      .input('eventDescription', body.eventDescription)
      .input('mileage', body.mileage || null)
      .query(`
        INSERT INTO Vehicles (Make, Model, Year, VIN, OwnerName, OwnerEmail, OwnerPhone, 
                             Location, EventType, EventDate, EventDescription, Mileage)
        OUTPUT INSERTED.Id, INSERTED.CreatedAt, INSERTED.UpdatedAt
        VALUES (@make, @model, @year, @vin, @ownerName, @ownerEmail, @ownerPhone, 
                @location, @eventType, @eventDate, @eventDescription, @mileage)
      `);

    const newVehicle: Vehicle = {
      id: result.recordset[0].Id,
      make: body.make,
      model: body.model,
      year: body.year,
      vin: body.vin,
      ownerName: body.ownerName,
      ownerEmail: body.ownerEmail,
      ownerPhone: body.ownerPhone,
      location: body.location,
      eventType: body.eventType,
      eventDate: new Date(body.eventDate),
      eventDescription: body.eventDescription,
      mileage: body.mileage,
      createdAt: new Date(result.recordset[0].CreatedAt),
      updatedAt: new Date(result.recordset[0].UpdatedAt),
    };

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await db.closeConnection(pool);
    }
  }
}
