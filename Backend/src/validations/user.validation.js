import Joi from "joi"
export const userBodyValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
      "string.empty": "El nombre es obligatorio",
      "string.min": "El nombre debe tener al menos 3 caracteres",
    }),
    rut: Joi.string()
      .pattern(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]{1}$/)
      .required()
      .messages({
        "string.empty": "El RUT es obligatorio",
        "string.pattern.base": "El RUT debe tener el formato 12.345.678-9",
      }),
    rol: Joi.string().valid("owner", "guardia", "central").required().insensitive().messages({
      "any.only": "El rol debe ser uno de: owner, guardia o central",
      "string.empty": "El rol es obligatorio",
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