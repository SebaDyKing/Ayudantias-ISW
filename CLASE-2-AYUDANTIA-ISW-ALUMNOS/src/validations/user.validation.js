import Joi from "joi"
export const userBodyValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).message({
      "string.base": "El nombre debe ser texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.min": "El nombre debe tener al menos 3 caracteres",
  }),

  rut: Joi.string().required().pattern(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/).messages({
      "string.pattern.base": "El RUT no tiene un formato válido (ej: 12.345.678-9)",
      "any.required": "El RUT es un campo requerido"
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Debe proporcionar un email valido"
  }),

  password: Joi.string().min(4).required().messages({
    "string.min": "La contraseña debe tener al menos 4 caracteres",
    "any.required": "La contraseña es un campo requerido"
  }),


  
})
function validateUser(input){
  return userBodyValidation.validate(input,{abortEarly:false})
}
//Hacer todas las validaciones opcionales para el patch
function validatePartialUser(input){
  return userBodyValidation.fork(Object.keys(userBodyValidation.describe().keys), (schema) => schema.optional()).validate(input,{abortEarly:false})
}

export {validateUser,validatePartialUser}