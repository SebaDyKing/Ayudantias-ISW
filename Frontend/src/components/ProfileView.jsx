import React from 'react';

export const ProfileView = ({ userData, handleEdit, handleDelete, handleGetQR, qrCodeUrl }) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        {userData.nombre} ({userData.email})
      </h3>

      <p className="text-base text-gray-700 mb-1">
        <span className="font-semibold text-gray-900">RUT:</span> {userData.rut}
      </p>
      <p className="text-base text-gray-700 mb-1">
        <span className="font-semibold text-gray-900">Rol:</span> {userData.rol}
      </p>
      <p className="text-base text-gray-700 mb-1">
        <span className="font-semibold text-gray-900">ID:</span> {userData.id}
      </p>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleEdit(userData)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Eliminar Perfil
        </button>
        <button
          onClick={handleGetQR}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Obtener QR
        </button>
      </div>

      {qrCodeUrl && (
        <div className="mt-6 text-center">
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto rounded-xl border border-gray-300" />
        </div>
      )}
    </div>
  );
};


