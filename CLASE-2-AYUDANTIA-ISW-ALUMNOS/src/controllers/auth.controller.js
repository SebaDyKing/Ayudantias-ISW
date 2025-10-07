import { loginUser } from "../services/auth.service.js";
import { createUser } from "../services/user.service.js";
import { validateUser } from "../validations/user.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password ) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await loginUser(email, password);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function register(req, res) {
  try {
    console.log("REQ BODY:", req.body); // 👈 agrega esto
    const {error,value} = validateUser(req.body);

    if(error){
      const errorMessages = error.details.map((detail) => detail.message);
      return handleErrorClient(res, 400, "Error de validación", errorMessages);
    }

    const newUser = await createUser(value);
    delete newUser.password; // Nunca devolver la contraseña
    handleSuccess(res, 201, "Usuario creado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505') { 
      handleErrorClient(res, 409, "El email o el rut  ya están registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

