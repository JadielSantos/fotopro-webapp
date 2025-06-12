// // Interface para parâmetros de processamento
// export interface ProcessOptions {
//   minFaceSize?: number; // Tamanho mínimo de face para detecção
//   confidenceThreshold?: number; // Limiar de confiança para agrupamento
//   groupingThreshold?: number; // Limiar para considerar mesma pessoa
// }

// // Interface para status de tarefa
// export interface TaskStatus {
//   taskId: string;
//   status: "queued" | "processing" | "completed" | "failed";
//   progress: number; // 0-100
//   estimatedTimeRemaining?: number; // em segundos
//   error?: string;
// }

// // Classe de serviço para integração com o endpoint Python
// class PythonIntegrationService {
//   private apiBaseUrl: string;

//   constructor() {
//     // Em um ambiente real, isso viria de variáveis de ambiente
//     this.apiBaseUrl = "/api";
//   }

//   // Inicia o processamento de um álbum
//   async processAlbum(
//     albumId: string,
//     options: ProcessOptions = {}
//   ): Promise<{ taskId: string }> {
//     try {
//       const response = await fetch(
//         `${this.apiBaseUrl}/albums/${albumId}/process`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${this.getAuthToken()}`,
//           },
//           body: JSON.stringify({ options }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Erro ao iniciar processamento do álbum"
//         );
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Erro ao processar álbum:", error);
//       throw error;
//     }
//   }

//   // Verifica o status de uma tarefa
//   async checkTaskStatus(taskId: string): Promise<TaskStatus> {
//     try {
//       const response = await fetch(
//         `${this.apiBaseUrl}/tasks/${taskId}/status`,
//         {
//           headers: {
//             Authorization: `Bearer ${this.getAuthToken()}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.message || "Erro ao verificar status da tarefa"
//         );
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Erro ao verificar status da tarefa:", error);
//       throw error;
//     }
//   }

//   // Obtém os grupos de pessoas de um álbum
//   async getPersonGroups(albumId: string): Promise<PersonGroup[]> {
//     try {
//       const response = await fetch(
//         `${this.apiBaseUrl}/albums/${albumId}/groups`,
//         {
//           headers: {
//             Authorization: `Bearer ${this.getAuthToken()}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Erro ao obter grupos de pessoas");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Erro ao obter grupos de pessoas:", error);
//       throw error;
//     }
//   }

//   // Obtém as fotos de uma pessoa específica em um álbum
//   async getPersonPhotos(albumId: string, personId: string): Promise<Photo[]> {
//     try {
//       const response = await fetch(
//         `${this.apiBaseUrl}/albums/${albumId}/persons/${personId}/photos`,
//         {
//           headers: {
//             Authorization: `Bearer ${this.getAuthToken()}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Erro ao obter fotos da pessoa");
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Erro ao obter fotos da pessoa:", error);
//       throw error;
//     }
//   }

//   // Cancela uma tarefa de processamento em andamento
//   async cancelProcessing(taskId: string): Promise<void> {
//     try {
//       const response = await fetch(
//         `${this.apiBaseUrl}/tasks/${taskId}/cancel`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${this.getAuthToken()}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Erro ao cancelar processamento");
//       }
//     } catch (error) {
//       console.error("Erro ao cancelar processamento:", error);
//       throw error;
//     }
//   }

//   // Método auxiliar para obter o token de autenticação
//   private getAuthToken(): string {
//     // Em um ambiente real, isso viria do serviço de autenticação
//     return localStorage.getItem("auth_token") || "";
//   }
// }

// // Exporta uma instância única do serviço
// export const pythonIntegrationService = new PythonIntegrationService();
