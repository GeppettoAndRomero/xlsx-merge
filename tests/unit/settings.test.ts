import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('merge settings', () => {
  it('has no user-configurable settings', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
  });

  it('accepts the empty settings object used by the scaffold storage helper', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({ valid: true, errors: {} });
  });
});
