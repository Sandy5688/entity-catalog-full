import metadataService from '../src/services/metadataCatalog.service.js';
import {
  metadataPackagesImportedTotal,
} from '../src/metrics/metrics.js';

export const runMetadataIngestion = async (metadataList) => {
  const results = [];

  for (const item of metadataList) {
    const saved = await metadataService.storeMetadata(item);
    metadataPackagesImportedTotal.inc();
    results.push(saved);
  }

  return results;
};
