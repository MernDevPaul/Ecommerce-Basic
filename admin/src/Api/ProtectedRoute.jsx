import React from 'react'
import { Navigate } from "react-router-dom";
const token = localStorage.getItem("admin_token");
const isAdmin = localStorage.getItem("is_admin");
const ProtectedRoute = ({ children }) => {
  if (isAdmin === true && token !== "") {
    return <Navigate to="/" />;
  }
  if (isAdmin === false || (!isAdmin && token === "") || !token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;