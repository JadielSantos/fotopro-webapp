import { useLoaderData, useActionData, Form } from "react-router";
import { Card, Label, TextInput, Button, Alert } from "flowbite-react";

export async function loader({ params }) {
  const { accessHash } = params;

  if (!accessHash) {
    throw new Response("Link de compartilhamento inválido", { status: 400 });
  }

  // Em um ambiente real, buscaríamos informações básicas sobre o link
  return {
    accessHash,
  };
}

export async function action({ request, params }) {
  const { accessHash } = params;
  const formData = await request.formData();
  const password = formData.get("password");

  // Simulação de validação de senha (backend ainda precisa implementar)
  const validPassword = "123456"; // Substituir por lógica real no backend

  if (password !== validPassword) {
    return { error: "Senha incorreta. Tente novamente." };
  }

  return { success: true, accessHash };
}

export default function SharedAlbumAccessPage() {
  const { accessHash } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="shared-album-access-page min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Álbum Compartilhado</h1>
          <p className="text-gray-600 mt-2">
            Acesse fotos compartilhadas por um fotógrafo
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <h2 className="text-xl font-semibold text-center mb-4">
              Insira a senha para acessar o álbum
            </h2>
            {actionData?.error && (
              <Alert color="failure" className="mb-4">
                {actionData.error}
              </Alert>
            )}
            <Form method="post" className="space-y-4">
              <div>
                <Label htmlFor="password" value="Senha de acesso" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite a senha"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Acessar Álbum
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}