import { useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { updateProfile, deleteProfile} from '../services/profile.service';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [editUser, setEditUser] = useState('')
  const [formData,setFormData] = useState({email:'', password:'',passwordConfirm:''})
  const [error,setError] = useState('') 
  const [success,setSuccess] = useState()
  const [loading,setLoading] = useState()
  const navigate = useNavigate();

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

  const handleEdit = (user) => {
    setEditUser(user)
    setFormData({
      email: user.email,
      password:'',
      passwordConfirm:''
    })
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () =>{
    setEditUser(null)
    setFormData({
      email: '',
      password:'',
      passwordConfirm:''
    })
    setError('')
  }
 
// Cada vez que el usuario presione una tecla se ejecuta esta funcion(Permitir cambios)
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    
      const {password,passwordConfirm} = formData
      
      if(password !== passwordConfirm){
        setError('Las contraseñas no coinciden')
        setLoading (false)
        return
      }

      const dataUpdate = {
        email: formData.email,
      }

      if(password){
        dataUpdate.password = passwordConfirm
      }
    try{
      const result = await updateProfile(dataUpdate)

      if(result.success){
        setSuccess('Usuario actualizado exitosamente')
        const updateUserData = {
          ...profileData.data.userData,
          email: formData.email,
        }

        setProfileData({
          ...profileData,
          data:{
            ...profileData.data,
            userData:updateUserData
          }
        })
        handleCancelEdit()
      }else{
        setError(result.message)
      }

    }catch(error){
      setError('Error inesperado al actualizar el usuario')
      console.error('Update Error: ', error)
    }finally{
      setLoading(false)
    }
  }
const handleDelete = async (user) => {
  if(!window.confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')){
    return
  }
  setLoading(true)
  setError('')
  setSuccess('')

  try{
    const result = await deleteProfile()

    if(result.success){
      setSuccess('Perfil eliminado exitosamente')
      setProfileData(null)
    }else{
      setError(result.message)
    }
  }catch(error){
    setError('Error inesperado al eliminar el perfil')
    console.error('Delete Error: ', error)
  }finally{
    setLoading(false)
    navigate('/auth')
  }
}

return (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 font-poppins">
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Sistema de Perfiles
      </h1>
      
      <button 
        onClick={handleGetProfile} 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-poppins"
      >
        Mostrar Todos los Perfiles
      </button>

      {profileData && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
          
          {editUser ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña Nueva:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value ={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Confirma tu contraseña"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 mt-2"
                  >
                </input>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {loading ? 'Actualizando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-sm text-gray-700 mb-2">Email: {profileData.data.userData.email}</p>
              <p className="text-sm text-gray-700 mb-4">Contraseña: {profileData.data.userData.password}</p>
              <button
                onClick={() => handleEdit(profileData.data.userData)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Editar Perfil
              </button>
              <button
              onClick={()=> {
                handleDelete()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 gap:2 ml-4"
              >
                Eliminar Perfil
              </button>
              
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}
export default Home;
