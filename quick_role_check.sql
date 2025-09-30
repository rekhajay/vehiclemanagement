-- =============================================
-- Quick Role Check for containerWizrdDbAccess
-- Run this in your SQL Database
-- =============================================

-- Quick check: Does the user exist?
SELECT 
    'User Exists' as 'Check',
    CASE 
        WHEN EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'containerWizrdDbAccess')
        THEN 'YES'
        ELSE 'NO'
    END as 'Result';

-- Quick check: What roles does it have?
SELECT 
    dp.name as 'User Name',
    r.name as 'Role Name',
    r.type_desc as 'Role Type'
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'containerWizrdDbAccess';

-- Quick check: Can it access the Vehicles table?
SELECT 
    'Vehicles Table Access' as 'Check',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM sys.database_permissions p
            JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
            JOIN sys.objects o ON p.major_id = o.object_id
            WHERE dp.name = 'containerWizrdDbAccess'
              AND o.name = 'Vehicles'
        ) THEN 'YES - Direct permissions'
        WHEN EXISTS (
            SELECT 1 FROM sys.database_role_members rm
            JOIN sys.database_principals dp ON rm.member_principal_id = dp.principal_id
            JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
            WHERE dp.name = 'containerWizrdDbAccess'
              AND r.name IN ('db_datareader', 'db_datawriter', 'db_owner')
        ) THEN 'YES - Role-based access'
        ELSE 'NO - No access found'
    END as 'Result';
