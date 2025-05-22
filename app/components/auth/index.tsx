import React from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

// Exporta todos os componentes de autenticação de uma vez
export {
  LoginForm,
  RegisterForm
};

// Componente de índice para facilitar importações
const Auth = {
  LoginForm,
  RegisterForm
};

export default Auth;
