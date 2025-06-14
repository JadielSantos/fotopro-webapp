import { Alert, Button, Label, TextInput } from "flowbite-react";
import { Form, useActionData, useNavigation, useSubmit } from "react-router";

export default function AccessEventPage() {
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  const handleSubmit = (e) => {
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "post" });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Acessar Fotos do Evento</h1>
      <p className="mb-4 text-gray-600">
        Este evento é privado. Insira a senha para acessar as fotos do evento.
      </p>

      {actionData?.error && (
        <Alert color="failure" className="mb-4">
          {actionData?.error}
        </Alert>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <Label htmlFor="accessHash" color="dark">
            Senha do Evento
          </Label>
          <TextInput
            id="accessHash"
            name="accessHash"
            type="password"
            placeholder="Digite a senha do evento"
            required
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer" onClick={handleSubmit}>
          {isSubmitting ? "Acessando..." : "Acessar Evento"}
        </Button>
      </Form>
    </div>
  );
}