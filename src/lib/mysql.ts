import { v4 as uuidv4 } from 'uuid';

// Configuração para usar exclusivamente a API real e o banco de dados

// URL base da API
const API_URL = 'http://192.168.0.115:3000/api';

// Helper function para fazer requisições à API
async function apiRequest(endpoint: string, method: string = 'GET', data?: any) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro na requisição à API:', error);
    return { data: null, error };
  }
}

// Helper function para executar queries (mantida para compatibilidade)
async function query(sql: string, params?: any[]) {
  console.error('Real database connection not implemented directly. Using API instead.');
  return { data: null, error: new Error('Database connection not implemented directly') };
}

// File storage implementation for real API
const fileStorage = {
  // Store file paths and their public URLs
  files: new Map<string, string>(),
  
  // Upload file to server
  async upload(bucket: string, path: string, file: File): Promise<{ error: Error | null }> {
    try {
      console.log(`Tentando fazer upload para ${API_URL}/upload com bucket=${bucket}, path=${path}`);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);
      formData.append('bucket', bucket);
      
      // Send the file to the server
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Upload result:', result);
      return { error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { error: error as Error };
    }
  },
  
  // Get public URL for a file
  getPublicUrl(bucket: string, path: string): { publicUrl: string } {
    // Return the URL where the file can be accessed
    return { publicUrl: `${API_URL}/files/${bucket}/${path}` };
  }
};

// MySQL client com interface similar ao Supabase
export const mysql_client = {
  // Database operations
  from: (table: string) => ({
    select: (columns: string) => ({
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        async execute() {
          const direction = ascending ? 'ASC' : 'DESC';
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}?order=${column}&direction=${direction}`);
        }
      }),
      async execute() {
        // Usando a API em vez de SQL direto
        return await apiRequest(`/${table}`);
      },
      eq: (column: string, value: any) => ({
        async execute() {
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}?${column}=${value}`);
        }
      })
    }),
    insert: (data: Record<string, any>) => ({
      async execute() {
        // Add UUID if id is not provided
        if (!data.id) {
          data.id = uuidv4();
        }
        
        // Usando a API em vez de SQL direto
        return await apiRequest(`/${table}`, 'POST', data);
      }
    }),
    update: (data: Record<string, any>) => ({
      eq: (column: string, value: any) => ({
        async execute() {
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}/${value}`, 'PUT', data);
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async execute() {
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}/${value}`, 'DELETE');
        }
      })
    })
  }),
  
  // Storage operations (simulated)
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        return await fileStorage.upload(bucket, path, file);
      },
      getPublicUrl: (path: string) => {
        return fileStorage.getPublicUrl(bucket, path);
      }
    })
  }
};