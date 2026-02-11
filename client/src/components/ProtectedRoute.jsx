import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user: userProp, allowedRoles = [] }) => {
    const token = localStorage.getItem('auth-token');
    const userString = localStorage.getItem('user');
    const user = userProp || (userString ? JSON.parse(userString) : null);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
