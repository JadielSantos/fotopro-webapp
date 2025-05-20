import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Loader } from '~/components/ui';
import { pythonIntegrationService } from '~/services/python.service';
import { type Photo } from '~/models/album';

interface PersonPhotosProps {
  className?: string;
}

export const PersonPhotos: React.FC<PersonPhotosProps> = ({
  className = '',
}) => {
  const { albumId, personId } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!albumId || !personId) {
      setError('ID do álbum ou da pessoa não fornecido');
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const personPhotos = await pythonIntegrationService.getPersonPhotos(albumId, personId);
        setPhotos(personPhotos);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar fotos da pessoa';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [albumId, personId]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const handleAddToCart = () => {
    // Implementação futura: adicionar fotos selecionadas ao carrinho
    alert(`${selectedPhotos.length} fotos adicionadas ao carrinho`);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader size="lg" text="Carregando fotos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800">Erro ao carregar fotos</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-xl font-semibold mb-4">Fotos da Pessoa</h3>
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">
            Nenhuma foto encontrada para esta pessoa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-semibold mb-2 sm:mb-0">
          Fotos da Pessoa ({photos.length})
        </h3>

        {selectedPhotos.length > 0 && (
          <div className="flex items-center">
            <span className="mr-3 text-gray-600">
              {selectedPhotos.length} foto{selectedPhotos.length !== 1 ? 's' : ''} selecionada{selectedPhotos.length !== 1 ? 's' : ''}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`photo-card relative rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            onClick={() => togglePhotoSelection(photo.id)}
          >
            <div className="aspect-square overflow-hidden bg-gray-200">
              <img
                src={photo.thumbnailUrl}
                alt={photo.fileName}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {selectedPhotos.includes(photo.id) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonPhotos;
