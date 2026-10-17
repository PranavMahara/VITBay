import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";

const ToastContext = createContext(null);
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (kind, text) => {
      const id = nextId++;
      setToasts((t) => [...t.slice(-2), { id, kind, text }]);
      setTimeout(() => dismiss(id), kind === "error" ? 6000 : 3500);
    },
    [dismiss]
  );

  const toast = useMemo(() => ({ success: (t) => push("success", t), error: (t) => push("error", t) }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <button key={t.id} className={`toast toast-${t.kind}`} onClick={() => dismiss(t.id)}>
            {t.kind === "error" ? <ErrorOutlineRounded fontSize="small" /> : <CheckCircleRounded fontSize="small" />}
            <span>{t.text}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
