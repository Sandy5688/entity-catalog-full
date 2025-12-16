// src/services/region.service.js

export const redis = {
  get: async () => null,
  setex: async () => {},
};

const TTL = 300;

export async function resolveEntities({ country, subregion, fetchFn }) {
  const regionKey = `region:${country}:${subregion}`;
  const countryKey = `region:${country}`;
  const globalKey = `region:global`;

  // 1️⃣ Exact region
  const regionCached = await redis.get(regionKey);
  if (regionCached) {
    return JSON.parse(regionCached);
  }

  // 2️⃣ Country fallback
  const countryCached = await redis.get(countryKey);
  if (countryCached) {
    return JSON.parse(countryCached);
  }

  // 3️⃣ Global fallback
  const globalCached = await redis.get(globalKey);
  if (globalCached) {
    return JSON.parse(globalCached);
  }

  // 4️⃣ Fetch fresh
  const entities = await fetchFn();

  await redis.setex(regionKey, TTL, JSON.stringify(entities));

  return entities;
}
