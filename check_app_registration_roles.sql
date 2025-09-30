-- =============================================
-- Check Roles and Permissions for App Registration
-- App Registration: containerWizrdDbAccess
-- =============================================

-- 1. Check if the app registration user exists in the database
SELECT 
    name as 'User Name',
    type_desc as 'User Type',
    create_date as 'Created Date',
    modify_date as 'Modified Date'
FROM sys.database_principals 
WHERE name = 'containerWizrdDbAccess'
   OR name LIKE '%containerWizrdDbAccess%';

-- 2. Check all database roles assigned to the app registration
SELECT 
    dp.name as 'User Name',
    r.name as 'Role Name',
    r.type_desc as 'Role Type',
    r.create_date as 'Role Created'
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'containerWizrdDbAccess'
   OR dp.name LIKE '%containerWizrdDbAccess%';

-- 3. Check specific permissions granted to the app registration
SELECT 
    p.state_desc as 'Permission State',
    p.permission_name as 'Permission',
    p.class_desc as 'Permission Class',
    o.name as 'Object Name',
    o.type_desc as 'Object Type'
FROM sys.database_permissions p
LEFT JOIN sys.objects o ON p.major_id = o.object_id
LEFT JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
WHERE dp.name = 'containerWizrdDbAccess'
   OR dp.name LIKE '%containerWizrdDbAccess%';

-- 4. Check if the app registration has access to specific tables
SELECT 
    t.name as 'Table Name',
    p.state_desc as 'Permission State',
    p.permission_name as 'Permission'
FROM sys.tables t
LEFT JOIN sys.database_permissions p ON t.object_id = p.major_id
LEFT JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
WHERE (dp.name = 'containerWizrdDbAccess' OR dp.name LIKE '%containerWizrdDbAccess%')
  AND p.class_desc = 'OBJECT_OR_COLUMN';

-- 5. Check all database users and their roles (to see the app registration in context)
SELECT 
    dp.name as 'User Name',
    dp.type_desc as 'User Type',
    r.name as 'Role Name',
    r.type_desc as 'Role Type'
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.type IN ('S', 'E', 'X') -- SQL users, External users, External groups
ORDER BY dp.name, r.name;

-- 6. Check if the app registration can access the Vehicles table specifically
SELECT 
    'Vehicles Table Access' as 'Check',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM sys.database_permissions p
            JOIN sys.database_principals dp ON p.grantee_principal_id = dp.principal_id
            JOIN sys.objects o ON p.major_id = o.object_id
            WHERE dp.name = 'containerWizrdDbAccess'
              AND o.name = 'Vehicles'
              AND p.permission_name IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
        ) THEN 'YES - Has table permissions'
        WHEN EXISTS (
            SELECT 1 FROM sys.database_role_members rm
            JOIN sys.database_principals dp ON rm.member_principal_id = dp.principal_id
            JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
            WHERE dp.name = 'containerWizrdDbAccess'
              AND r.name IN ('db_datareader', 'db_datawriter', 'db_owner')
        ) THEN 'YES - Has role-based access'
        ELSE 'NO - No access found'
    END as 'Result';
