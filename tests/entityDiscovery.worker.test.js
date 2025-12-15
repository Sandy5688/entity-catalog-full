import { jest } from '@jest/globals';
import entityService from '../src/services/entityCatalog.service.js';
import { runDiscovery } from '../workers/entityDiscovery.worker.js';

jest.mock('../src/services/entityCatalog.service.js');

describe('entityDiscovery.worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('inserts a new entity when scraper provides data', async () => {
    const sample = {
      display_name: 'Test Corp',
      slug: 'test-corp',
      primary_country: 'US',
    };

    entityService.insertOrUpdateEntity = jest.fn().mockResolvedValue(sample);

    const result = await runDiscovery([sample]);

    expect(entityService.insertOrUpdateEntity).toHaveBeenCalledWith(sample);
    expect(result[0]).toEqual(sample);
  });
});
