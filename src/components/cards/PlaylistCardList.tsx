import React from 'react';
import PlaylistCard from './PlaylistCard';
import type { Playlist } from '@/types';

interface PlaylistCardListProps {
  playlists: Playlist[] | undefined;
  isLoading: boolean;
  onFollow: (playlistId: string) => void;
  onPlay: (playlist: Playlist) => void;
}

const PlaylistCardList: React.FC<PlaylistCardListProps> = ({ 
  playlists, 
  isLoading, 
  onFollow, 
  onPlay 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">Carregando playlists...</p>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-xl mb-4">Nenhuma playlist disponível no momento.</p>
        <p className="text-gray-500">As novas playlists aparecerão aqui quando forem adicionadas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 max-w-[1800px] mx-auto">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onFollow={onFollow}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
};

export default PlaylistCardList;
