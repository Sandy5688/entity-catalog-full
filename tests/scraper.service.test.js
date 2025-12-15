import axios from 'axios';
import { fetchUrl } from '../src/services/scraper.service.js';
import { jest } from '@jest/globals';

// ESM-safe manual mock
jest.mock('axios');

axios.get = jest.fn(); // ← THIS IS THE CRUCIAL LINE

describe('Scraper Service', () => {
  const allowedUrl = 'https://allowed.com/page';
  const blockedUrl = 'https://blocked.com/page';
  const userAgent = 'EntityCatalogBot/1.0';

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('robots.txt disallow blocks request', async () => {
    axios.get.mockImplementation((url) => {
      if (url.endsWith('/robots.txt')) {
        return Promise.resolve({ data: 'User-agent: *\nDisallow: /' });
      }
      return Promise.resolve({ data: '<html>page</html>' });
    });

    await expect(fetchUrl(blockedUrl, userAgent)).rejects.toThrow(
      /Blocked by robots.txt/
    );
  });

  test('robots.txt allow permits request', async () => {
    axios.get.mockImplementation((url) => {
      if (url.endsWith('/robots.txt')) {
        return Promise.resolve({ data: 'User-agent: *\nAllow: /' });
      }
      return Promise.resolve({ data: '<html>page</html>' });
    });

    const html = await fetchUrl(allowedUrl, userAgent);
    expect(html).toBe('<html>page</html>');
  });

  test('429 triggers retry with exponential backoff', async () => {
    const url = 'https://retry.com/page';
    let callCount = 0;

    axios.get.mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        const err = new Error('Too Many Requests');
        err.response = { status: 429 };
        throw err;
      }
      return Promise.resolve({ data: '<html>success</html>' });
    });

    const html = await fetchUrl(url, userAgent);
    expect(html).toBe('<html>success</html>');
    expect(callCount).toBe(3);
  });
});
