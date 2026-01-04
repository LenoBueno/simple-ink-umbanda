import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PlaylistCardList from '@/components/cards/PlaylistCardList';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { usePlaylist } from '@/hooks/usePlaylist';
import '@/styles/card.css';

const Pontos: React.FC = () => {
  const {
    playlists,
    isLoading,
    selectedPlaylist,
    playlistPontos,
    selectPlaylist,
    closePlayer,
    handleFollow,
  } = usePlaylist();

  return (
    <PageLayout className="p-6 md:p-25 pt-72 mt-12" showFooter={true}>
      <PlaylistCardList
        playlists={playlists}
        isLoading={isLoading}
        onFollow={handleFollow}
        onPlay={selectPlaylist}
      />

      {selectedPlaylist && (
        <AudioPlayer
          playlist={selectedPlaylist}
          pontos={playlistPontos}
          onClose={closePlayer}
        />
      )}
    </PageLayout>
  );
};

export default Pontos;
