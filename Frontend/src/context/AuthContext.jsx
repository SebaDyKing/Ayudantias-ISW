import { createContext, useContext, useState, useEffect, useMemo} from 'react';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  //Para Mantener session Iniciada al refrescar
  const [user, setUser] = useState(()=>{
    const storedUser = sessionStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  //Guarda al usuario en memoria, solo se activa una vez (Cuando el user cambia en las dependencias)
  const isLoggedIn = useMemo(() => !!user, [user]);

  //Elimina el usuario y token de la session
  const logout = () => {
    cookies.remove('jwt-auth');
    sessionStorage.removeItem('usuario');
    setUser(null);
  };
  //Guarda el token en cookies y el usuario en session
  const login = (token, user) => {
    cookies.set('jwt-auth', token, { expires: 7 }); 
    sessionStorage.setItem('usuario', JSON.stringify(user));
    setUser(user);
  }
  useEffect(() => {
    const token = cookies.get('jwt-auth');
    const storedUser = sessionStorage.getItem('usuario');
  
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            logout();
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser , isLoggedIn, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
