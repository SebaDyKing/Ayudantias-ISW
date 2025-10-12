import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState('')
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(password != confirmPassword){
      setError("Las contraseñas no son iguales, intente nuevamente")
      setLoading(false)
      return;
    }
    try{
        const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password});
        const {token,user } = response.data.data

        alert("Cuenta Creada con exito, Porfavor inicia session")

        navigate('/auth')
    }catch(error){
        console.error('Error during registration:', error);
        setLoading(false);
  }finally{
    setLoading(false)
  }

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 font-sans">
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md transform transition-all hover:scale-105">
        <form className="space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-8 font-sans">
                Crear Cuenta
            </h1>
            
            {error && (
                <p className="text-red-600 text-center font-sans">{error}</p>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 font-sans">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 font-sans"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 font-sans">Contraseña</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 font-sans"
                />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 font-sans">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 font-sans"
                />
            </div>


            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 font-sans">
                {loading ? 'Registrando...' : 'Registrar'}
            </button>
            
            <p className="text-center text-sm text-gray-600 font-sans">
                ¿Ya tienes cuenta? 
                <span onClick={() => navigate('/auth')} className="text-purple-600 hover:text-purple-800 cursor-pointer ml-1 font-semibold">
                    Iniciar sesión
                </span>
            </p>
        </form>
    </div>
</div>
  )
}

export default Register