"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  user: null,
  role: null,
  token: null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        role: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedUser && storedToken && storedRole) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: JSON.parse(storedUser),
            token: storedToken,
            role: storedRole,
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (state.user && state.token && state.role) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
      localStorage.setItem("role", state.role);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [state.user, state.token, state.role]);

  const login = (payload) => {
    dispatch({ type: "LOGIN_SUCCESS", payload });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
