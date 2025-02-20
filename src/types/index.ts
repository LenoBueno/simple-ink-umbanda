
export interface Playlist {
  id: string;
  titulo: string;
  imagem_url: string;
  created_at: string;
}

export interface Ponto {
  id: string;
  playlist_id: string;
  titulo: string;
  compositor: string;
  audio_url: string;
  created_at: string;
}

export interface Historia {
  id: string;
  conteudo: string;
  created_at: string;
}
