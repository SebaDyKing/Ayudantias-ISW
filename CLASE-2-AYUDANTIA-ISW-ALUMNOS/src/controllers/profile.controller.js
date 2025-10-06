import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/User.entity.js"; 
import { validatePartialUser } from "../validations/user.validation.js";
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
    const {error,value} = validatePartialUser(req.body);

    if(error){
      const errorMessages = error.details.map((detail) => detail.message);
      return handleErrorClient(res, 400, "Error de validación", errorMessages);
    }

    const userId = req.user.sub;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({id: userId});
    if(!user){
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    Object.assign(user, value); 

    //No hay email igual
    if(value.email){
      const existingEmail = await userRepository.findOneBy({email: value.email});
      if(existingEmail && existingEmail.id !== userId){
        return handleErrorClient(res, 409, "El email ya está en uso por otro usuario");
      }
    }

    //No hay rut igual
    if(value.rut){
      const existingRut = await userRepository.findOneBy({rut: value.rut});
      if(existingRut && existingRut.id !== userId){
        return handleErrorClient(res, 409, "El RUT ya existe en otro usuario");
      }
    }

    if(value.password) {
      const hashedPassword = await bcrypt.hash(value.password, 10);
      user.password = hashedPassword;
    }
      

    await userRepository.save(user);
    handleSuccess(res, 200, "Perfil actualizado exitosamente", {
      id: user.id,
      nombre: user.nombre,
      rut: user.rut,
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