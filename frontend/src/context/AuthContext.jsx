import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ✅ user from DB (with role)
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("auth/me/");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe(); // ✅ auto load user when refresh page
  }, []);

 const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
