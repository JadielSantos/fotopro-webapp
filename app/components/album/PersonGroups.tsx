import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button, Loader } from '~/components/ui';
import { pythonIntegrationService } from '~/services/python.service';
import { type PersonGroup } from '~/models/album';

interface PersonGroupsProps {
  albumId: string;
  className?: string;
}

export const PersonGroups: React.FC<PersonGroupsProps> = ({
  albumId,
  className = '',
}) => {
  const [groups, setGroups] = useState<PersonGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const personGroups = await pythonIntegrationService.getPersonGroups(albumId);
        setGroups(personGroups);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar grupos de pessoas';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [albumId]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader size="lg" text="Carregando grupos de pessoas..." />
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
          <h3 className="text-lg font-semibold text-red-800">Erro ao carregar grupos</h3>
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

  if (groups.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-xl font-semibold mb-4">Pessoas no Álbum</h3>
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-600 mb-4">
            Nenhum grupo de pessoas encontrado neste álbum.
          </p>
          <p className="text-gray-500">
            Talvez o álbum ainda não tenha sido processado pelo reconhecimento facial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-6">Pessoas no Álbum</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {groups.map((group) => (
          <Link
            key={group.personId}
            to={`/album/${albumId}/person/${group.personId}`}
            className="group"
          >
            <div className="person-card bg-gray-50 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <div className="aspect-square overflow-hidden bg-gray-200">
                <img
                  src={`/api/photos/${group.thumbnailPhotoId}/thumbnail`}
                  alt={`Pessoa ${group.personId.substring(0, 6)}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-800">
                  Pessoa {group.personId.substring(0, 6)}
                </h4>
                <p className="text-sm text-gray-500">
                  {group.photoIds.length} foto{group.photoIds.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonGroups;
