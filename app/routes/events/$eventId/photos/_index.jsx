import { useLoaderData, useActionData } from "react-router";
import { Button } from "flowbite-react";
import { eventController } from "../../../../controllers/event.controller";
import { FiArrowLeft } from "react-icons/fi";
import { UserRole } from "../../../../enums/user.enum";
import { getAuthToken } from "../../../../utils/auth.server";
import { userController } from "../../../../controllers/user.controller";
import AccessEventPage from "../../../../components/EventAccess";
import { photosSelectionController } from "../../../../controllers/photosSelection.controller";
import PhotosList from "../../../../components/PhotosList";

const photosPerPage = 12;

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") ? parseInt(url.searchParams.get("page"), 10) : 1;
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
  if (eventResponse?.error && eventResponse.status === 404) {
    console.error("Event not found for ID:", eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Error fetching event details:", eventResponse.message);
    return redirect("/events");
  }
  const event = eventResponse.data;

  if (!eventResponse.data.isPublic && user?.id !== eventResponse.data.userId && user?.role !== UserRole.ADMIN) {
    return {
      lockedEvent: true,
    }
  }

  const totalPages = event.photos?.length ? Math.ceil(event.photos.length / photosPerPage) : 0;
  const paginatedPhotos = event.photos?.length ? event.photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage) : [];

  return { event, photos: paginatedPhotos, page: currentPage, totalPages, user };
}

export async function action({ request, params }) {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") ? parseInt(url.searchParams.get("page"), 10) : 1;
  const { eventId } = params;
  const formData = {
    ...Object.fromEntries(await request.formData())
  };

  const password = formData.accessHash;

  if (password) {
    const authResponse = await eventController.authAccess(eventId, password);
    if (authResponse?.error) {
      return { error: authResponse.message };
    }

    const event = authResponse.data;

    const totalPages = event.photos?.length ? Math.ceil(event.photos.length / photosPerPage) : 0;
    const paginatedPhotos = event.photos?.length ? event.photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage) : [];

    return { event, photos: paginatedPhotos, page: currentPage, totalPages };
  }

  // Submeter seleção de fotos
  if (formData.selectedPhotoIds) {
    const selectedPhotoIds = formData.selectedPhotoIds.split(",");
    if (!selectedPhotoIds.length) {
      return { error: "Nenhuma foto selecionada." };
    }

    const eventResponse = await eventController.findById(eventId);
    if (eventResponse?.error) {
      return { error: eventResponse.message };
    }

    const userResponse = await userController.getById(formData.userId);
    if (userResponse?.error) {
      return { error: userResponse.message };
    }

    const selectionResponse = await photosSelectionController.create({
      name: `${eventResponse.data.title} - ${userResponse.data.email}`,
      eventId,
      photosList: formData.selectedPhotoIds,
      totalPhotos: selectedPhotoIds.length,
      totalPrice: parseFloat(formData.totalPrice),
      userId: formData.userId,
    });

    if (selectionResponse?.error) {
      return { error: selectionResponse.message };
    }

    return { message: "Fotos selecionadas enviadas com sucesso!" };
  }
}

export default function PhotosPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const event = actionData?.event || loaderData?.event;
  const photos = actionData?.photos || loaderData?.photos;
  const page = actionData?.page || loaderData?.page;
  const totalPages = actionData?.totalPages || loaderData?.totalPages;
  const lockedEvent = actionData?.lockedEvent || loaderData?.lockedEvent;
  const user = loaderData?.user;

  return lockedEvent && !event ?
    <AccessEventPage /> :
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        {/* Título do evento */}
        <h1 className="text-3xl font-bold">{event.title}</h1>

        {/* Voltar para o evento */}
        <Button href={`/events/${event.id}`} color="transparent">
          <FiArrowLeft className="mr-2" />
          Voltar
        </Button>
      </div>

      <PhotosList photos={photos} eventId={event.id} userId={user?.id} pricePerPhoto={event.pricePerPhoto} />

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4 md:mt-6">
        <span className="text-gray-600">
          Página {page} de {totalPages}
        </span>
        <div className="flex space-x-4">
          {page > 1 && (
            <Button href={`?page=${page - 1}`} color="light" className="cursor-pointer">
              Página Anterior
            </Button>
          )}
          {page < totalPages && (
            <Button href={`?page=${page + 1}`} color="light" >
              Próxima Página
            </Button>
          )}
        </div>
      </div>
    </div>
}