import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mysql_client } from '@/lib/mysql';
import type { Playlist, Ponto } from '@/types';

interface UsePlaylistReturn {
  playlists: Playlist[] | undefined;
  isLoading: boolean;
  selectedPlaylist: Playlist | null;
  playlistPontos: Ponto[];
  selectPlaylist: (playlist: Playlist) => Promise<void>;
  closePlayer: () => void;
  handleFollow: (playlistId: string) => void;
}

export const usePlaylist = (): UsePlaylistReturn => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistPontos, setPlaylistPontos] = useState<Ponto[]>([]);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await mysql_client
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false })
        .execute();
      
      if (error) throw error;
      return data as Playlist[];
    }
  });

  const fetchPontos = useCallback(async (playlistId: string): Promise<Ponto[]> => {
    const { data, error } = await mysql_client
      .from('pontos')
      .select('*')
      .eq('playlist_id', playlistId)
      .execute();
    
    if (error) {
      console.error('Error fetching pontos:', error);
      return [];
    }
    return (data as Ponto[]) || [];
  }, []);

  const selectPlaylist = useCallback(async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    const pontos = await fetchPontos(playlist.id);
    setPlaylistPontos(pontos);
  }, [fetchPontos]);

  const closePlayer = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistPontos([]);
  }, []);

  const handleFollow = useCallback((playlistId: string) => {
    console.log('Follow playlist:', playlistId);
  }, []);

  return {
    playlists,
    isLoading,
    selectedPlaylist,
    playlistPontos,
    selectPlaylist,
    closePlayer,
    handleFollow,
  };
};
