import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialAuthState = () => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const teacher = JSON.parse(localStorage.getItem('teacher'));
    const student = JSON.parse(localStorage.getItem('student'));
    const role = JSON.parse(localStorage.getItem('role'));
    return { admin, teacher, student, role };
  };

  const [auth, setAuth] = useState(() => getInitialAuthState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (role, data) => {
    localStorage.setItem(role, JSON.stringify(data));
    localStorage.setItem('role', JSON.stringify(data.userData.role));
    setAuth((prevAuth) => ({ ...prevAuth, [role]: data, role: data.userData.role }));
  };

  const logout = (role) => {
    localStorage.removeItem(role);
    localStorage.removeItem('role');
    setAuth((prevAuth) => ({ ...prevAuth, [role]: null, role: null }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
