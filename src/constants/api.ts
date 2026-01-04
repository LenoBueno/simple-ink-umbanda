// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.115:3000';

export const API_ENDPOINTS = {
  FILES: '/api/files',
  PLAYLISTS: '/api/playlists',
  PONTOS: '/api/pontos',
  UPLOAD: '/api/upload',
} as const;

// Build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/api${endpoint}`;
};

// Build file URL
export const buildFileUrl = (bucket: string, path: string): string => {
  return `${API_BASE_URL}/api/files/${bucket}/${path}`;
};
