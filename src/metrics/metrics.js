import client from 'prom-client';

/**
 * Clear registry between test runs
 */
if (process.env.NODE_ENV === 'test') {
  client.register.clear();
}

export const register = client.register;

client.collectDefaultMetrics();

/* ===============================
   Entity Metrics
================================ */

export const entityCreatedTotal =
  client.register.getSingleMetric('entity_created_total') ||
  new client.Counter({
    name: 'entity_created_total',
    help: 'Total entities created',
  });

export const entityUpdatedTotal =
  client.register.getSingleMetric('entity_updated_total') ||
  new client.Counter({
    name: 'entity_updated_total',
    help: 'Total entities updated',
  });

/* ===============================
   Metadata Metrics
================================ */

export const metadataPackagesImportedTotal =
  client.register.getSingleMetric('metadata_packages_imported_total') ||
  new client.Counter({
    name: 'metadata_packages_imported_total',
    help: 'Total metadata packages imported',
  });

/* ===============================
   Discovery Worker Metrics
================================ */

export const discoveryRunDurationSeconds =
  client.register.getSingleMetric('discovery_run_duration_seconds') ||
  new client.Histogram({
    name: 'discovery_run_duration_seconds',
    help: 'Duration of discovery worker runs',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  });
