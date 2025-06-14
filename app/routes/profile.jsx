import { useLoaderData, Form, useActionData, redirect, useSubmit, Link } from "react-router";
import { userController } from "../controllers/user.controller";
import { getAuthToken, invalidateAuthCookie } from "../utils/auth.server";
import { Button, Label, TextInput, Select, Alert, ModalHeader, ModalBody, ModalFooter, Modal } from "flowbite-react";
import { UserRole } from "../enums/user.enum";
import { useState } from "react";
import { photoController } from "../controllers/photo.controller";
import PhotosSelectionList from "../components/PhotosSelectionList";

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
  const userDetails = await userController.getById(user.id, {
    includePhotosSelections: true,
    includeEvents: true,
  });

  if (userDetails.error) {
    return redirect("/events");
  }

  return { user: userDetails.data };
}

export async function action({ request }) {
  const formData = {
    ...Object.fromEntries(await request.formData())
  };

  if (formData.photosList) {
    const photosResponse = await photoController.getByQuery({
      where: {
        id: {
          in: formData.photosList.split(","),
        },
      },
    });

    if (photosResponse.error) {
      return { error: photosResponse.message, status: 500 };
    }

    return {
      photos: photosResponse.data,
    }
  }

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
  const { user } = useLoaderData();
  const actionData = useActionData();
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
        <Button onClick={handleLogout} color="red" className="cursor-pointer">
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
        {user.role !== UserRole.ADMIN && (
          <div>
            <Label htmlFor="role" color="dark">Função</Label>
            <Select id="role" name="role" defaultValue={user.role} required>
              <option value="PHOTOGRAPHER">Fotógrafo</option>
              <option value="CUSTOMER">Cliente</option>
            </Select>
          </div>
        )}
        <Button type="submit" className="w-full cursor-pointer">
          Salvar Alterações
        </Button>
      </Form>

      {(user.role === UserRole.CUSTOMER || user.role === UserRole.ADMIN) && user.photosSelections && (
        <PhotosSelectionList title={"Suas Seleções de Fotos"} photosSelections={user.photosSelections} />
      )}

      {(user.role === UserRole.PHOTOGRAPHER || user.role === UserRole.ADMIN) && user.events?.length ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Seus Eventos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : ""}
    </div>
  );
}