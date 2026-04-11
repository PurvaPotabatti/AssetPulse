import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {

  const { user, loading } = useAuth();

  /*
     wait until localStorage loads
  */
  if (loading) {

    return null;

  }


  /*
     not logged in
  */
  if (!user) {

    return <Navigate to="/login" />;

  }


  /*
     wrong role
  */
  if (allowedRole && user.role !== allowedRole) {

    return <Navigate to="/login" />;

  }


  return children;

};

export default ProtectedRoute;