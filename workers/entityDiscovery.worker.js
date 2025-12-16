import entityService from '../src/services/entityCatalog.service.js';
import { insertOrUpdateEntity } from '../src/services/entityCatalog.service.js';
import {
  entityCreatedTotal,
  discoveryRunDurationSeconds,
} from '../src/metrics/metrics.js';

export const runDiscovery = async (entities) => {
  const end = discoveryRunDurationSeconds.startTimer();
  const results = [];

  for (const entity of entities) {
    const saved = await entityService.insertOrUpdateEntity(entity);
    entityCreatedTotal.inc();
    results.push(saved);
  }

  end();
  return results;
};
