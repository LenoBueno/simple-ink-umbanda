
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PontoFormProps {
  playlistId: string;
}

const PontoForm = ({ playlistId }: PontoFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
      const { error: uploadError } = await supabase.storage
        .from('audios')
        .upload(audioPath, audio);

      if (uploadError) throw uploadError;

      // Get audio URL
      const { data: { publicUrl: audio_url } } = supabase.storage
        .from('audios')
        .getPublicUrl(audioPath);

      // Create ponto
      const { error: insertError } = await supabase
        .from('pontos')
        .insert({
          playlist_id: playlistId,
          titulo,
          compositor,
          audio_url
        });

      if (insertError) throw insertError;

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

  return (
    <form onSubmit={handleAddPonto} className="space-y-4 p-6 border rounded-lg">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium mb-2">
          Título do Ponto
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
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isUploading ? "Adicionando..." : "Adicionar Ponto"}
      </button>
    </form>
  );
};

export default PontoForm;
