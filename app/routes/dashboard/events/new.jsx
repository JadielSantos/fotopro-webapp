import { redirect, useLoaderData, Form, useActionData } from "react-router";
import { Label, TextInput, Select, Button, Alert, Textarea } from "flowbite-react";
import { getAuthToken } from "../../../utils/auth.server";
import { userController } from "../../../controllers/user.controller";

export async function loader({ request }) {
  const token = await getAuthToken(request);

  if (!token) {
    return redirect("/auth/login");
  }

  const validationResponse = await userController.validateToken(token);

  if (validationResponse.status !== 200 || validationResponse.data.role !== "photographer") {
    return redirect("/access/access-denied");
  }

  return { user: validationResponse.data };
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const date = formData.get("date");
  const location = formData.get("location");
  const description = formData.get("description");

  if (!title || !date || !location || !description) {
    return { error: "Todos os campos são obrigatórios." }, { status: 400 };
  }

  // Simulação de criação de evento (substituir por lógica real no backend)
  const newEvent = {
    title,
    date,
    location,
    description,
  };

  console.log("Evento criado:", newEvent);

  return redirect("/dashboard/events");
}

export default function NewEventPage() {
  const actionData = useActionData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Evento</h1>
      {actionData?.error && (
        <Alert color="failure" className="mb-4">
          {actionData.error}
        </Alert>
      )}
      <Form method="post" className="space-y-6">
        <div>
          <Label htmlFor="title" value="Título do Evento" />
          <TextInput
            id="title"
            name="title"
            type="text"
            placeholder="Digite o título do evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="date" value="Data do Evento" />
          <TextInput
            id="date"
            name="date"
            type="date"
            required
          />
        </div>
        <div>
          <Label htmlFor="location" value="Localização" />
          <Select id="location" name="location" required>
            <option value="">Selecione o estado</option>
            <option value="SC">Santa Catarina</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="description" value="Descrição do Evento" />
          <Textarea
            id="description"
            name="description"
            placeholder="Digite uma descrição para o evento"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Criar Evento
        </Button>
      </Form>
    </div>
  );
}