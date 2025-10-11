import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [profileData, setProfileData] = useState(null);

  const handleGetProfile = async () => {
    const token = Cookies.get('jwt-auth');
    
    if(!token){
      console.error('No se encontro token de autenticacion')
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/private`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type' : 'application/json'
        }
      });
      setProfileData(response.data)
  }catch(error){
      console.error('Error al obtener perfil:', error);
  } 
  }
  return (
    <div className="min-h-screen bg-gr adient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 font-poppins">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Página de Inicio
        </h1>
        
        <button 
          onClick={handleGetProfile} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-poppins"
          >
          Obtener Perfil
        </button>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 font-poppins">
            <p className="text-sm text-gray-700 overflow-auto font-poppins">Email : {profileData.data.userData.email}</p>
            <p className="text-sm text-gray-700 overflow-auto font-poppins">Contraseña : {profileData.data.userData.password}</p>
          </div>

        )}
      </div>
    </div>
  );
};

export default Home;
