import prisma from "../db.server";

class PhotosSelection {
  /**
   * Cria uma nova seleção de fotos.
   * @param {Object} data Dados da seleção de fotos.
   * @returns {Promise<Object>} Seleção criada.
   */
  async create(data) {
    try {
      const selection = await prisma.photosSelection.create({
        data,
      });

      return selection;
    } catch (error) {
      console.error("Erro ao criar seleção de fotos:", error);
      throw new Error("Não foi possível criar a seleção de fotos.");
    }
  }

  /**
   * Busca uma seleção de fotos por ID.
   * @param {string} id ID da seleção.
   * @returns {Promise<Object|null>} Seleção encontrada ou null.
   */
  async findById(id) {
    try {
      const selection = await prisma.photosSelection.findUnique({
        where: { id },
      });
      return selection;
    } catch (error) {
      console.error("Erro ao buscar seleção de fotos por ID:", error);
      throw new Error("Não foi possível buscar a seleção de fotos.");
    }
  }

  /** 
   * Busca seleções de fotos por query
   * @param {Object} query Query para filtrar seleções.
   * @returns {Promise<Array>} Lista de seleções encontradas.
   */
  async findByQuery(query) {
    try {
      const selections = await prisma.photosSelection.findMany(query);

      return selections;
    } catch (error) {
      console.error("Erro ao buscar seleções de fotos por query:", error);
      throw new Error("Não foi possível buscar as seleções de fotos.");
    }
  }

  /**
   * Lista todas as seleções de fotos.
   * @returns {Promise<Array>} Lista de seleções.
   */
  async listAll() {
    try {
      const selections = await prisma.photosSelection.findMany();
      return selections;
    } catch (error) {
      console.error("Erro ao listar seleções de fotos:", error);
      throw new Error("Não foi possível listar as seleções de fotos.");
    }
  }

  /**
   * Atualiza uma seleção de fotos por ID.
   * @param {string} id ID da seleção.
   * @param {Object} data Dados para atualização.
   * @returns {Promise<Object>} Seleção atualizada.
   */
  async update(id, data) {
    try {
      const updatedSelection = await prisma.photosSelection.update({
        where: { id },
        data,
      });
      return updatedSelection;
    } catch (error) {
      console.error("Erro ao atualizar seleção de fotos:", error);
      throw new Error("Não foi possível atualizar a seleção de fotos.");
    }
  }

  /**
   * Exclui uma seleção de fotos por ID.
   * @param {string} id ID da seleção.
   * @returns {Promise<Object>} Seleção excluída.
   */
  async delete(id) {
    try {
      const deletedSelection = await prisma.photosSelection.delete({
        where: { id },
      });
      return deletedSelection;
    } catch (error) {
      console.error("Erro ao excluir seleção de fotos:", error);
      throw new Error("Não foi possível excluir a seleção de fotos.");
    }
  }
}

export const photosSelectionModel = new PhotosSelection();