import { redirect, useActionData } from "react-router";
import { userController } from "../../controllers/user.controller";
import { createAuthCookie, getAuthToken } from "../../utils/auth.server";
import { Button, Label, TextInput, Alert } from "flowbite-react";

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
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await userController.login(email, password);

  if (response.status !== 200) {
    return { error: response.message }, { status: response.status };
  }

  // Create a cookie with the JWT token
  const authCookie = await createAuthCookie(response.data.authToken);

  // Redirect to a protected route after login
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": authCookie,
    },
  });
}

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      {actionData?.error && (
        <Alert color="failure" className="mb-4">
          {actionData.error}
        </Alert>
      )}
      <form method="post" className="space-y-4">
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Senha" />
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}