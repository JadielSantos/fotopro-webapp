import fs from 'fs';
import os from 'os';
import path from 'path';

export async function writeFileToTemp(file, pathIntoTemp) {
  try {
    const tempDir = os.tmpdir();
    // Create dir if not exists
    const newDir = path.join(tempDir, pathIntoTemp);
    await fs.promises.mkdir(newDir, { recursive: true });
    const tempPath = path.join(newDir, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(tempPath, buffer, (err) => {
      if (err) {
        console.error("Error writing file to temp:", err);
      }
    });

    return tempPath;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteTempFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete temporary file: ${filePath}, ${error.message}`);
  }
}

export async function clearDirectory(directory) {
  try {
    // Clear tmp_uploads directory deleting subdirectories with node
    fs.readdir(directory, (err, subDir) => {
      if (err) {
        console.error("Error reading tmp_uploads directory:", err);
        return;
      }
      subDir.forEach((dir) => {
        fs.rm(path.join(directory, dir), { recursive: true }, (err) => {
          if (err) console.error(`Error deleting directory ${dir}:`, err);
        });
      });
    });
  } catch (error) {
    throw new Error(`Failed to clear directory: ${directory}, ${error.message}`);
  }
}