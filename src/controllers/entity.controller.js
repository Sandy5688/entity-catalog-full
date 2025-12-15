import * as service from '../services/entityCatalog.service.js';

export async function listEntities(req, res) {
  const entities = await service.list();
  res.json(entities);
}

export async function getEntityById(req, res) {
  const entity = await service.getById(req.params.id);
  if (!entity) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(entity);
}

export async function importManual(req, res) {
  // placeholder: real logic later
  res.status(201).json({ message: 'Manual import accepted' });
}

export async function suggestEntity(req, res) {
  // placeholder
  res.status(201).json({ message: 'Suggestion received' });
}

export async function refreshMetadata(req, res) {
  // placeholder
  res.json({ message: 'Metadata refresh triggered' });
}
