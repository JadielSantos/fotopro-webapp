import React from 'react';
import { LoginForm } from './LoginForm';
import { PhotographerRegisterForm } from './PhotographerRegisterForm';
import { ClientRegisterForm } from './ClientRegisterForm';

// Exporta todos os componentes de autenticação de uma vez
export {
  LoginForm,
  PhotographerRegisterForm,
  ClientRegisterForm
};

// Componente de índice para facilitar importações
const Auth = {
  LoginForm,
  PhotographerRegisterForm,
  ClientRegisterForm
};

export default Auth;
