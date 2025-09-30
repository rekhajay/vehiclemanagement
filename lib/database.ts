import sql from 'mssql';
import { ConfidentialClientApplication } from '@azure/msal-node';

interface DatabaseConfig {
  server: string;
  database: string;
  authentication: {
    type: 'azure-active-directory-service-principal-secret';
    options: {
      clientId: string;
      clientSecret: string;
      tenantId: string;
    };
  };
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private config: DatabaseConfig;
  private msalInstance: ConfidentialClientApplication;

  private constructor() {
    this.config = {
      server: process.env.SQL_SERVER!,
      database: process.env.SQL_DATABASE!,
      authentication: {
        type: 'azure-active-directory-service-principal-secret',
        options: {
          clientId: process.env.AZURE_CLIENT_ID!,
          clientSecret: process.env.AZURE_CLIENT_SECRET!,
          tenantId: process.env.AZURE_TENANT_ID!,
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

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getConnection(): Promise<sql.ConnectionPool> {
    try {
      // Get access token for SQL Server
      const tokenResponse = await this.msalInstance.acquireTokenSilent({
        scopes: ['https://database.windows.net/.default'],
        account: null,
      });

      const config: sql.config = {
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

      const pool = new sql.ConnectionPool(config);
      await pool.connect();
      return pool;
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }

  public async closeConnection(pool: sql.ConnectionPool): Promise<void> {
    try {
      await pool.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

export default DatabaseConnection;
