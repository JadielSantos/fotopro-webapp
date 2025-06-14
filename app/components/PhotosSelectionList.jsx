import { useActionData, useSubmit } from "react-router";
import { ModalHeader, ModalBody, Modal } from "flowbite-react";
import { useState } from "react";

export default function PhotosSelectionList({ title, photosSelections }) {
  const actionData = useActionData();
  const submit = useSubmit();
  const [selectedSelection, _setSelectedSelection] = useState(null);

  const setSelectedSelection = (selection) => {
    if (selection) submit({ photosList: selection.photosList }, { method: "post" });
    _setSelectedSelection(selection);
  }

  photosSelections = photosSelections?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return photosSelections?.length ?
    <>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nome</th>
              <th className="border border-gray-300 px-4 py-2">Quantidade Fotos</th>
              <th className="border border-gray-300 px-4 py-2">Preço Total</th>
              <th className="border border-gray-300 px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {photosSelections.map((selection) => (
              <tr
                key={selection.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedSelection(selection)}
              >
                <td className="border border-gray-300 px-4 py-2">{selection.name}</td>
                <td className="border border-gray-300 px-4 py-2">{selection.totalPhotos}</td>
                <td className="border border-gray-300 px-4 py-2">
                  R$ {selection.totalPrice.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">{new Date(selection.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSelection && actionData?.photos ? (
        <Modal show={true} onClose={() => setSelectedSelection(null)}>
          <ModalHeader>
            {selectedSelection.name}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-100">
                Data: {new Date(selectedSelection.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-100">
                Você selecionou <strong>{selectedSelection.totalPhotos}</strong> fotos.
              </p>
              <p className="text-gray-100">
                Preço total: <strong>R$ {selectedSelection.totalPrice.toFixed(2)}</strong>
              </p>
              <div className="grid grid-cols-2 gap-4 pr-2 mt-4 h-72 overflow-y-auto">
                {actionData?.photos.map(photo => (
                  <img
                    key={photo.id}
                    src={photo.url + "&sz=w300"}
                    alt={`Selected Photo ${photo.fileName}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          </ModalBody>
        </Modal>
      ) : ""}
    </> : "";
}