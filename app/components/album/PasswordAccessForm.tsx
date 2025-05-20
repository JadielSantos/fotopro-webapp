import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Form, Button, Input, Loader } from '~/components/ui';
import { ShareType } from '~/models/share';
import { shareService } from '~/services/share.service';

interface PasswordAccessFormProps {
  className?: string;
}

export const PasswordAccessForm: React.FC<PasswordAccessFormProps> = ({
  className = '',
}) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareType, setShareType] = useState<ShareType | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError('Link de compartilhamento inválido');
      setIsValidating(false);
      return;
    }

    const validateLink = async () => {
      try {
        setIsValidating(true);
        const result = await shareService.validateShareLink(slug);

        setIsValid(result.valid);
        setShareType(result.type);

        // Se o link for válido e público, redirecionar diretamente para o álbum
        if (result.valid && result.type === ShareType.PUBLIC) {
          navigate(`/s/${slug}/view`);
        }
      } catch (err) {
        setError('Erro ao validar link de compartilhamento');
      } finally {
        setIsValidating(false);
      }
    };

    validateLink();
  }, [slug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug) {
      setError('Link de compartilhamento inválido');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await shareService.accessWithPassword(slug, { password });

      if (result.success) {
        // Armazenar token temporário para acesso ao álbum
        if (result.token) {
          localStorage.setItem(`album_access_${slug}`, result.token);
        }

        // Redirecionar para visualização do álbum
        navigate(`/s/${slug}/view`);
      } else {
        setError(result.message || 'Senha incorreta');
      }
    } catch (err) {
      setError('Erro ao processar solicitação de acesso');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader size="lg" text="Verificando link de compartilhamento..." />
      </div>
    );
  }

  if (!isValid || !slug) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-semibold text-red-800 mb-2">Link Inválido</h2>
        <p className="text-red-600 mb-6">
          Este link de compartilhamento é inválido, expirou ou foi revogado.
        </p>
        <Button
          as="link"
          to="/"
          variant="primary"
        >
          Voltar para a Página Inicial
        </Button>
      </div>
    );
  }

  if (shareType === ShareType.PASSWORD) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 max-w-md mx-auto ${className}`}>
        <div className="text-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-semibold">Álbum Protegido</h2>
          <p className="text-gray-600 mt-2">
            Este álbum está protegido por senha. Por favor, digite a senha fornecida pelo fotógrafo para acessar.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <Form.Group>
            <Form.Label htmlFor="password" required>Senha</Form.Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha do álbum"
              required
              fullWidth
              autoFocus
            />
          </Form.Group>

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Acessar Álbum
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  // Caso de tipo de compartilhamento não suportado neste componente
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="text-xl font-semibold text-yellow-800 mb-2">Tipo de Acesso Não Suportado</h2>
      <p className="text-yellow-600 mb-6">
        Este tipo de compartilhamento não é suportado por este componente.
      </p>
      <Button
        as="link"
        to="/"
        variant="primary"
      >
        Voltar para a Página Inicial
      </Button>
    </div>
  );
};

export default PasswordAccessForm;
