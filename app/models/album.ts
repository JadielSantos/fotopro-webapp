export interface Album {
  id: string;
  title: string;
  description?: string;
  coverPhotoUrl?: string;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
  isProcessed: boolean;
  processingStatus?: 'none' | 'queued' | 'processing' | 'completed' | 'failed';
}

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    cameraMake?: string;
    cameraModel?: string;
    exposureTime?: string;
    aperture?: string;
    iso?: number;
    focalLength?: string;
    takenAt?: string;
  };
}

export interface PersonGroup {
  personId: string;
  photoIds: string[];
  confidence: number;
  faceCount: number;
  thumbnailPhotoId: string; // ID da foto com melhor visualização da face
}

export interface AlbumGroupingMetadata {
  albumId: string;
  processedAt: string;
  personGroups: PersonGroup[];
  ungroupedPhotoIds: string[]; // Fotos sem faces detectadas
}
