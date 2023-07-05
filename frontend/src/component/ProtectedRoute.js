import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    if (!loading) {
        if (!isAuthenticated) {
            return <Navigate to={"/login"}/>;
        }
    }
    return children;
}

export default ProtectedRoute;