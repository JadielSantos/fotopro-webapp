import React, { useState, useEffect } from 'react';
import { Button, Loader } from '~/components/ui';
import { pythonIntegrationService } from '~/services/python.service';

interface AlbumProcessingProps {
  albumId: string;
  onProcessingComplete?: () => void;
  onProcessingError?: (error: Error) => void;
  className?: string;
}

export const AlbumProcessing: React.FC<AlbumProcessingProps> = ({
  albumId,
  onProcessingComplete,
  onProcessingError,
  className = '',
}) => {
  const [status, setStatus] = useState<'idle' | 'starting' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  // Inicia o processamento do álbum
  const startProcessing = async () => {
    try {
      setStatus('starting');
      setError(null);

      const result = await pythonIntegrationService.processAlbum(albumId);
      setTaskId(result.taskId);
      setStatus('processing');

      // Inicia o polling para verificar o status
      pollStatus(result.taskId);
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao iniciar processamento';
      setError(errorMessage);

      if (onProcessingError && err instanceof Error) {
        onProcessingError(err);
      }
    }
  };

  // Cancela o processamento
  const cancelProcessing = async () => {
    if (!taskId) return;

    try {
      await pythonIntegrationService.cancelProcessing(taskId);
      setStatus('idle');
      setProgress(0);
      setTaskId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar processamento';
      setError(errorMessage);
    }
  };

  // Função para verificar o status da tarefa periodicamente
  const pollStatus = async (id: string) => {
    try {
      const statusData = await pythonIntegrationService.checkTaskStatus(id);

      setProgress(statusData.progress);

      if (statusData.estimatedTimeRemaining !== undefined) {
        setEstimatedTime(statusData.estimatedTimeRemaining);
      }

      if (statusData.status === 'completed') {
        setStatus('completed');

        if (onProcessingComplete) {
          onProcessingComplete();
        }
      } else if (statusData.status === 'failed') {
        setStatus('error');
        setError(statusData.error || 'Falha no processamento');

        if (onProcessingError) {
          onProcessingError(new Error(statusData.error || 'Falha no processamento'));
        }
      } else {
        // Continua o polling se ainda estiver processando
        setTimeout(() => pollStatus(id), 3000);
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar status do processamento';
      setError(errorMessage);

      if (onProcessingError && err instanceof Error) {
        onProcessingError(err);
      }
    }
  };

  // Formata o tempo estimado para exibição
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} segundos`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hora${hours > 1 ? 's' : ''} e ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className={`album-processing ${className}`}>
      {status === 'idle' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reconhecimento Facial</h2>
          <p className="text-gray-600 mb-6">
            Inicie o processamento de reconhecimento facial para agrupar automaticamente as fotos por pessoa.
            Este processo pode levar alguns minutos, dependendo do número de fotos no álbum.
          </p>

          <Button
            variant="primary"
            onClick={startProcessing}
            className="w-full md:w-auto"
          >
            Iniciar Processamento
          </Button>
        </div>
      )}

      {status === 'starting' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Iniciando Processamento</h2>
          <div className="flex justify-center items-center py-4">
            <Loader size="lg" text="Preparando para processar o álbum..." />
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Processando Álbum</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Progresso: {progress}%</span>
              {estimatedTime !== null && (
                <span>Tempo estimado: {formatEstimatedTime(estimatedTime)}</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            O sistema está processando as fotos e agrupando-as por pessoa. Por favor, aguarde.
          </p>

          <Button
            variant="outline"
            onClick={cancelProcessing}
            className="w-full md:w-auto"
          >
            Cancelar Processamento
          </Button>
        </div>
      )}

      {status === 'completed' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Processamento Concluído</h2>
          </div>
          <p className="text-gray-600 mb-6">
            O reconhecimento facial foi concluído com sucesso! As fotos foram agrupadas por pessoa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Ver Resultados
            </Button>
            <Button
              variant="outline"
              onClick={startProcessing}
              className="w-full sm:w-auto"
            >
              Processar Novamente
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Erro no Processamento</h2>
          </div>
          <p className="text-red-600 mb-2">
            {error || 'Ocorreu um erro durante o processamento do reconhecimento facial.'}
          </p>
          <p className="text-gray-600 mb-6">
            Você pode tentar novamente ou entrar em contato com o suporte se o problema persistir.
          </p>

          <Button
            variant="primary"
            onClick={startProcessing}
            className="w-full md:w-auto"
          >
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlbumProcessing;
