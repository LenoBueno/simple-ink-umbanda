
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { mysql_client } from "@/lib/mysql";
import type { Playlist, Ponto } from "@/types";

interface CreatePlaylistProps {
  onSuccess: () => void;
}

const CreatePlaylist = ({ onSuccess }: CreatePlaylistProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [showPontoForm, setShowPontoForm] = useState(false);
  const { toast } = useToast();

  const handleCreatePlaylist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const imagem = formData.get('imagem') as File;

    try {
      // Upload da imagem
      const imagePath = `playlist-${Date.now()}`;
      const { error: uploadError } = await mysql_client.storage
        .from('imagens')
        .upload(imagePath, imagem);

      if (uploadError) throw uploadError;

      // Get image URL
      const { publicUrl: imagem_url } = mysql_client.storage
        .from('imagens')
        .getPublicUrl(imagePath);

      // Create playlist
      const { data: playlistData, error: insertError } = await mysql_client
        .from('playlists')
        .insert({ titulo, compositor, imagem_url })
        .execute();

      if (insertError) throw insertError;
      
      // Se temos pontos para adicionar e a playlist foi criada com sucesso
      if (pontos.length > 0 && playlistData && playlistData.length > 0) {
        const playlistId = playlistData[0].id;
        
        // Adicionar cada ponto à playlist
        for (const ponto of pontos) {
          const { error: pontoError } = await mysql_client
            .from('pontos')
            .update({ playlist_id: playlistId })
            .eq('id', ponto.id)
            .execute();
            
          if (pontoError) {
            console.error("Erro ao adicionar ponto à playlist:", pontoError);
          }
        }
      }

      toast({
        title: "Sucesso!",
        description: "Playlist criada com sucesso.",
      });

      form.reset();
      setPontos([]);
      setShowPontoForm(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar a playlist.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const audio = formData.get('audio') as File;

    try {
      // Upload do áudio
      const audioPath = `ponto-${Date.now()}`;
      const { error: uploadError } = await mysql_client.storage
        .from('audios')
        .upload(audioPath, audio);

      if (uploadError) throw uploadError;

      // Get audio URL
      const { publicUrl: audio_url } = mysql_client.storage
        .from('audios')
        .getPublicUrl(audioPath);

      // Create ponto (sem playlist_id por enquanto)
      const { data, error: insertError } = await mysql_client
        .from('pontos')
        .insert({
          playlist_id: null,
          titulo,
          compositor,
          audio_url
        })
        .execute();

      if (insertError) throw insertError;

      // Adicionar o ponto à lista local
      if (data && data.length > 0) {
        setPontos([...pontos, data[0] as Ponto]);
      }

      toast({
        title: "Sucesso!",
        description: "Ponto adicionado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o ponto.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePonto = (pontoId: string) => {
    setPontos(pontos.filter(p => p.id !== pontoId));
  };

  return (
    <div className="mb-12 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-6">Criar Nova Playlist</h3>
      <form onSubmit={handleCreatePlaylist} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium mb-2">
            Título da Playlist
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="compositor" className="block text-sm font-medium mb-2">
            Compositor
          </label>
          <input
            id="compositor"
            name="compositor"
            type="text"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="imagem" className="block text-sm font-medium mb-2">
            Imagem
          </label>
          <input
            id="imagem"
            name="imagem"
            type="file"
            accept="image/*"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        {/* Lista de pontos adicionados */}
        {pontos.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Pontos adicionados:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pontos.map((ponto) => (
                <div key={ponto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{ponto.titulo}</p>
                    <p className="text-sm text-gray-500">{ponto.compositor}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemovePonto(ponto.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isUploading ? "Criando..." : "Criar Playlist"}
          </button>
          
          <button 
            type="button" 
            onClick={() => setShowPontoForm(!showPontoForm)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            {showPontoForm ? "Ocultar formulário" : "Adicionar pontos"}
          </button>
        </div>
      </form>
      
      {/* Formulário para adicionar pontos */}
      {showPontoForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="text-md font-medium mb-4">Adicionar Ponto</h4>
          <form onSubmit={handleAddPonto} className="space-y-4">
            <div>
              <label htmlFor="ponto-titulo" className="block text-sm font-medium mb-2">
                Título do Ponto
              </label>
              <input
                id="ponto-titulo"
                name="titulo"
                type="text"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="ponto-compositor" className="block text-sm font-medium mb-2">
                Compositor
              </label>
              <input
                id="ponto-compositor"
                name="compositor"
                type="text"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="audio" className="block text-sm font-medium mb-2">
                Arquivo de Áudio
              </label>
              <input
                id="audio"
                name="audio"
                type="file"
                accept="audio/*"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {isUploading ? "Adicionando..." : "Adicionar Ponto"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
