import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading application...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-8 text-center">Loading admin portal...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return children;
};
