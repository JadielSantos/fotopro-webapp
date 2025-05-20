import React, { useState } from 'react';
import { Form, Button, Input, Modal } from '~/components/ui';
import { ShareType, type CreateShareLinkRequest } from '~/models/share';
import { shareService } from '~/services/share.service';

interface ShareAlbumFormProps {
  albumId: string;
  onSuccess?: (shareLink: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const ShareAlbumForm: React.FC<ShareAlbumFormProps> = ({
  albumId,
  onSuccess,
  onError,
  className = '',
}) => {
  const [shareType, setShareType] = useState<ShareType>(ShareType.PASSWORD);
  const [password, setPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const [maxViews, setMaxViews] = useState('');
  const [emails, setEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar campos
      if (shareType === ShareType.PASSWORD && !password) {
        throw new Error('A senha é obrigatória para compartilhamento protegido');
      }

      if (shareType === ShareType.EMAIL && !emails) {
        throw new Error('Pelo menos um e-mail é obrigatório para compartilhamento por e-mail');
      }

      // Preparar dados para a requisição
      const request: CreateShareLinkRequest = {
        albumId,
        type: shareType,
      };

      // Adicionar campos opcionais conforme o tipo de compartilhamento
      if (shareType === ShareType.PASSWORD) {
        request.password = password;
      }

      if (shareType === ShareType.EMAIL) {
        request.allowedEmails = emails.split(',').map(email => email.trim());
      }

      // Adicionar data de expiração se especificada
      if (expiryDays && parseInt(expiryDays) > 0) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));
        request.expiresAt = expiryDate.toISOString();
      }

      // Adicionar número máximo de visualizações se especificado
      if (maxViews && parseInt(maxViews) > 0) {
        request.maxViews = parseInt(maxViews);
      }

      // Enviar requisição para criar link de compartilhamento
      const shareLink = await shareService.createShareLink(request);

      // Gerar URL de compartilhamento
      const url = shareService.getShareUrl(shareLink.slug);
      setShareUrl(url);
      setShowSuccessModal(true);

      if (onSuccess) {
        onSuccess(url);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar link de compartilhamento';
      setError(errorMessage);

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Link copiado para a área de transferência!');
        })
        .catch(err => {
          console.error('Erro ao copiar link:', err);
        });
    }
  };

  return (
    <div className={`share-album-form ${className}`}>
      <Form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Compartilhar Álbum</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Form.Group>
          <Form.Label>Tipo de Compartilhamento</Form.Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${shareType === ShareType.PUBLIC ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => setShareType(ShareType.PUBLIC)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${shareType === ShareType.PUBLIC ? 'bg-blue-500' : 'border border-gray-400'
                  }`}></div>
                <span className="font-medium">Público</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Qualquer pessoa com o link pode acessar
              </p>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${shareType === ShareType.PASSWORD ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => setShareType(ShareType.PASSWORD)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${shareType === ShareType.PASSWORD ? 'bg-blue-500' : 'border border-gray-400'
                  }`}></div>
                <span className="font-medium">Protegido por Senha</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Requer senha para acessar
              </p>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${shareType === ShareType.EMAIL ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => setShareType(ShareType.EMAIL)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${shareType === ShareType.EMAIL ? 'bg-blue-500' : 'border border-gray-400'
                  }`}></div>
                <span className="font-medium">Por E-mail</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Apenas e-mails específicos podem acessar
              </p>
            </div>
          </div>
        </Form.Group>

        {shareType === ShareType.PASSWORD && (
          <Form.Group>
            <Form.Label htmlFor="password" required>Senha</Form.Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha para proteção"
              required
              fullWidth
            />
            <Form.Text>
              Compartilhe esta senha com as pessoas que devem ter acesso ao álbum
            </Form.Text>
          </Form.Group>
        )}

        {shareType === ShareType.EMAIL && (
          <Form.Group>
            <Form.Label htmlFor="emails" required>E-mails</Form.Label>
            <Input
              id="emails"
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email1@exemplo.com, email2@exemplo.com"
              required
              fullWidth
            />
            <Form.Text>
              Separe múltiplos e-mails por vírgula
            </Form.Text>
          </Form.Group>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Form.Group>
            <Form.Label htmlFor="expiryDays">Expirar Após (dias)</Form.Label>
            <Input
              id="expiryDays"
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              placeholder="Dias até expirar"
              min="0"
              fullWidth
            />
            <Form.Text>
              Deixe em branco para não expirar
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="maxViews">Máximo de Visualizações</Form.Label>
            <Input
              id="maxViews"
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="Número máximo de acessos"
              min="0"
              fullWidth
            />
            <Form.Text>
              Deixe em branco para visualizações ilimitadas
            </Form.Text>
          </Form.Group>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Gerar Link de Compartilhamento
          </Button>
        </div>
      </Form>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Link de Compartilhamento Criado"
        showCloseButton={true}
        size="md"
      >
        <div className="text-center">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p className="mb-4">
            Seu link de compartilhamento foi criado com sucesso!
          </p>

          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-left">
            <p className="text-sm text-gray-600 mb-1">Link de compartilhamento:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={shareUrl || ''}
                readOnly
                className="flex-1 bg-transparent border-none focus:outline-none text-blue-600 overflow-x-auto"
              />
              <button
                onClick={copyToClipboard}
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Copiar link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          {shareType === ShareType.PASSWORD && (
            <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-left">
              <p className="text-sm text-yellow-800 mb-1">Senha para acesso:</p>
              <p className="font-medium">{password}</p>
              <p className="text-xs text-yellow-700 mt-1">
                Lembre-se de compartilhar esta senha com as pessoas que devem ter acesso ao álbum.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
            <Button
              variant="primary"
              onClick={copyToClipboard}
              className="w-full sm:w-auto"
            >
              Copiar Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShareAlbumForm;
