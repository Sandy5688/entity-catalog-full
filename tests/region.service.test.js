import { jest } from '@jest/globals';
import { resolveEntities, redis } from '../src/services/region.service.js';

describe('Region Service - Caching and Fallback', () => {
  beforeEach(() => {
    jest.spyOn(redis, 'get').mockReset();
    jest.spyOn(redis, 'setex').mockReset();
  });

  test('Exact region hits cache', async () => {
    redis.get.mockResolvedValueOnce(JSON.stringify(['entity-ca']));

    const fetchFn = jest.fn();

    const result = await resolveEntities({
      country: 'US',
      subregion: 'CA',
      fetchFn,
    });

    expect(result).toEqual(['entity-ca']);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  test('Fallback to country cache', async () => {
    redis.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(['entity-us']));

    const fetchFn = jest.fn();

    const result = await resolveEntities({
      country: 'US',
      subregion: 'TX',
      fetchFn,
    });

    expect(result).toEqual(['entity-us']);
  });

  test('Global fallback works', async () => {
    redis.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(['entity-global']));

    const fetchFn = jest.fn();

    const result = await resolveEntities({
      country: 'FR',
      subregion: 'IDF',
      fetchFn,
    });

    expect(result).toEqual(['entity-global']);
  });

  test('Fetch when nothing cached', async () => {
    redis.get.mockResolvedValue(null);

    const fetchFn = jest.fn().mockResolvedValue(['entity-fetched']);

    const result = await resolveEntities({
      country: 'NG',
      subregion: 'LA',
      fetchFn,
    });

    expect(result).toEqual(['entity-fetched']);
    expect(fetchFn).toHaveBeenCalled();
    expect(redis.setex).toHaveBeenCalled();
  });
});
