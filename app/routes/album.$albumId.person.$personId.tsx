import { type LoaderFunctionArgs, useLoaderData, useParams } from 'react-router';
import { PersonPhotos } from '~/components/album/PersonPhotos';
import { Button } from '~/components/ui';
import { requireAuth } from '~/utils/auth.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Verificar se o usuário está autenticado (pode ser fotógrafo ou cliente)
  await requireAuth(request);
  
  const { albumId, personId } = params;
  
  if (!albumId || !personId) {
    throw new Response('ID do álbum ou da pessoa não fornecido', { status: 400 });
  }
  
  // Em um ambiente real, buscaríamos os dados do álbum e da pessoa do backend
  // Por enquanto, retornamos dados simulados
  return {
    albumId,
    personId,
    album: {
      id: albumId,
      title: 'Álbum de Teste',
      description: 'Este é um álbum para testar o reconhecimento facial',
      photoCount: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isProcessed: true,
    }
  };
}

export default function PersonPhotosPage() {
  const { albumId, personId, album } = useLoaderData<typeof loader>();
  
  return (
    <div className="person-photos-page">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            as="link"
            to={`/album/${albumId}`}
            variant="outline"
            size="sm"
            className="mr-3"
          >
            ← Voltar para o Álbum
          </Button>
          <h1 className="text-2xl font-bold">{album.title}</h1>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>Visualizando fotos da Pessoa {personId.substring(0, 6)}</span>
          <span className="mx-2">•</span>
          <span>{album.photoCount} fotos no álbum</span>
        </div>
      </div>
      
      <div className="mb-8">
        <PersonPhotos />
      </div>
    </div>
  );
}
