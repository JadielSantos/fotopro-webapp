import { useState } from "react";
import { Card, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "flowbite-react";
import { Form, useSubmit } from "react-router";

export default function PhotosList({ photos, eventId, userId, pricePerPhoto }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const submit = useSubmit();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmitSelection = () => {
    // Criar arquivo txt com os ids das fotos selecionadas e fazer download
    // const selectedPhotoIds = selectedPhotos.join(",");
    const blob = new Blob([selectedPhotos], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected_photos_${eventId}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    submit(
      { selectedPhotoIds: selectedPhotos, userId, totalPrice: (selectedPhotos.length * pricePerPhoto).toFixed(2) },
      { method: "post" }
    );

    setSelectedPhotos([]);
    setIsModalOpen(false);
  };

  const handlePhotoSelection = (photoId) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(photoId)
        ? prevSelected.filter((id) => id !== photoId)
        : [...prevSelected, photoId]
    );
  };

  const isSelected = (photoId) => selectedPhotos.includes(photoId);

  return photos?.length ?
    <>
      {/* Lista de fotos */}
      <Form method="post" id="photo-selection-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className={`rounded-lg shadow-md relative cursor-pointer ${isSelected(photo.id) ? "!bg-primary-900" : "!bg-secondary-800"
                }`}
              onClick={() => handlePhotoSelection(photo.id)}
            >
              <img
                src={photo.url + "&sz=w600"}
                alt={`Photo ${photo.id}`}
                className="w-full h-52 object-cover rounded-lg"
              />
              <input
                type="checkbox"
                id={`photo-${photo.id}`}
                name="photoId"
                value={photo.id}
                checked={isSelected(photo.id)}
                onChange={() => handlePhotoSelection(photo.id)}
                className="hidden"
              />
            </Card>
          ))}
        </div>
      </Form>

      {/* Botão flutuante para submeter seleção e Botão para limpar seleção */}
      {selectedPhotos.length > 0 && (
        <>
          <Button
            onClick={() => setSelectedPhotos([])}
            color="red"
            className="fixed bottom-4 right-48 z-50 shadow-lg cursor-pointer"
          >
            Limpar Seleção
          </Button>
          <Button
            onClick={toggleModal}
            color="light"
            className="fixed bottom-4 right-4 z-50 shadow-lg cursor-pointer"
          >
            Enviar Seleção ({selectedPhotos.length})
          </Button>
        </>
      )}

      {/* Modal de confirmação */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Confirmar Seleção</ModalHeader>
        <ModalBody>
          <p className="text-gray-100">
            Você selecionou <strong>{selectedPhotos.length}</strong> fotos.
          </p>
          <p className="text-gray-100">
            Preço total: <strong>R$ {(selectedPhotos.length * pricePerPhoto).toFixed(2)}</strong>
          </p>
          <div className="grid grid-cols-2 gap-4 pr-2 mt-4 h-72 overflow-y-auto">
            {photos.filter((photo) => selectedPhotos.includes(photo.id)).map((photo) => {
              return (
                <img
                  key={photo.id}
                  src={photo.url + "&sz=w300"}
                  alt={`Selected Photo ${photo.fileName}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setIsModalOpen(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button onClick={handleSubmitSelection} className="cursor-pointer">
            Confirmar e Enviar
          </Button>
        </ModalFooter>
      </Modal>
    </> :
    <Alert color="info" className="mt-4">
      <span className="font-medium">Nenhuma foto para exibir!</span>
    </Alert>
}