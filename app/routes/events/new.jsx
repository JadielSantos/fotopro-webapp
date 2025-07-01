import { redirect, Form, useActionData, useSubmit, useLoaderData } from "react-router";
import { Label, TextInput, Select, Button, Alert, Textarea, Datepicker } from "flowbite-react";
import { getAuthToken } from "../../utils/auth.server";
import { userController } from "../../controllers/user.controller";
import { UserRole } from "../../enums/user.enum";
import { eventController } from "../../controllers/event.controller";
import bcrypt from "bcrypt";
import { useState } from "react";

export async function loader({ request }) {
  const token = await getAuthToken(request);

  if (!token) {
    return redirect("/events");
  }

  const validationResponse = await userController.validateToken(token);

  if (validationResponse.error) {
    return redirect("/events");
  }

  const user = validationResponse.data;

  // Fetch additional user details if needed
  const userResponse = await userController.getById(user.id);

  if (userResponse.error) {
    console.error("Error fetching user details:", userResponse.message);
    return redirect("/events");
  }

  if (userResponse.data.role !== UserRole.PHOTOGRAPHER && userResponse.data.role !== UserRole.ADMIN) {
    console.error("Access denied: User does not have permission to create events.");
    return redirect("/events");
  }

  return { user: userResponse.data };
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const date = new Date(formData.get("date")).toISOString();
  const isPublic = formData.get("isPublic") === "true";
  const addressName = formData.get("addressName");
  const city = formData.get("city");
  const state = formData.get("state");
  const country = formData.get("country");
  const pricePerPhoto = formData.get("pricePerPhoto");
  const publishAt = new Date(formData.get("publishAt")).toISOString();
  const unpublishAt = new Date(formData.get("unpublishAt")).toISOString() || null;
  const description = formData.get("description");
  const userId = formData.get("userId");
  var accessHash = formData.get("accessHash");

  if (!title || !date || !addressName || !city || !state || !country || !pricePerPhoto || !description) {
    return { error: "Todos os campos são obrigatórios." }, { status: 400 };
  }

  // Criptografar a senha do evento se não for público
  accessHash = isPublic ? null : await bcrypt.hash(accessHash, 10);
  if (!isPublic && !accessHash) {
    return { error: "A senha do evento é obrigatória para eventos privados." }, { status: 400 };
  }

  const newEventResponse = await eventController.create({
    title,
    date,
    isPublic,
    accessHash,
    addressName,
    city,
    state,
    country,
    pricePerPhoto: parseFloat(pricePerPhoto),
    publishAt,
    unpublishAt,
    description,
    userId
  });

  if (newEventResponse.error) {
    console.error("Error creating event:", newEventResponse.message);
    return { error: newEventResponse.message }, { status: 500 };
  }

  return redirect("/events/" + newEventResponse.data.id + "/edit");
}

export default function NewEventPage() {
  const actionData = useActionData();
  const { user } = useLoaderData();
  const submit = useSubmit();
  const [isPublic, setIsPublic] = useState(true);

  function handleSubmit(event) {
    const formData = new FormData(event.target.form);
    // const date = formData.get("date");
    // const publishAt = formData.get("publishAt");
    // const unpublishAt = formData.get("unpublishAt");

    // // Validar se a data de publicação é anterior à data do evento
    // if (new Date(publishAt) < new Date(date)) {
    //   alert("A data de publicação não pode ser anterior à data do evento.");
    //   return;
    // }

    // // Validar se a data de despublicação é posterior à data de publicação
    // if (unpublishAt && new Date(unpublishAt) <= new Date(publishAt)) {
    //   alert("A data de despublicação deve ser posterior à data de publicação.");
    //   return;
    // }

    submit(event.target, { method: "post" });
  }

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
          <Label htmlFor="title" color="dark">Título do Evento</Label>
          <TextInput
            id="title"
            name="title"
            type="text"
            placeholder="Digite o título do evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="date" color="dark">Data do Evento</Label>
          <Datepicker
            id="date"
            name="date"
            placeholder="Selecione a data do evento"
            required
            displayFormat="dd/mm/yyyy"
          // onChange={(date) => {
          //   const formattedDate = date.toISOString().split("T")[0];
          //   document.getElementById("date").value = formattedDate;
          // }}
          />
        </div>
        <div>
          <Label htmlFor="isPublic" color="dark">Evento Público</Label>
          <Select
            id="isPublic"
            name="isPublic"
            required
            onChange={(e) => setIsPublic(e.target.value === "true")}
          >
            <option value="">Selecione uma opção</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
        </div>
        {!isPublic && (
          <div>
            <Label htmlFor="accessHash" color="dark">Senha de acesso</Label>
            <TextInput
              id="accessHash"
              name="accessHash"
              type="text"
              placeholder="Digite a senha de acesso ao evento"
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="description" color="dark">Descrição do Evento</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Digite uma descrição para o evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="addressName" color="dark">Nome do Local</Label>
          <TextInput
            id="addressName"
            name="addressName"
            type="text"
            placeholder="Digite o nome do local do evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="city" color="dark">Cidade</Label>
          <TextInput
            id="city"
            name="city"
            type="text"
            placeholder="Digite a cidade do evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="state" color="dark">Estado</Label>
          <Select id="state" name="state" required>
            <option value="">Selecione o estado</option>
            <option value="SC">Santa Catarina</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="Country" color="dark">País</Label>
          <TextInput
            id="country"
            name="country"
            type="text"
            placeholder="Digite o país do evento"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricePerPhoto" color="dark">Preço por Foto</Label>
          <TextInput
            id="pricePerPhoto"
            name="pricePerPhoto"
            type="number"
            placeholder="Digite o preço por foto"
            required
          />
        </div>
        {/* <div>
          <Label htmlFor="publishAt" color="dark">Publicar em</Label>
          <Datepicker
            id="publishAt"
            name="publishAt"
            placeholder="Selecione a data de publicação"
            required
            minDate={new Date()} // Não permite datas passadas
            displayFormat="dd/mm/yyyy"
          // onChange={(date) => {
          //   const formattedDate = date.toISOString().split("T")[0];
          //   document.getElementById("publishAt").value = formattedDate;
          // }}
          />
        </div>
        <div>
          <Label htmlFor="unpublishAt" color="dark">Despublicar em</Label>
          <Datepicker
            id="unpublishAt"
            name="unpublishAt"
            placeholder="Selecione a data de despublicação"
            minDate={new Date()} // Não permite datas passadas
            displayFormat="dd/mm/yyyy"
          // onChange={(date) => {
          //   const formattedDate = date.toISOString().split("T")[0];
          //   document.getElementById("unpublishAt").value = formattedDate;
          // }}
          />
        </div> */}
        <input type="hidden" name="userId" value={user.id} />
        <Alert color="warning" className="mb-4">
          <p>Avance para a próxima etapa para adicionar fotos ao evento.</p>
        </Alert>
        <Button type="submit" className="w-full cursor-pointer" onClick={handleSubmit}>
          Criar Evento
        </Button>
      </Form>
    </div>
  );
}