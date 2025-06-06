import { redirect, useLoaderData, Form, useActionData } from "react-router";
import { Label, TextInput, Textarea, Button, Card, FileInput, Alert } from "flowbite-react";
import { getAuthToken } from "../../../utils/auth.server";
import { userController } from "../../../controllers/user.controller";

export async function loader({ request, params }) {
  const token = await getAuthToken(request);

  if (!token) {
    return redirect("/auth/login");
  }

  const validationResponse = await userController.validateToken(token);

  if (
    validationResponse.status !== 200 ||
    (validationResponse.data.role !== "photographer" &&
      validationResponse.data.role !== "ADMIN")
  ) {
    return redirect("/access/access-denied");
  }

  const event = {
    id: params.eventId,
    title: "Casamento dos Sonhos",
    location: { city: "Blumenau", state: "SC" },
    date: "2025-06-04",
    description: "Um evento inesquecível.",
    photos: Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      url: `/images/photo${index + 1}.jpg`,
    })),
  };

  return { user: validationResponse.data, event };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const date = formData.get("date");
  const location = formData.get("location");
  const description = formData.get("description");

  if (!title || !date || !location || !description) {
    return { error: "Todos os campos são obrigatórios.", status: 400 };
  }

  // Simulação de atualização de evento (substituir por lógica real no backend)
  console.log("Evento atualizado:", { title, date, location, description });

  return redirect(`/events/${params.eventId}`);
}

export default function EditEventPage() {
  const { event } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Evento</h1>

      {/* Formulário de edição do evento */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dados do Evento</h2>
        {actionData?.error && (
          <Alert color="failure" className="mb-4">
            {actionData.error}
          </Alert>
        )}
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="title" value="Título do Evento" />
            <TextInput
              id="title"
              name="title"
              type="text"
              defaultValue={event.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="date" value="Data do Evento" />
            <TextInput id="date" name="date" type="date" defaultValue={event.date} required />
          </div>
          <div>
            <Label htmlFor="location" value="Localização" />
            <TextInput
              id="location"
              name="location"
              type="text"
              defaultValue={`${event.location.city} - ${event.location.state}`}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" value="Descrição do Evento" />
            <Textarea
              id="description"
              name="description"
              defaultValue={event.description}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Atualizar Evento
          </Button>
        </Form>
      </Card>

      {/* Listagem de fotos */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Fotos do Evento</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {event.photos.map((photo) => (
            <Card key={photo.id} className="rounded-lg shadow-md">
              <img
                src={photo.url}
                alt={`Photo ${photo.id}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Form method="post" encType="multipart/form-data" className="mt-2">
                <Label htmlFor={`photo-${photo.id}`} value="Atualizar Foto" />
                <FileInput id={`photo-${photo.id}`} name={`photo-${photo.id}`} />
                <Button type="submit" color="light" className="mt-2 w-full">
                  Atualizar
                </Button>
              </Form>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}