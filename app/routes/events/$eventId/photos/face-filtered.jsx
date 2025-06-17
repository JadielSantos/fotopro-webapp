import { useLoaderData, useActionData, Form, redirect, useNavigation } from "react-router";
import { Card, Button, Label, FileInput, Alert, Spinner } from "flowbite-react";
import { eventController } from "../../../../controllers/event.controller";
import { FiArrowLeft } from "react-icons/fi";
import { LocalFileStorage } from "@mjackson/file-storage/local";
import { parseFormData } from "@mjackson/form-data-parser";
import { clearDirectory, deleteDirectory } from "../../../../utils/util";
import { photoController } from "../../../../controllers/photo.controller";
import { getAuthToken } from "../../../../utils/auth.server";
import { userController } from "../../../../controllers/user.controller";
import { UserRole } from "../../../../enums/user.enum";
import AccessEventPage from "../../../../components/EventAccess";
import { photosSelectionController } from "../../../../controllers/photosSelection.controller";
import PhotosList from "../../../../components/PhotosList";

const faceRecognitionBaseUrl = "http://127.0.0.1:5000";
const tmpUploadsDir = "./tmp_uploads";
const storage = new LocalFileStorage(tmpUploadsDir);

export async function loader({ request, params }) {
  const { eventId } = params;
  const token = await getAuthToken(request);
  var user = null;

  if (token) {
    const validationResponse = await userController.validateToken(token);

    if (!validationResponse.error) {

      const loginData = validationResponse.data;

      // Fetch additional user details if needed
      const userResponse = await userController.getById(loginData.id);

      if (!userResponse.error) {
        user = userResponse.data;
      }
    }
  }

  const eventResponse = await eventController.findById(eventId, {
    includeUser: true,
    includePhotos: true,
    includePhotosSelections: true,
  });

  if (eventResponse?.error) {
    console.error("Evento não encontrado para o ID:", eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Erro ao buscar detalhes do evento:", eventResponse.message);
    return redirect("/events");
  }

  if (!eventResponse.data.isPublic && user?.id !== eventResponse.data.userId && user?.role !== UserRole.ADMIN) {
    return {
      lockedEvent: true,
    }
  }

  return { event: eventResponse.data, user };
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
  const password = formData.get("accessHash");
  const selectedPhotoIds = formData.get("selectedPhotoIds");
  const totalPrice = formData.get("totalPrice");
  const userId = formData.get("userId");

  if (password) {
    const authResponse = await eventController.authAccess(eventId, password);
    if (authResponse?.error) {
      return { error: authResponse.message };
    }

    return { event: authResponse.data };
  }

  // Submeter seleção de fotos
  if (selectedPhotoIds) {
    const selectedPhotoIdsArr = selectedPhotoIds.split(",");
    if (!selectedPhotoIdsArr.length) {
      return { error: "Nenhuma foto selecionada." };
    }

    const eventResponse = await eventController.findById(eventId);
    if (eventResponse?.error) {
      return { error: eventResponse.message };
    }

    const userResponse = await userController.getById(userId);
    if (userResponse?.error) {
      return { error: userResponse.message };
    }

    const selectionResponse = await photosSelectionController.create({
      name: `${eventResponse.data.title} - ${userResponse.data.email}`,
      eventId,
      photosList: selectedPhotoIds,
      totalPhotos: selectedPhotoIdsArr.length,
      totalPrice: parseFloat(totalPrice),
      userId,
    });

    if (selectionResponse?.error) {
      return { error: selectionResponse.message };
    }

    return { message: "Fotos selecionadas enviadas com sucesso!" };
  }

  if (!files?.length) return { error: "Nenhuma foto enviada. Por favor, selecione uma selfie." };

  // Chama função que cria arquivo temporário para a selfie e para as fotos do evento
  const selfieResponse = await photoController.handleSelfieSubmit(eventId, files[0]);

  if (selfieResponse?.error) return { error: selfieResponse.message };

  // Chama a API Python para filtrar as fotos com base na selfie enviada
  const responsePython = await fetch(`${faceRecognitionBaseUrl}/api/filter-photos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selfiePath: selfieResponse.data.selfiePath.replace(/\\/g, "\\\\"),
    }),
  });

  if (!responsePython.ok) {
    return {
      error: "Erro ao filtrar fotos. Por favor, tente novamente mais tarde.",
    };
  }

  const responseObj = await responsePython.json();

  if (!responseObj.filteredImages?.length) {
    return {
      error: "Nenhuma foto relacionada à selfie foi encontrada. Por favor, tente novamente com uma selfie diferente.",
    };
  }

  // Busca as fotos filtradas pelo nome do arquivo
  const filteredPhotos = await photoController.getByQuery({
    where: {
      fileName: {
        in: responseObj.filteredImages.map((file) => file.name),
      },
    },
  });

  // Limpa os arquivos temporários
  deleteDirectory(selfieResponse.data.selfiePath.split(`\selfie`)[0]);
  storage.remove(keyRef);
  clearDirectory(tmpUploadsDir);

  return {
    filteredPhotos: filteredPhotos.data
  };
}

export default function FaceFilteredPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const event = actionData?.event || loaderData?.event;
  const lockedEvent = actionData?.lockedEvent || loaderData?.lockedEvent;
  const user = loaderData?.user;

  return lockedEvent && !event ?
    <AccessEventPage /> :
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
            {navigation.state == "loading" || navigation.state == "submitting" ?
              <>
                <Spinner aria-label="Loading..." size="sm" className={navigation.state === "submitting" ? "inline-block mr-2" : "hidden"} />
                <span className="pl-3">Filtrando...</span>
              </> :
              <span className="pl-3">Filtrar Fotos</span>
            }
          </Button>
        </Form>
      </Card>

      <PhotosList photos={actionData?.filteredPhotos} eventId={event.id} userId={user?.id} pricePerPhoto={event.pricePerPhoto} />
    </div>
}