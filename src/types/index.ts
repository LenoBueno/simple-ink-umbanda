
export interface Playlist {
  id: string;
  titulo: string;
  subtitulo?: string;
  imagem_url: string;
  compositor: string;
  created_at: string;
  num_pontos?: number;
  num_followers?: number;
  num_downloads?: number;
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
