import { useLoaderData, useActionData, Form, redirect } from "react-router";
import { Card, Button, Label, FileInput, Alert } from "flowbite-react";
import { eventController } from "../../../../controllers/event.controller";
import { FiArrowLeft } from "react-icons/fi";
import { LocalFileStorage } from "@mjackson/file-storage/local";
import { parseFormData } from "@mjackson/form-data-parser";
import { clearDirectory, deleteTempFile, writeFileToTemp } from "../../../../utils/util";

const tmpUploadsDir = "./tmp_uploads";
const storage = new LocalFileStorage(tmpUploadsDir);

export async function loader({ params }) {
  const { eventId } = params;

  const eventResponse = await eventController.findById(eventId);

  if (eventResponse?.error && eventResponse.status === 404) {
    console.error("Evento não encontrado para o ID:", eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Erro ao buscar detalhes do evento:", eventResponse.message);
    return redirect("/events");
  }

  return { event: eventResponse.data };
}

export async function action({ request, params }) {
  const { eventId } = params;
  var keyRef = "";

  const uploadHandler = async (fileUpload) => {
    if (fileUpload.fieldName === "selfie" && fileUpload.name) {
      const key = `${params.eventId}-${Date.now()}-${fileUpload.name}`;
      await storage.set(key, fileUpload);
      keyRef = key;
      return storage.get(key);
    }
    return undefined;
  };

  const formData = await parseFormData(request, uploadHandler);
  const files = formData.getAll("selfie");

  if (!files?.length) return { error: "Nenhuma foto enviada. Por favor, selecione uma selfie." };

  const selfieFile = files[0];

  if (!selfieFile || !selfieFile.name) return { error: "Arquivo inválido. Por favor, envie uma selfie válida." };

  const selfiePath = await writeFileToTemp(selfieFile, "fotopro/" + eventId + "/selfies");

  console.log("CREATED", selfiePath);

  deleteTempFile(selfiePath);
  storage.remove(keyRef);
  clearDirectory(tmpUploadsDir);

  return;
}

export default function FaceFilteredPage() {
  const { event } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título do evento */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        {/* Título do evento */}
        <h1 className="text-3xl font-bold">{event.title}</h1>

        {/* Voltar para o evento */}
        <Button href={`/events/${event.id}`} color="transparent">
          <FiArrowLeft className="mr-2" />
          Voltar
        </Button>
      </div>

      {/* Formulário de upload */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Envie uma selfie para filtrar as fotos</h2>
        {actionData?.error && (
          <Alert color="failure" className="mb-4">
            {actionData.error}
          </Alert>
        )}
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div>
            <Label htmlFor="selfie">Selecione uma foto</Label>
            <FileInput id="selfie" name="selfie" required max="1" />
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Filtrar Fotos
          </Button>
        </Form>
      </Card>

      {/* Lista de fotos filtradas */}
      {actionData?.photos?.length && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Fotos Filtradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {actionData.photos.map((photo) => (
              <Card key={photo.id} className="rounded-lg shadow-md">
                <img
                  src={photo.url + "&sz=w600"}
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