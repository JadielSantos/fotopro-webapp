import React, { useState } from 'react';
import { Form, Button, Input } from '~/components/ui';
import { UserRole, type PhotographerRegistration } from '~/models/auth';
import { authService } from '~/services/auth.service';
import { useNavigate } from 'react-router';

interface PhotographerRegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export const PhotographerRegisterForm: React.FC<PhotographerRegisterFormProps> = ({
  onSuccess,
  onError,
  redirectTo,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      const registrationData: PhotographerRegistration = {
        name,
        email,
        password,
        businessName: businessName || undefined,
        phone: phone || undefined,
      };

      const response = await authService.registerPhotographer(registrationData);
      authService.saveAuthData(response);

      if (onSuccess) {
        onSuccess();
      }

      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer cadastro';
      setError(errorMessage);

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="register-form">
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Fotógrafo</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Form.Group>
        <Form.Label htmlFor="name" required>Nome Completo</Form.Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
          required
          fullWidth
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="email" required>E-mail</Form.Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail profissional"
          required
          fullWidth
          autoComplete="email"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="businessName">Nome do Estúdio/Empresa</Form.Label>
        <Input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Nome do seu estúdio ou empresa (opcional)"
          fullWidth
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="phone">Telefone</Form.Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Seu telefone de contato (opcional)"
          fullWidth
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="password" required>Senha</Form.Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha forte"
          required
          fullWidth
          autoComplete="new-password"
        />
        <Form.Text>
          A senha deve ter pelo menos 8 caracteres, incluindo letras e números
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="confirmPassword" required>Confirmar Senha</Form.Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
          fullWidth
          autoComplete="new-password"
        />
      </Form.Group>

      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Cadastrar como Fotógrafo
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/login/photographer" className="text-blue-600 hover:text-blue-800">
            Faça login
          </a>
        </p>
      </div>
    </Form>
  );
};

export default PhotographerRegisterForm;
