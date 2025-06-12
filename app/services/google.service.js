import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

// TEST
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n');

class GoogleService {
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize() {
    try {
      const auth = new google.auth.JWT(
        CLIENT_EMAIL,
        null,
        PRIVATE_KEY,
        SCOPES
      );
      await auth.authorize();

      return auth;
    } catch (error) {
      throw new Error(`Error authorizing Google Drive API: ${error.message}`);
    }
  }

  /**
   * Faz o upload de um arquivo para o Google Drive.
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
    const drive = google.drive({ version: 'v3', auth });
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
    }
  }
}

export const googleService = new GoogleService();

// const authClient = await authorize();

// // List available files
// const uploadedFile = await uploadFile(authClient, 'logo_fotopro_centered.png', "event-1-test.png", '1kYWsDON3txUv5ABOiohAacqxvdTESYpj');

// https://drive.google.com/thumbnail?id=FILEID