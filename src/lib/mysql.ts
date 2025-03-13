import { v4 as uuidv4 } from 'uuid';
import { mockPlaylists, mockPontos } from '../data/mockData';

// Configuração para determinar se usamos dados mockados ou a API real
let useMockData = true; // Alterado para true para usar dados mockados enquanto o banco de dados não estiver configurado

// URL base da API
const API_URL = 'http://localhost:3000/api';

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
    // Se a API estiver indisponível, ativar automaticamente os dados mockados
    useMockData = true;
    console.log('API indisponível, usando dados mockados como fallback');
    
    // Retornar dados mockados com base no endpoint
    if (endpoint.includes('/playlists')) {
      return { data: mockPlaylists, error: null };
    } else if (endpoint.includes('/pontos')) {
      return { data: mockPontos, error: null };
    }
    
    return { data: null, error };
  }
}

// Helper function para executar queries (mantida para compatibilidade)
async function query(sql: string, params?: any[]) {
  if (useMockData) {
    console.log('Using mock data instead of database query');
    return { data: [], error: null };
  }
  
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
          if (useMockData) {
            console.log(`Using mock data for: SELECT ${columns} FROM ${table}`);
            if (table === 'playlists') return { data: mockPlaylists, error: null };
            if (table === 'pontos') return { data: mockPontos, error: null };
            return { data: [], error: null };
          }
          
          const direction = ascending ? 'ASC' : 'DESC';
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}?order=${column}&direction=${direction}`);
        }
      }),
      async execute() {
        if (useMockData) {
          console.log(`Using mock data for: SELECT ${columns} FROM ${table}`);
          if (table === 'playlists') return { data: mockPlaylists, error: null };
          if (table === 'pontos') return { data: mockPontos, error: null };
          return { data: [], error: null };
        }
        
        // Usando a API em vez de SQL direto
        return await apiRequest(`/${table}`);
      },
      eq: (column: string, value: any) => ({
        async execute() {
          if (useMockData) {
            console.log(`Using mock data for: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
            if (table === 'playlists') {
              const filtered = mockPlaylists.filter(item => item[column] === value);
              return { data: filtered, error: null };
            }
            if (table === 'pontos') {
              const filtered = mockPontos.filter(item => item[column] === value);
              return { data: filtered, error: null };
            }
            return { data: [], error: null };
          }
          
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}?${column}=${value}`);
        }
      })
    }),
    insert: (data: Record<string, any>) => ({
      async execute() {
        if (useMockData) {
          console.log(`Mock insert into ${table}:`, data);
          return { data: { id: uuidv4() }, error: null };
        }
        
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
          if (useMockData) {
            console.log(`Mock update ${table} where ${column}=${value}:`, data);
            return { data: null, error: null };
          }
          
          // Usando a API em vez de SQL direto
          return await apiRequest(`/${table}/${value}`, 'PUT', data);
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async execute() {
          if (useMockData) {
            console.log(`Mock delete from ${table} where ${column}=${value}`);
            return { data: null, error: null };
          }
          
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