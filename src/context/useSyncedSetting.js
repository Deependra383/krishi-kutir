import { useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

// ---------------------------------------------------------------------------
// useSyncedSetting
// Keeps one piece of site content (logo, founders, slides, ...) in the shared
// Supabase `site_settings` table so every device and every login sees the
// same thing. localStorage is only a cache for a fast first paint.
//
// - Changes show instantly on screen, then save to Supabase.
// - Small edits (typing, sliders) are batched and saved 0.5s later;
//   "Save" buttons pass { immediate: true } to save straight away.
// - If Supabase rejects a save, the screen rolls back to the last saved value.
// - Realtime pushes changes from other devices into every open browser.
// ---------------------------------------------------------------------------

const USE_CLOUD = Boolean(isSupabaseConfigured && supabase);

// Stored in the table when the admin clicks "Reset" -> everyone uses defaults
const RESET_MARKER = { __useDefaults: true };
const isResetMarker = (v) =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v) && v.__useDefaults === true;

const readCache = (cacheKey) => {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

const writeCache = (cacheKey, raw) => {
  try {
    if (raw === undefined || isResetMarker(raw)) localStorage.removeItem(cacheKey);
    else localStorage.setItem(cacheKey, JSON.stringify(raw));
  } catch (e) {
    console.warn(`Could not cache ${cacheKey}:`, e);
  }
};

const sameJson = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

export function useSyncedSetting({ key, cacheKey, defaults, normalize = (v) => v }) {
  const normalizeRef = useRef(normalize);
  normalizeRef.current = normalize;

  const toValue = (raw) => {
    if (raw === undefined || raw === null || isResetMarker(raw)) return defaults;
    try {
      return normalizeRef.current(raw);
    } catch {
      return defaults;
    }
  };

  const [value, setValueState] = useState(() =>
    toValue(typeof window !== 'undefined' ? readCache(cacheKey) : undefined)
  );
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(!USE_CLOUD);

  const valueRef = useRef(value);
  const rawRef = useRef(typeof window !== 'undefined' ? readCache(cacheKey) : undefined);
  const lastSavedRef = useRef({ value, raw: rawRef.current });
  const timerRef = useRef(null);
  const waitersRef = useRef([]);

  const applyLocal = (nextValue, raw) => {
    valueRef.current = nextValue;
    rawRef.current = raw;
    setValueState(nextValue);
    writeCache(cacheKey, raw);
  };

  const flush = async () => {
    timerRef.current = null;
    const waiters = waitersRef.current;
    waitersRef.current = [];
    if (!USE_CLOUD) {
      waiters.forEach((resolve) => resolve(true));
      return;
    }

    const savingValue = valueRef.current;
    const savingRaw = rawRef.current === undefined ? RESET_MARKER : rawRef.current;

    const { error: sbError } = await supabase
      .from('site_settings')
      .upsert({ key, value: savingRaw, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (sbError) {
      console.error(`Failed to save "${key}" to Supabase:`, sbError);
      setError(sbError.message);
      // Roll back only if nothing newer was typed in the meantime
      if (valueRef.current === savingValue) {
        applyLocal(lastSavedRef.current.value, lastSavedRef.current.raw);
      }
      waiters.forEach((resolve) => resolve(false));
      return;
    }

    lastSavedRef.current = { value: savingValue, raw: rawRef.current };
    setError(null);
    waiters.forEach((resolve) => resolve(true));
  };

  const scheduleSave = (immediate) =>
    new Promise((resolve) => {
      waitersRef.current.push(resolve);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, immediate ? 0 : 500);
    });

  // setValue(nextOrUpdater, { immediate }) -> Promise<boolean>
  const setValue = (nextOrUpdater, { immediate = false } = {}) => {
    const next = typeof nextOrUpdater === 'function'
      ? nextOrUpdater(valueRef.current)
      : nextOrUpdater;
    applyLocal(next, next);
    return scheduleSave(immediate);
  };

  // Back to defaults for everyone
  const reset = () => {
    applyLocal(defaults, undefined);
    return scheduleSave(true);
  };

  // Load from Supabase + realtime updates
  useEffect(() => {
    if (!USE_CLOUD) return undefined;
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error: sbError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', key)
          .maybeSingle();
        if (sbError) throw sbError;
        if (cancelled) return;

        if (data) {
          const raw = isResetMarker(data.value) ? undefined : data.value;
          const next = toValue(data.value);
          applyLocal(next, raw);
          lastSavedRef.current = { value: next, raw };
        } else {
          // First run after the switch: upload this browser's saved version, if any
          const cached = readCache(cacheKey);
          if (cached !== undefined) {
            const { error: seedErr } = await supabase
              .from('site_settings')
              .upsert(
                { key, value: cached, updated_at: new Date().toISOString() },
                { onConflict: 'key', ignoreDuplicates: true }
              );
            if (seedErr) throw seedErr;
          }
        }
        setError(null);
      } catch (err) {
        console.error(`Could not load "${key}" from Supabase, showing cached version:`, err);
        if (!cancelled) setError(err?.message || 'Could not reach Supabase');
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();

    let channel = null;
    try {
      channel = supabase
        .channel(`site-setting-${key}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_settings', filter: `key=eq.${key}` },
          (payload) => {
            const row = payload?.new;
            if (!row || row.key !== key) return;
            if (timerRef.current) return; // local edit still waiting to save
            const raw = isResetMarker(row.value) ? undefined : row.value;
            if (sameJson(raw, rawRef.current)) return; // our own save echoing back
            const next = toValue(row.value);
            applyLocal(next, raw);
            lastSavedRef.current = { value: next, raw };
          }
        )
        .subscribe();
    } catch (subErr) {
      console.warn(`Realtime subscription notice for "${key}":`, subErr);
    }

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        flush();
      }
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cacheKey]);

  return { value, setValue, reset, error, loaded };
}