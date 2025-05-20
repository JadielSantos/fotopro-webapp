import React, { useState } from 'react';
import { Form, Button, Input } from '~/components/ui';
import { UserRole, type LoginCredentials } from '~/models/auth';
import { authService } from '~/services/auth.service';
import { useNavigate } from 'react-router';

interface LoginFormProps {
  role: UserRole;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  role,
  onSuccess,
  onError,
  redirectTo,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email,
        password,
        role,
      };

      const response = await authService.login(credentials);
      authService.saveAuthData(response);
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roleText = role === UserRole.PHOTOGRAPHER ? 'Fotógrafo' : 'Cliente';

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <h2 className="text-2xl font-bold mb-6 text-center">Login como {roleText}</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Form.Group>
        <Form.Label htmlFor="email" required>E-mail</Form.Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          required
          fullWidth
          autoComplete="email"
        />
      </Form.Group>
      
      <Form.Group>
        <Form.Label htmlFor="password" required>Senha</Form.Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          required
          fullWidth
          autoComplete="current-password"
        />
      </Form.Group>
      
      <div className="mt-2 mb-4 text-right">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          Esqueceu sua senha?
        </a>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <a 
            href={role === UserRole.PHOTOGRAPHER ? '/register/photographer' : '/register/client'} 
            className="text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;
