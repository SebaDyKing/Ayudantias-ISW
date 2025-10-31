import { useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { updateProfile, deleteProfile} from '../services/profile.service';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode'

import { ProfileView } from '../components/ProfileView';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { QRButton } from '../components/QRButton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [editUser, setEditUser] = useState('')
  const [formData,setFormData] = useState({
    nombre:'',
    rut:'',
    rol:'',
    email:'', 
    password:'',
    passwordConfirm:''})
  const [error,setError] = useState('') 
  const [success,setSuccess] = useState()
  const [loading,setLoading] = useState()
  const [qrCodeUrl,setQrCodeUrl] = useState('')

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
      nombre: user.nombre || '',
      rut: user.rut || '',
      rol: user.rol || '',
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
      nombre: '',
      rut: '',
      rol: '',
      email: '',
      password:'',
      passwordConfirm:''
    })
    setError('')
  }
 
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
      nombre: formData.nombre,
      rut: formData.rut,
      rol: formData.rol,
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

const handleGetQR = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  if(!profileData?.data?.userData?.email){
    setError('No se pudo obtener el email del perfil')
    setLoading(false)
    return
  }

  try{
    const user = {
      email: formData.email.trim(),
      nombre: formData.nombre.trim(),
      rut: formData.rut.trim(),
      rol: formData.rol.trim()
    }
    
    const qrData = JSON.stringify(user)

    const qrUrl = await QRCode.toDataURL(qrData,{
      width: 400,
      margin: 2,
      color: {
      dark: '#000000',
      light: '#FFFFFF'
    }})

    setQrCodeUrl(qrUrl)
    setError('')

  }catch(error){
    setError("Error")
  }finally{
    setLoading(false)
  }
}
return (
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Sistema de Perfiles - Usuario
        </h1>

        <h2 className="text-lg text-center text-gray-600 mb-4">
          Haz clic para cargar tu perfil:
        </h2>
        <button
          onClick={handleGetProfile}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01] mb-6"
        >
          Mostrar Perfil
        </button>

        {success && <div className="mt-4 p-3 rounded-lg bg-green-100 border border-green-400 text-green-700 font-semibold text-center">{success}</div>}
        {error && <div className="mt-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 font-semibold text-center">{error}</div>}

        {profileData && (
          <div className="mt-6">
            {editUser ? (
              <ProfileEditForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleUpdate={handleUpdate}
                handleCancelEdit={handleCancelEdit}
                loading={loading}
              />
            ) : (
              <ProfileView
                userData={profileData.data.userData}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleGetQR={handleGetQR}
                qrCodeUrl={qrCodeUrl}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
