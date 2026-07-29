// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { DEFAULT_SETTINGS } from '@/utils/settings';

describe('settingsStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns the empty defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips the empty merge settings', () => {
    saveSettings(DEFAULT_SETTINGS);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('falls back to the defaults on malformed JSON', () => {
    localStorage.setItem('xlsx-merge-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
