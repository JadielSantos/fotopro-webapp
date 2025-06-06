import { useLoaderData, useActionData, Form } from "react-router";
import { Card, Button, Label, FileInput, Alert } from "flowbite-react";

export async function loader({ params }) {
  const { eventId } = params;

  // Simulação de dados do evento (substituir por lógica real no backend)
  const event = {
    id: eventId,
    title: "Casamento dos Sonhos",
  };

  return { event };
}

export async function action({ request, params }) {
  const { eventId } = params;
  const formData = await request.formData();
  const file = formData.get("selfie");

  if (!file) {
    return { error: "Por favor, envie uma foto para realizar o filtro." };
  }

  // Simulação de chamada ao algoritmo Python para filtrar fotos
  // Substituir por lógica real que chama o backend Python
  const filteredPhotoIds = [1, 2, 3, 4, 5]; // IDs retornados pelo algoritmo Python

  const photos = filteredPhotoIds.map((id) => ({
    id,
    url: `/images/photo${id}.jpg`,
  }));

  return { photos };
}

export default function FaceFilteredPage() {
  const { event } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título do evento */}
      <h1 className="text-3xl font-bold mb-6">{event.title} - Filtrar por Face</h1>

      {/* Formulário de upload */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Envie uma selfie para filtrar as fotos</h2>
        {actionData?.error && (
          <Alert color="failure" className="mb-4">
            {actionData.error}
          </Alert>
        )}
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div>
            <Label htmlFor="selfie" value="Selecione uma foto" />
            <FileInput id="selfie" name="selfie" required />
          </div>
          <Button type="submit" className="w-full">
            Filtrar Fotos
          </Button>
        </Form>
      </Card>

      {/* Lista de fotos filtradas */}
      {actionData?.photos && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Fotos Filtradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {actionData.photos.map((photo) => (
              <Card key={photo.id} className="rounded-lg shadow-md">
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}