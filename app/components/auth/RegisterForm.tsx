import React, { useState } from 'react';
import { UserRole } from '~/models/auth';
import { useNavigate, useSubmit } from 'react-router';
import {
  Button,
  Checkbox,
  FileInput,
  HelperText,
  Label,
  Radio,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiMail } from "react-icons/hi";

interface RegisterForm {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export const RegisterForm: React.FC<RegisterForm> = ({
  onSuccess,
  onError,
  redirectTo,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [facebookUsername, setFacebookUsername] = useState('');
  const [xUsername, setXUsername] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useSubmit();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('businessName', businessName);
    formData.append('bio', bio);
    formData.append('websiteUrl', websiteUrl);
    formData.append('instagramUsername', instagramUsername);
    formData.append('facebookUsername', facebookUsername);
    formData.append('xUsername', xUsername);

    if (profileImageUrl) {
      formData.append('profileImageUrl', profileImageUrl);
    }

    if (coverImageUrl) {
      formData.append('coverImageUrl', coverImageUrl);
    }

    try {
      submit(formData, { method: 'post' });
      setError(null);
      if (onSuccess) {
        onSuccess();
      }
      // Redirecionar para home ou para a página de dashboard
      navigate(redirectTo || '/');
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.");
      if (onError) {
        onError("Erro ao cadastrar. Tente novamente.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex max-w-md flex-col gap-4">
        <div className="flex items-center gap-2">
          <Radio
            id="photographer"
            name="role"
            value="photographer"
            onClick={() => setRole(UserRole.PHOTOGRAPHER)}
            defaultChecked
          />
          <Label htmlFor="photographer">Fotógrafo</Label>
        </div>

        <div className="flex items-center gap-2">
          <Radio
            id="customer"
            name="role"
            value="customer"
            onClick={() => setRole(UserRole.CUSTOMER)}
          />
          <Label htmlFor="customer">Cliente</Label>
        </div>
      </div>

      <div className='form-group'>
        <div className="mb-2 block">
          <Label htmlFor="email">Email</Label>
        </div>
        <TextInput
          id="email"
          type="email"
          icon={HiMail}
          rightIcon={HiMail}
          required
          value={email}
          shadow
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <div className="mb-2 block">
          <Label htmlFor="name">Nome Completo</Label>
        </div>
        <TextInput
          id="name"
          type="text"
          required
          value={name}
          shadow
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <div className="mb-2 block">
          <Label htmlFor="phone">Celular</Label>
        </div>
        <TextInput
          id="phone"
          type="text"
          value={phone}
          shadow
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <div className="mb-2 block">
          <Label htmlFor="password">Senha</Label>
        </div>
        <TextInput
          id="password"
          type="password"
          required
          value={password}
          shadow
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <div className="mb-2 block">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        </div>
        <TextInput
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          shadow
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* 
        Campos adicionais para fotógrafos
        Esses campos são exibidos apenas se o usuário selecionar a opção "Fotógrafo" no formulário.
      */}
      {role === UserRole.PHOTOGRAPHER && (
        <>
          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="businessName">Nome do Negócio</Label>
            </div>
            <TextInput
              id="businessName"
              type="text"
              value={name}
              shadow
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="bio">Biografia</Label>
            </div>
            <Textarea
              id="bio"
              value={bio}
              shadow
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <Label className="mb-2 block" htmlFor="profileImageUrl">
              Imagem de Perfil
            </Label>
            <FileInput
              id="profileImageUrl"
              accept="image/*"
              onChange={(e) => setProfileImageUrl(e.target.files?.[0] || null)}

            />
          </div>

          <div className='form-group'>
            <Label className="mb-2 block" htmlFor="coverImageUrl">
              Imagem de Capa
            </Label>
            <FileInput
              id="coverImageUrl"
              accept="image/*"
              onChange={(e) => setCoverImageUrl(e.target.files?.[0] || null)}
            />
            <HelperText>
              A imagem de capa será exibida na parte superior do seu perfil.
            </HelperText>
          </div>

          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="websiteUrl">Website</Label>
            </div>
            <TextInput
              id="websiteUrl"
              type="text"
              value={websiteUrl}
              shadow
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="instagramUsername">Instagram</Label>
            </div>
            <TextInput
              id="instagramUsername"
              type="text"
              value={instagramUsername}
              shadow
              onChange={(e) => setInstagramUsername(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="facebookUsername">Facebook</Label>
            </div>
            <TextInput
              id="facebookUsername"
              type="text"
              value={facebookUsername}
              shadow
              onChange={(e) => setFacebookUsername(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <div className="mb-2 block">
              <Label htmlFor="xUsername">X (Twitter)</Label>
            </div>
            <TextInput
              id="xUsername"
              type="text"
              value={xUsername}
              shadow
              onChange={(e) => setXUsername(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-2 form-group">
        <Checkbox
          id="accept"
          defaultChecked
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        <Label htmlFor="accept" className="flex">
          Eu concordo com os&nbsp;
          <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
            termos e condições de uso
          </a>
        </Label>
      </div>

      <div className="mt-4">
        <Button
          type="submit"
          disabled={isLoading || !acceptTerms}
        >
          {isLoading ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <a href="/auth/login" className="text-primary-600 hover:text-primary-800">
            Faça login
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
