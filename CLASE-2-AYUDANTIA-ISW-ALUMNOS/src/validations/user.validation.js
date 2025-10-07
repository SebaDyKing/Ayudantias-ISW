import Joi from "joi"
export const userBodyValidation = Joi.object({
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