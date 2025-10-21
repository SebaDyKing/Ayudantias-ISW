import { loginUser } from "../services/auth.service.js";
import { createUser } from "../services/user.service.js";
import { validateUser } from "../validations/user.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

// Asegúrate de que loginUser esté definido correctamente en otro lugar
// import { loginUser } from './authService'; 
// import { handleErrorClient, handleSuccess } from './responseHandlers'; 

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // **Mejora:** Verificación de tipos de datos, si aplica, aunque la destructuración es suficiente
    if (!email || !password) {
      // ⚠️ ¡Error específico! Siempre es 400 (Bad Request) para datos faltantes.
      return handleErrorClient(res, 400, "El email y la contraseña son requeridos.");
    }

    // **Mejora:** Uso de 'const' para la inmutabilidad de la variable de datos
    const data = await loginUser(email, password);

    // Si loginUser es exitoso, envía una respuesta 200 (OK)
    return handleSuccess(res, 200, "Inicio de sesión exitoso.", data);

  } catch (error) {
    // ⚠️ **Punto clave de la depuración:** Este catch maneja 
    // - Errores de la BD, 
    // - Errores internos de `loginUser` (como credenciales inválidas si está diseñado así).
    
    // Lo más probable es que un error en `loginUser` sea por credenciales inválidas.
    // Usar 401 (Unauthorized) es apropiado para un fallo de login.
    // Sin embargo, es buena práctica hacer logging del error real para debug.
    
    console.error("Error en la función de login:", error.message, error.stack); 
    
    // Si la función loginUser lanza un error *con intención* (p. ej., 'Credenciales inválidas'), 
    // el 401 es correcto. Si lanza un error *inesperado* (p. ej., error de servidor), 
    // es mejor devolver un 500 para el cliente. 
    
    // Mantenemos 401 ya que es la intención para el fallo de login.
    return handleErrorClient(res, 401, error.message || "Credenciales inválidas.");
  }
}

export async function register(req, res) {
  try {
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
      handleErrorClient(res, 409, "El email ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

