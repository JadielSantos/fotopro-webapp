import { useState } from "react";
import { redirect, useLoaderData, Form, useActionData, useNavigation } from "react-router";
import { parseFormData } from "@mjackson/form-data-parser";
import { LocalFileStorage } from "@mjackson/file-storage/local";
import {
  Label,
  TextInput,
  Textarea,
  Button,
  Card,
  FileInput,
  Alert,
  Datepicker,
  Select,
  Spinner,
} from "flowbite-react";
import { getAuthToken } from "../../../utils/auth.server";
import { userController } from "../../../controllers/user.controller";
import { UserRole } from "../../../enums/user.enum";
import { eventController } from "../../../controllers/event.controller";
import { photoController } from "../../../controllers/photo.controller";
import fs from "fs";
import path from "path";
import { clearDirectory } from "../../../utils/util";

const tmpUploadsDir = "./tmp_uploads";
const storage = new LocalFileStorage(tmpUploadsDir);

export async function loader({ request, params }) {
  const token = await getAuthToken(request);
  var userResponse = null;

  if (token) {
    const validationResponse = await userController.validateToken(token);

    if (!validationResponse.error) {
      const loginData = validationResponse.data;

      // Fetch additional user details if needed
      userResponse = await userController.getById(loginData.id);

      if (userResponse.error) {
        console.error("Error fetching user details:", userResponse.message);
        return redirect("/events");
      }
    } else {
      console.error("Token validation failed:", validationResponse.message);
      return redirect("/events");
    }
  } else {
    console.error("No authentication token found.");
    return redirect("/auth/login");
  }

  const eventResponse = await eventController.findById(params.eventId);

  if (eventResponse?.error && eventResponse.status === 404) {
    console.error("Event not found for ID:", params.eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Error fetching event details:", eventResponse.message);
    return redirect("/events");
  }

  if (
    userResponse.data.id !== eventResponse.data.userId &&
    userResponse.data.role !== UserRole.ADMIN
  ) {
    console.error("Access denied: User does not have permission to edit this event.");
    return redirect("/events");
  }

  return { user: userResponse.data, event: eventResponse.data };
}

export async function action({ request, params }) {
  const keys = [];
  const uploadHandler = async (fileUpload) => {
    if (fileUpload.fieldName === "photos" && fileUpload.name) {
      const key = `${params.eventId}-${Date.now()}-${fileUpload.name}`;
      await storage.set(key, fileUpload);
      keys.push(key);
      return storage.get(key);
    }
    return undefined;
  };

  const formData = await parseFormData(request, uploadHandler);
  const files = formData.getAll("photos");

  if (files?.length) {
    const uploadResponse = await photoController.uploadPhotos(files, params.eventId);

    if (uploadResponse.error) {
      return { error: uploadResponse.message };
    }

    keys.forEach((key) => {
      storage.remove(key);
    });

    clearDirectory(tmpUploadsDir);

    return redirect(`/events/${params.eventId}/photos`);
  }

  const formDataObj = {
    ...Object.fromEntries(formData)
  };

  if (formDataObj.photoCount) return { error: "No photos uploaded. Please select at least one photo." };

  if (formDataObj.deletePhotoId) {
    const deleteResponse = await photoController.deleteById(formDataObj.deletePhotoId);

    if (deleteResponse.error) {
      return { error: deleteResponse.message };
    }

    return {
      message: "Photo deleted successfully."
    }
  }

  // Format fields
  formDataObj.date = formDataObj.date ? new Date(formDataObj.date).toISOString() : null;

  const updateResponse = await eventController.update(params.eventId, formDataObj);

  if (updateResponse.error) {
    return { error: updateResponse.message };
  }

  return redirect(`/events/${params.eventId}`);
}

export default function EditEventPage() {
  const { event } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Evento</h1>

      {actionData?.error && (
        <Alert color="failure" className="mb-4">
          {actionData.error}
        </Alert>
      )}

      {/* Formulário de edição do evento */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-secondary-100">Dados do Evento</h2>
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Evento</Label>
            <TextInput
              id="title"
              name="title"
              type="text"
              defaultValue={event.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Data do Evento</Label>
            <Datepicker
              id="date"
              name="date"
              selected={new Date(event.date)}
              onChange={(date) => date}
              dateFormat="dd/MM/yyyy"
              required
            />
          </div>
          <div>
            <Label htmlFor="city">Cidade</Label>
            <TextInput
              id="city"
              name="city"
              type="text"
              defaultValue={event.city}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">Estado</Label>
            <Select id="state" name="state" defaultValue={event.state} required>
              <option value="PR">Paraná</option>
              <option value="SC">Santa Catarina</option>
              <option value="RS">Rio Grande do Sul</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Descrição do Evento</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={event.description}
              required
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            {navigation.state == "loading" || navigation.state == "submitting" ?
              <>
                <Spinner aria-label="Loading..." size="sm" className={navigation.state === "submitting" ? "inline-block mr-2" : "hidden"} />
                <span className="pl-3">Atualizando...</span>
              </> :
              <span className="pl-3">Atualizar Evento</span>
            }
          </Button>
        </Form>
      </Card>

      {/* Upload de fotos */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-secondary-100">Adicionar Fotos</h2>
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div>
            <Label htmlFor="photos">Selecionar Fotos</Label>
            <FileInput
              id="photos"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <input type="hidden" name="photoCount" value={selectedFiles.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            {navigation.state == "loading" || navigation.state == "submitting" ?
              <>
                <Spinner aria-label="Loading..." size="sm" className={navigation.state === "submitting" ? "inline-block mr-2" : "hidden"} />
                <span className="pl-3">Enviando...</span>
              </> :
              <span className="pl-3">Enviar Fotos</span>
            }
          </Button>
        </Form>
      </Card>

      {/* Listagem de fotos */}
      {event.photos?.length ? (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-secondary-100">Fotos do Evento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {event.photos?.map((photo) => (
              <Card key={photo.id} className="rounded-lg shadow-md relative">
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Form method="post" encType="multipart/form-data" className="mt-2">
                  <input type="hidden" name="deletePhotoId" value={photo.id} />
                  <Button
                    type="submit"
                    color="red"
                    size="xs"
                    className="rounded-full cursor-pointer absolute top-1.5 right-1.5"
                    aria-label="Excluir Foto"
                  >
                    X
                  </Button>
                </Form>
              </Card>
            ))}
          </div>
        </Card>
      ) : (
        <Alert color="info" className="mt-4">
          Este evento ainda não possui fotos.
        </Alert>
      )}
    </div>
  );
}