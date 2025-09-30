-- Create Vehicles table
CREATE TABLE Vehicles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Make NVARCHAR(100) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    VIN NVARCHAR(17) NOT NULL UNIQUE,
    OwnerName NVARCHAR(200) NOT NULL,
    OwnerEmail NVARCHAR(255) NOT NULL,
    OwnerPhone NVARCHAR(20) NOT NULL,
    Location NVARCHAR(255) NOT NULL,
    EventType NVARCHAR(50) NOT NULL CHECK (EventType IN ('registration', 'maintenance', 'accident', 'inspection', 'other')),
    EventDate DATETIME2 NOT NULL,
    EventDescription NVARCHAR(MAX) NOT NULL,
    Mileage INT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Create index on VIN for faster lookups
CREATE INDEX IX_Vehicles_VIN ON Vehicles(VIN);

-- Create index on OwnerEmail for faster lookups
CREATE INDEX IX_Vehicles_OwnerEmail ON Vehicles(OwnerEmail);

-- Create index on EventDate for faster date range queries
CREATE INDEX IX_Vehicles_EventDate ON Vehicles(EventDate);
