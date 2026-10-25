describe('database configuration', () => {
  const ORIGINAL = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL };
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL;
  });

  it('reports not configured when the env vars are missing', () => {
    const { isDatabaseConfigured } = require('../src/utils/database');
    expect(isDatabaseConfigured()).toBe(false);
  });

  it('reports configured when both vars are present', () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-key';
    const { isDatabaseConfigured } = require('../src/utils/database');
    expect(isDatabaseConfigured()).toBe(true);
  });

  it('explains what is missing instead of throwing a bare SDK error', () => {
    const { getSupabase } = require('../src/utils/database');
    // The old code crashed at import; this must be a clear, actionable error.
    expect(() => getSupabase()).toThrow(/SUPABASE_URL/);
  });

  it('initialiseDatabase resolves without a database rather than rejecting', async () => {
    const { initializeDatabase } = require('../src/utils/database');
    await expect(initializeDatabase()).resolves.toBeUndefined();
  });
});
