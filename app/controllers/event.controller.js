import { eventModel } from "../models/event.model.js";

class EventController {
  /**
   * Lista todos os eventos.
   * @returns {Promise<Object>} Lista de eventos ou erro.
   */
  async listAll() {
    try {
      const events = await eventModel.getAll();
      return { status: 200, data: events };
    } catch (error) {
      console.error("Erro ao listar eventos:", error);
      return { status: 500, message: "Não foi possível listar os eventos.", error: true };
    }
  }

  /**
   * Lista eventos paginados.
   * @param {number} page Número da página.
   * @param {number} limit Número de eventos por página.
   * @returns {Promise<Object>} Eventos paginados ou erro.
   */
  async listPaginated(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const total = await eventModel.count();
      const events = await eventModel.getByQuery({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: true, photos: true },
      });

      return {
        status: 200,
        data: {
          events,
          page,
          totalPages: Math.ceil(total / limit),
          total,
        },
      };
    } catch (error) {
      console.error("Erro ao listar eventos paginados:", error);
      return { status: 500, message: "Não foi possível listar os eventos paginados.", error: true };
    }
  }

  /**
   * Lista eventos relevantes.
   * @param {number} numberOfEvents Número de eventos relevantes.
   * @returns {Promise<Object>} Eventos relevantes ou erro.
   */
  async listRelevant(numberOfEvents = 3) {
    try {
      const events = await eventModel.getByQuery({
        take: numberOfEvents,
        orderBy: { relevanceScore: "desc" },
        include: { user: true, photos: true },
      });

      return { status: 200, data: events };
    } catch (error) {
      console.error("Erro ao listar eventos relevantes:", error);
      return { status: 500, message: "Não foi possível listar os eventos relevantes.", error: true };
    }
  }

  /**
   * Busca um evento por ID.
   * @param {string} id ID do evento.
   * @returns {Promise<Object>} Evento encontrado ou erro.
   */
  async findById(id) {
    try {
      const event = await eventModel.getById(id, {
        includeUser: true,
        includePhotos: true,
      });
      if (!event) {
        return { status: 404, message: "Evento não encontrado.", error: true };
      }
      return { status: 200, data: event };
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      return { status: 500, message: "Não foi possível encontrar o evento.", error: true };
    }
  }

  /**
   * Cria um novo evento.
   * @param {Object} eventData Dados do evento.
   * @returns {Promise<Object>} Evento criado ou erro.
   */
  async create(eventData) {
    try {
      if (!eventData || typeof eventData !== "object") {
        return { status: 400, message: "Dados do evento inválidos.", error: true };
      }

      const newEvent = await eventModel.create(eventData);

      if (!newEvent) {
        return { status: 500, message: "Não foi possível criar o evento.", error: true };
      }

      return { status: 200, data: newEvent };
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      return { status: 500, message: "Não foi possível criar o evento.", error: true };
    }
  }

  /**
   * Atualiza um evento existente.
   * @param {string} id ID do evento.
   * @param {Object} updateData Dados para atualização.
   * @returns {Promise<Object>} Evento atualizado ou erro.
   */
  async update(id, updateData) {
    try {
      if (!updateData || typeof updateData !== "object" || !id) {
        return { status: 400, message: "Dados de atualização inválidos.", error: true };
      }

      const updatedEvent = await eventModel.update(id, updateData);

      if (!updatedEvent) {
        return { status: 404, message: "Evento não encontrado para atualização.", error: true };
      }

      return { status: 200, data: updatedEvent };
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      return { status: 500, message: "Não foi possível atualizar o evento.", error: true };
    }
  }

  /**
   * Exclui um evento por ID.
   * @param {string} id ID do evento.
   * @returns {Promise<Object>} Evento excluído ou erro.
   */
  async delete(id) {
    try {
      if (!id) {
        return { status: 400, message: "ID do evento inválido.", error: true };
      }

      const deletedEvent = await eventModel.delete(id);

      if (!deletedEvent) {
        return { status: 404, message: "Evento não encontrado para exclusão.", error: true };
      }

      return { status: 200, data: deletedEvent };
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      return { status: 500, message: "Não foi possível excluir o evento.", error: true };
    }
  }
}

export const eventController = new EventController();