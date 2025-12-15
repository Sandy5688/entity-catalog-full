// src/metrics/metrics.js

import client from 'prom-client';

client.collectDefaultMetrics();

export const entityCreatedTotal = new client.Counter({
  name: 'entity_created_total',
  help: 'Total entities created',
});

export const entityUpdatedTotal = new client.Counter({
  name: 'entity_updated_total',
  help: 'Total entities updated',
});

export const metadataPackagesImportedTotal = new client.Counter({
  name: 'metadata_packages_imported_total',
  help: 'Metadata packages imported',
});

export const discoveryRunDurationSeconds = new client.Histogram({
  name: 'discovery_run_duration_seconds',
  help: 'Entity discovery duration',
});

export const scrapeErrorTotal = new client.Counter({
  name: 'scrape_error_total',
  help: 'Scraper errors',
});

export const cacheHitRatio = new client.Gauge({
  name: 'cache_hit_ratio',
  help: 'Cache hit ratio',
});

export const register = client.register;
