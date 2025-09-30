const sql = require('mssql');
const { ConfidentialClientApplication } = require('@azure/msal-node');

class DatabaseConnection {
  constructor() {
    this.config = {
      server: process.env.SQL_SERVER,
      database: process.env.SQL_DATABASE,
      authentication: {
        type: 'azure-active-directory-service-principal-secret',
        options: {
          clientId: process.env.AZURE_CLIENT_ID,
          clientSecret: process.env.AZURE_CLIENT_SECRET,
          tenantId: process.env.AZURE_TENANT_ID,
        },
      },
    };

    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: this.config.authentication.options.clientId,
        clientSecret: this.config.authentication.options.clientSecret,
        authority: `https://login.microsoftonline.com/${this.config.authentication.options.tenantId}`,
      },
    });
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async getConnection() {
    try {
    console.log('🔐 Getting access token for SQL Server...');
    
    // Get access token for SQL Server using client credentials flow
    const tokenResponse = await this.msalInstance.acquireTokenByClientCredential({
      scopes: ['https://database.windows.net/.default'],
    });

      console.log('✅ Access token obtained');

      const config = {
        server: this.config.server,
        database: this.config.database,
        authentication: {
          type: 'azure-active-directory-access-token',
          options: {
            token: tokenResponse.accessToken,
          },
        },
        options: {
          encrypt: true,
          trustServerCertificate: false,
        },
      };

      console.log('🔌 Connecting to database...');
      const pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('✅ Database connection established');
      
      return pool;
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }

  async closeConnection(pool) {
    try {
      await pool.close();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

module.exports = DatabaseConnection;
