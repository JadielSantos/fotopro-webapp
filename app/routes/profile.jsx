import { useLoaderData, Form, useActionData, redirect, useSubmit } from "react-router";
import { userController } from "../controllers/user.controller";
import { getAuthToken, invalidateAuthCookie } from "../utils/auth.server";
import { Button, Label, TextInput, Select, Alert } from "flowbite-react";
import { UserRole } from "../enums/user.enum";

export async function loader({ request }) {
  const token = await getAuthToken(request);

  if (!token) {
    return redirect("/auth/login");
  }

  const validationResponse = await userController.validateToken(token);

  if (validationResponse.status !== 200) {
    return redirect("/auth/login");
  }

  const user = validationResponse.data;

  // Fetch additional user details if needed
  const userDetails = await userController.getById(user.id);

  return { userResponse: userDetails };
}

export async function action({ request }) {
  const formData = {
    ...Object.fromEntries(await request.formData())
  };

  if (formData.logout) {
    // Invalida o cookie de autenticação
    const invalidAuthCookie = await invalidateAuthCookie();

    return redirect("/events", {
      headers: {
        "Set-Cookie": invalidAuthCookie,
      },
    });
  }

  const userId = formData.id;
  delete formData.id;

  const updateResponse = await userController.update(userId, formData);

  if (updateResponse.error) {
    return { error: updateResponse.message, status: 500 };
  }

  return { success: true };
}

export default function Profile() {
  const { userResponse } = useLoaderData();
  const actionData = useActionData();
  const user = userResponse.data;
  const submit = useSubmit();

  const handleLogout = async () => {
    submit({ logout: true }, { method: "post" });
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="mb-6">
        <p className="text-secondary-700 mb-2">Bem-vindo, {user.name}!</p>
        <p className="text-secondary-700 mb-4">
          Você é: {user.role === UserRole.PHOTOGRAPHER ? "Fotógrafo" : user.role === UserRole.CUSTOMER ? "Cliente" : "Administrador"}.
        </p>
        <Button onClick={handleLogout} color="red" className="text-white cursor-pointer">
          Sair
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
      {actionData?.error && (
        <Alert color="failure" className="mb-4">
          {actionData.error}
        </Alert>
      )}
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={user.id} />
        <div>
          <Label htmlFor="name" color="dark">Nome</Label>
          <TextInput
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" color="dark">Email</Label>
          <TextInput
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
        </div>
        <div>
          <Label htmlFor="role" color="dark">Função</Label>
          <Select id="role" name="role" defaultValue={user.role} required>
            <option value="photographer">Fotógrafo</option>
            <option value="customer">Cliente</option>
          </Select>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Salvar Alterações
        </Button>
      </Form>
    </div>
  );
}