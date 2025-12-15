import { normalizeText } from '../src/utils/textNormalizer.js';

describe('textNormalizer', () => {
  test('removes company suffixes and punctuation', () => {
    const input = 'Test Corp, LLC.';
    const result = normalizeText(input);

    expect(result).toBe('test corp');
  });
});
