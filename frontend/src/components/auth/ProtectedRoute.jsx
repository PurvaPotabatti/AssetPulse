import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/*
   protects routes based on login + role
*/

const ProtectedRoute = ({ children, allowedRole }) => {

  const { user } = useAuth();

  /*
     not logged in
  */
  if(!user) {

    return <Navigate to="/login" />;

  }

  /*
     wrong role
  */
  if(allowedRole && user.role !== allowedRole) {

    return <Navigate to="/login" />;

  }

  return children;

};

export default ProtectedRoute;