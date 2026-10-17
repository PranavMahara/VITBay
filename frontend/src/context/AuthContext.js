import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useInterval } from "../lib/hooks";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const refreshUnread = useCallback(() => {
    if (!user) return;
    api
      .get("/conversations/unread")
      .then(({ data }) => setUnread(data.unread))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (user) refreshUnread();
    else setUnread(0);
  }, [user, refreshUnread]);

  useInterval(refreshUnread, 20000, Boolean(user));

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (fields) => {
    const { data } = await api.post("/auth/register", fields);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(null);
  };

  const toggleSaved = async (listingId) => {
    const { data } = await api.post(`/listings/${listingId}/save`);
    setUser((u) => u && { ...u, saved: data.saved ? [...u.saved, listingId] : u.saved.filter((id) => id !== listingId) });
    return data.saved;
  };

  const value = useMemo(
    () => ({ user, ready, setUser, login, register, logout, unread, refreshUnread, toggleSaved, isSaved: (id) => Boolean(user?.saved?.includes(id)) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, ready, unread, refreshUnread]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
