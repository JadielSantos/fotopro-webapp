import { useLoaderData } from 'react-router';
import { RegisterForm } from '../../components/auth';
import { userController } from '../../controllers/user.controller';
import { getAuthToken } from '../../utils/auth.server';

export async function loader({ request }) {
  const token = await getAuthToken(request);

  if (token) {
    const validationResponse = await userController.validateToken(token);

    if (validationResponse.status === 200) {
      // If the token is valid, redirect to the profile page
      return redirect("/profile");
    }
  }

  // If no token or invalid token, allow access to the login page
  return {};
}

export async function action({ request }) {
  const data = {
    ...Object.fromEntries(await request.formData())
  };

  const response = await userController.register(data);

  if (response.error) return { error: response.error };

  return response;
}

export default function Register() {
  const data = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cadastro de Cliente
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Crie sua conta para acessar e comprar suas fotos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm
            redirectTo="/dashboard/client"
          />
        </div>
      </div>
    </div>
  );
}
