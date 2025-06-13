import { google } from "googleapis";
import { Readable } from "stream";
import { writeFileToTemp } from "../utils/util";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

// TEST
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join(
  "\n"
);

class GoogleService {
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    try {
      const auth = new google.auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY, SCOPES);
      await auth.authorize();

      return auth;
    } catch (error) {
      throw new Error(`Error authorizing Google Drive API: ${error.message}`);
    }
  }

  /**
   * Faz o upload de um arquivo para o Google Drive.
   * @param {google.auth.JWT} auth
   * @param filePath Caminho local do arquivo
   * @param fileName Nome desejado no Drive
   * @param folderId (opcional) ID da pasta no Drive
   */
  async uploadFile(
    auth,
    file,
    fileName,
    folderId = "1kYWsDON3txUv5ABOiohAacqxvdTESYpj"
  ) {
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = { name: fileName };
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType: fileName.endsWith(".png")
        ? "image/png"
        : fileName.endsWith(".jpg")
        ? "image/jpeg"
        : "application/octet-stream",
      body: Readable.from(Buffer.from(await file.arrayBuffer())),
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, thumbnailLink",
    });

    return {
      fileId: res.data.id,
      fileName: fileName,
      url: `https://drive.google.com/thumbnail?id=${res.data.id}`,
      thumbnailLink: res.data.thumbnailLink,
    };
  }

  /**
   * Baixa os arquivos de um evento do Google Drive para o diretório temporário do sistema.
   * @param {google.auth.JWT} auth
   * @param {string} eventId
   * @param {string} pathIntoTemp
   * @returns {Promise<Array<{ id: string, name: string, path: string }>>}
   */
  async downloadFiles(auth, eventId, pathIntoTemp) {
    const drive = google.drive({ version: "v3", auth });

    try {
      const res = await drive.files.list({
        q: `name contains '${eventId}'`,
        fields: "files(id, name)",
      });

      const files = res.data.files;
      if (files.length === 0) {
        console.log("No files found.");
        return [];
      }

      const downloadedFiles = [];

      for (const file of files) {
        const response = await drive.files.get(
          {
            fileId: file.id,
            alt: "media",
          },
          { responseType: "stream" }
        );

        const buffers = [];
        await new Promise((resolve, reject) => {
          response.data.on("data", (chunk) => buffers.push(chunk));
          response.data.on("end", resolve);
          response.data.on("error", reject);
        });

        const buffer = Buffer.concat(buffers);
        const fakeFile = {
          name: file.name,
          arrayBuffer: async () => buffer,
        };

        const localPath = await writeFileToTemp(fakeFile, pathIntoTemp);

        downloadedFiles.push({
          id: file.id,
          name: file.name,
          path: localPath,
        });
      }

      return downloadedFiles;
    } catch (error) {
      console.error("Error downloading files:", error);
      throw error;
    }
  }

  /**
   * Deletes a file from Google Drive.
   * @param {google.auth.JWT} auth
   * @param {string} fileId - The ID of the file to delete.
   * @return {Promise<void>}
   */
  async deleteFile(auth, fileId) {
    const drive = google.drive({ version: "v3", auth });

    try {
      await drive.files.delete({ fileId });
      return `File with ID ${fileId} deleted successfully.`;
    } catch (error) {
      console.error(`Error deleting file with ID ${fileId}:`, error);
      throw error;
    }
  }
}

export const googleService = new GoogleService();

// const authClient = await authorize();

// // List available files
// const uploadedFile = await uploadFile(authClient, 'logo_fotopro_centered.png', "event-1-test.png", '1kYWsDON3txUv5ABOiohAacqxvdTESYpj');

// https://drive.google.com/thumbnail?id=FILEID
