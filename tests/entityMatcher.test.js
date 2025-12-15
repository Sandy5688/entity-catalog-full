import { matchEntity } from '../src/services/ai/entityMatcher.js';

describe('entityMatcher', () => {
  test('returns correct fuzzy matches', () => {
    const entities = [{ display_name: 'Test Corp' }];
    const result = matchEntity('Test Corporation', entities);

    expect(result.length).toBe(1);
    expect(result[0].display_name).toBe('Test Corp');
  });
});
