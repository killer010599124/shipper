import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = (props) => {

    const token = localStorage.getItem("token")
    return token ? props.children : <Navigate to="/" />
}

export default ProtectedRoute