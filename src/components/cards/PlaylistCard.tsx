import React, { useState } from 'react';
import type { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
  onFollow: (playlistId: string) => void;
  onPlay: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onFollow, onPlay }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`card ${isOpen ? 'is-open' : ''}`}
      onClick={() => setIsOpen((v) => !v)}
      role="button"
      tabIndex={0}
    >
      <div className="imgBx">
        <img
          src={playlist.imagem_url}
          alt={playlist.titulo}
          loading="lazy"
        />
      </div>
      <div className="content">
        <div className="details">
          <h2>
            {playlist.titulo}
            <br />
            <span>{playlist.subtitulo}</span>
          </h2>
          <div className="data">
            <h3>
              {playlist.num_pontos || 0}
              <br />
              <span>Pontos</span>
            </h3>
            <h3>
              {playlist.num_followers || 0}
              <br />
              <span>Seguidores</span>
            </h3>
            <h3>
              {playlist.num_downloads || 0}
              <br />
              <span>Downloads</span>
            </h3>
          </div>
          <div className="actionBtn">
            <button onClick={(e) => { e.stopPropagation(); onFollow(playlist.id); }}>
              Seguir
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPlay(playlist); }}>
              Reproduzir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
