import { photosSelectionModel } from "../models/photosSelection";

class PhotosSelectionController {
  /**
   * Lista seleções de fotos por query.
   * @param {Object} query Query para filtrar as seleções de fotos.
   * * @returns {Promise<Object>} Lista de seleções de fotos ou erro.
   */
  async getByQuery(query) {
    try {
      if (!query || typeof query !== "object") {
        return {
          status: 400,
          message: "Parâmetros de consulta inválidos.",
          error: true,
        };
      }

      const photosSelection = await photosSelectionModel.findByQuery(query);
      if (!photosSelection || !photosSelection.length) {
        return {
          status: 404,
          message:
            "Nenhuma seleção de fotos encontrada para os critérios fornecidos.",
          error: true,
        };
      }

      return { status: 200, data: photosSelection };
    } catch (error) {
      return {
        status: 500,
        message: "Não foi possível recuperar seleções de fotos por consulta.",
        error: true,
      };
    }
  }

  /**
   * Cria uma nova seleção de fotos.
   * @param {Object} data Dados da seleção de fotos.
   * @return {Promise<Object>} Seleção de fotos criada ou erro.
   */
  async create(data) {
    try {
      if (!data || typeof data !== "object") {
        return {
          status: 400,
          message: "Dados inválidos para criação da seleção de fotos.",
          error: true,
        };
      }

      const newSelection = await photosSelectionModel.create(data);
      if (!newSelection) {
        return {
          status: 500,
          message: "Não foi possível criar a seleção de fotos.",
          error: true,
        };
      }

      return { status: 201, data: newSelection };
    } catch (error) {
      return {
        status: 500,
        message: "Não foi possível criar a seleção de fotos.",
        error: true,
      };
    }
  }

  /**
   * Atualiza uma seleção de fotos existente.
   * @param {string} id ID da seleção de fotos.
   * @param {Object} updateData Dados para atualização.
   * @return {Promise<Object>} Seleção de fotos atualizada ou erro.
   */
  async update(id, updateData) {
    try {
      if (!id || !updateData || typeof updateData !== "object") {
        return {
          status: 400,
          message: "ID ou dados de atualização inválidos.",
          error: true,
        };
      }

      const updatedSelection = await photosSelectionModel.update(
        id,
        updateData
      );
      if (!updatedSelection) {
        return {
          status: 404,
          message: "Seleção de fotos não encontrada para atualização.",
          error: true,
        };
      }

      return { status: 200, data: updatedSelection };
    } catch (error) {
      return {
        status: 500,
        message: "Não foi possível atualizar a seleção de fotos.",
        error: true,
      };
    }
  }
}

export const photosSelectionController = new PhotosSelectionController();
