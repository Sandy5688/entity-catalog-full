// src/services/entityCatalog.service.js

const entityCatalogService = {
  insertOrUpdateEntity: async (entity) => {
    return {
      ...entity,
      updated_at: new Date().toISOString(),
    };
  },
};

export default entityCatalogService;
