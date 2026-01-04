import { API_BASE_URL } from '@/constants/api';

/**
 * Build the correct audio URL based on the path format
 */
export const buildAudioUrl = (audioPath: string): string => {
  if (!audioPath) return '';
  
  // If already a full URL, return as is
  if (audioPath.startsWith('http')) {
    return audioPath;
  }
  
  // If starts with /, prepend API base
  if (audioPath.startsWith('/')) {
    return `${API_BASE_URL}${audioPath}`;
  }
  
  // Check if path includes folder info
  if (audioPath.includes('/imagens/')) {
    return `${API_BASE_URL}/api/files/${audioPath}`;
  }
  
  // If it's an MP3 file
  if (audioPath.endsWith('.mp3')) {
    if (audioPath.includes('/')) {
      return `${API_BASE_URL}/api/files/${audioPath}`;
    }
    // Default to audios folder
    return `${API_BASE_URL}/api/files/audios/${audioPath}`;
  }
  
  // Extract filename and try audios folder
  const fileName = audioPath.split('/').pop();
  return `${API_BASE_URL}/api/files/audios/${fileName}`;
};

/**
 * Build alternative audio URL (fallback for images folder)
 */
export const buildAlternativeAudioUrl = (currentUrl: string): string => {
  if (currentUrl.includes('/audios/')) {
    const fileName = currentUrl.split('/').pop();
    return `${API_BASE_URL}/api/files/imagens/${fileName}`;
  }
  return currentUrl;
};
