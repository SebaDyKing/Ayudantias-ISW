import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user,isLoading } = useAuth();

  if(isLoading){
    return <p className ="text-center mt-20 text-lg">Verificando Session</p>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
