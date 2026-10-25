import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('health endpoint', () => {
  it('returns OK with an ISO timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    // A real timestamp, not a placeholder string.
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });
});

describe('404 handling', () => {
  it('returns JSON for an unknown route', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });

  it('returns JSON, not HTML, for an unknown nested path', async () => {
    const res = await request(app).get('/nope/deeper/still');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

describe('input handling', () => {
  it('accepts a JSON body without crashing', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .send({ platform: 'twitter', recipient: 'u1', message: 'hello' })
      .set('Content-Type', 'application/json');
    // No database configured in CI, so a handled error is the correct outcome;
    // a crash or a hang would not be.
    expect([200, 400, 401, 500, 503]).toContain(res.status);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('rejects malformed JSON with 400 rather than a crash', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Content-Type', 'application/json')
      .send('{"platform": ');
    expect(res.status).toBe(400);
  });

  it('survives a very large body without hanging', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .send({ platform: 'twitter', recipient: 'u1', message: 'x'.repeat(200000) })
      .set('Content-Type', 'application/json');
    expect(res.status).toBeLessThan(600);
  });
});

describe('security headers', () => {
  it('sets the headers helmet is there for', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});
