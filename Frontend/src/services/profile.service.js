import axios from './root.service.js';
import Cookies from 'js-cookie';


export async function getProfile() {
    try {
        const response = await axios.get('/profile/private');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener perfil' };
    }
}

export async function updateProfile(userData){
    const token = Cookies.get('jwt-auth');
    try {
        const response = await axios.patch(`/profile/private`,userData,{
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
        })
        return {
            success: true,
            data: response.data,
            message : response.data.message,
        }

    }catch(error){
        return{
            success : false,
            message : error.response?.data?.message || 'Error al actualizar el perfil'
        }
    }
}


export async function deleteProfile(){
    try{
       const response = await axios.delete('/profile/private')
       return {
        success:true,
        mesage: response.data.message

       }
    }catch(error){
        return{
            success:false,
            message: error.response?.data?.message || "Error al eliminar el perfil"
        }
    }
}