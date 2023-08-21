import React from "react";
import { Navigate } from "react-router-dom";
const token = localStorage.getItem("web_token");
const isBuyer = localStorage.getItem("is_buyer");
const ProtectedRoute = ({ children }) => {
  if (isBuyer === true && token !== "") {
    return <Navigate to="/" />;
  }
  if (isBuyer === false || (!isBuyer && token === "") || !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
