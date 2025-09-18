import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/User.entity.js"; 
import bcrypt from "bcrypt";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updateProfile(req, res) {
  try{
    const userId = req.user.sub;
    const {email,password} = req.body;

    if(!email && !password){
      return handleErrorClient(res, 400, "Al menos un campo (email o password) debe ser proporcionado para actualizar el perfil");
    }
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({id: userId});
    if(!user){
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    if(email) user.email = email;
    if(password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
      

    await userRepository.save(user);
    handleSuccess(res, 200, "Perfil actualizado exitosamente", {
        id: user.id,
        email: user.email,
      });

  }catch(error){
   handleErrorServer(res, 500, "Error al actualizar el perfil", error.message);
  }

}
export async function deleteProfile(req, res) {
  try{
    
    const userRepository = AppDataSource.getRepository(User);
    
    const resultado = await userRepository.delete({id: req.user.sub});

    if(resultado.affected === 0){
      return handleErrorClient(res, 404, "Usuario no encontrado o ya eliminado");
    }
    handleSuccess(res, 200, "Perfil eliminado exitosamente", {
      message: `El perfil del usuario con ID ${req.user.sub} ha sido eliminado.`,
    });

  }catch(error){
    handleErrorServer(res, 500, "Error al eliminar el perfil", error.message);
  }
}