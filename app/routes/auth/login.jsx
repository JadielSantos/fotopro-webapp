import { json, redirect } from "react-router";
import { userController } from "../../controllers/user.controller";
import { createAuthCookie, getAuthToken } from "../../utils/auth.server";

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
  return json({});
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await userController.login(email, password);

  if (response.status !== 200) {
    return json({ error: response.message }, { status: response.status });
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
  return (
    <form method="post">
      <label>
        Email:
        <input type="email" name="email" required />
      </label>
      <label>
        Password:
        <input type="password" name="password" required />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}