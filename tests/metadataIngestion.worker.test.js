import { jest } from '@jest/globals';
import metadataService from '../src/services/metadataCatalog.service.js';
import { runMetadataIngestion } from '../workers/metadataIngestion.worker.js';

jest.mock('../src/services/metadataCatalog.service.js');

describe('metadataIngestion.worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('stores raw JSON unmodified', async () => {
    const sample = {
      entity_id: '123',
      raw_data: { key: 'value' },
    };

    metadataService.storeMetadata = jest.fn().mockResolvedValue(sample);

    const result = await runMetadataIngestion([sample]);

    expect(metadataService.storeMetadata).toHaveBeenCalledWith(sample);
    expect(result[0].raw_data).toEqual({ key: 'value' });
  });
});
