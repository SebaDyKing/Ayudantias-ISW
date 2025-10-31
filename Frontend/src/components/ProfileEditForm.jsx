import React from 'react';

export const ProfileEditForm = ({ formData, handleInputChange, handleUpdate, handleCancelEdit, loading }) => {
  const fields = ['nombre', 'rut', 'rol', 'email', 'password', 'passwordConfirm'];

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <h3 className="text-xl font-semibold mb-3">Editando Perfil</h3>

      {fields.map(field => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field === 'passwordConfirm' ? 'Confirmar Contraseña' : field === 'password' ? 'Contraseña Nueva' : field}:
          </label>
          <input
            type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            placeholder={field === 'passwordConfirm' ? 'Confirma tu contraseña' : ''}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      ))}

      <div className="flex space-x-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

