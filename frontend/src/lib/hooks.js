import { useCallback, useEffect, useRef, useState } from "react";
import api, { errorMessage } from "./api";

export const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · VITBay` : "VITBay · Buy and sell on campus";
  }, [title]);
};

// GET a resource and keep loading / error state. Re-runs when `path` changes; pass null to skip.
export const useApi = (path) => {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const latest = useRef(path);

  const load = useCallback(async () => {
    if (!path) return;
    latest.current = path;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await api.get(path);
      if (latest.current === path) setState({ data, loading: false, error: null });
    } catch (err) {
      if (latest.current === path) setState({ data: null, loading: false, error: errorMessage(err) });
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load, setData: (fn) => setState((s) => ({ ...s, data: typeof fn === "function" ? fn(s.data) : fn })) };
};

export const useInterval = (fn, ms, enabled = true) => {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (!enabled) return undefined;
    const tick = () => {
      if (document.visibilityState === "visible") saved.current();
    };
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [ms, enabled]);
};
