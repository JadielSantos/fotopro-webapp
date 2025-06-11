import { useState } from "react";
import { Form, useSubmit, useNavigate } from "react-router";
import {
  Label,
  TextInput,
  Textarea,
  FileInput,
  Checkbox,
  Button,
  HelperText,
  Alert,
  Radio,
} from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { UserRole } from "../../enums/user.enum";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Cadastro de Cliente
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Crie sua conta para acessar e comprar suas fotos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-2 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm redirectTo="/dashboard/client" />
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ redirectTo }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(UserRole.CUSTOMER);
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [facebookUsername, setFacebookUsername] = useState("");
  const [xUsername, setXUsername] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const submit = useSubmit();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("role", role);
    formData.append("phone", phone);
    formData.append("businessName", businessName);
    formData.append("bio", bio);
    formData.append("websiteUrl", websiteUrl);
    formData.append("instagramUsername", instagramUsername);
    formData.append("facebookUsername", facebookUsername);
    formData.append("xUsername", xUsername);

    if (profileImageUrl) {
      formData.append("profileImageUrl", profileImageUrl);
    }

    if (coverImageUrl) {
      formData.append("coverImageUrl", coverImageUrl);
    }

    try {
      submit(formData, { method: "post" });
      setError(null);
      navigate(redirectTo || "/");
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      {error && <Alert color="failure">{error}</Alert>}

      <div className="flex max-w-md flex-col gap-4">
        <div className="flex items-center gap-2">
          <Radio
            id="photographer"
            name="role"
            value="photographer"
            onClick={() => setRole(UserRole.PHOTOGRAPHER)}
            defaultChecked
          />
          <Label htmlFor="photographer" color="dark">Fotógrafo</Label>
        </div>

        <div className="flex items-center gap-2">
          <Radio
            id="customer"
            name="role"
            value="customer"
            onClick={() => setRole(UserRole.CUSTOMER)}
          />
          <Label htmlFor="customer" color="dark">Cliente</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="email" color="dark">Email</Label>
        <TextInput
          id="email"
          type="email"
          icon={HiMail}
          required
          value={email}
          shadow
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="name" color="dark">Nome Completo</Label>
        <TextInput
          id="name"
          type="text"
          required
          value={name}
          shadow
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone" color="dark">Celular</Label>
        <TextInput
          id="phone"
          type="text"
          value={phone}
          shadow
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="password" color="dark">Senha</Label>
        <TextInput
          id="password"
          type="password"
          required
          value={password}
          shadow
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword" color="dark">Confirmar Senha</Label>
        <TextInput
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          shadow
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {role === UserRole.PHOTOGRAPHER && (
        <>
          <div>
            <Label htmlFor="businessName" color="dark">Nome do Negócio</Label>
            <TextInput
              id="businessName"
              type="text"
              value={businessName}
              shadow
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio" color="dark">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              shadow
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="profileImageUrl" color="dark">Imagem de Perfil</Label>
            <FileInput
              id="profileImageUrl"
              accept="image/*"
              onChange={(e) => setProfileImageUrl(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="coverImageUrl" color="dark">Imagem de Capa</Label>
            <FileInput
              id="coverImageUrl"
              accept="image/*"
              onChange={(e) => setCoverImageUrl(e.target.files?.[0] || null)}
            />
            <HelperText>
              A imagem de capa será exibida na parte superior do seu perfil.
            </HelperText>
          </div>

          <div>
            <Label htmlFor="websiteUrl" color="dark">Website</Label>
            <TextInput
              id="websiteUrl"
              type="text"
              value={websiteUrl}
              shadow
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="instagramUsername" color="dark">Instagram</Label>
            <TextInput
              id="instagramUsername"
              type="text"
              value={instagramUsername}
              shadow
              onChange={(e) => setInstagramUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="facebookUsername" color="dark">Facebook</Label>
            <TextInput
              id="facebookUsername"
              type="text"
              value={facebookUsername}
              shadow
              onChange={(e) => setFacebookUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="xUsername" color="dark">X (Twitter)</Label>
            <TextInput
              id="xUsername"
              type="text"
              value={xUsername}
              shadow
              onChange={(e) => setXUsername(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="accept"
          defaultChecked
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        <Label htmlFor="accept" color="dark">
          Eu concordo com os{" "}
          <a href="#" className="text-cyan-600 hover:underline">
            termos e condições de uso
          </a>
        </Label>
      </div>

      <Button type="submit" disabled={isLoading || !acceptTerms} className="cursor-pointer">
        {isLoading ? "Enviando..." : "Cadastrar"}
      </Button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a href="/auth/login" className="text-primary-600 hover:text-primary-800">
            Faça login
          </a>
        </p>
      </div>
    </Form>
  );
}