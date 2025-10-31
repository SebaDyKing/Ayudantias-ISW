import React from 'react';


export const ProfileView = ({ userData, handleEdit, handleDelete, handleGetQR, qrCodeUrl, onToggleScanner, isScannerActive }) => {
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
      <p className="text-base text-gray-700 mb-4"> 
        <span className="font-semibold text-gray-900">ID:</span> {userData.id}
      </p>


      <div className="flex flex-wrap justify-center gap-4 mt-6">
    
        <button
          onClick={() => handleEdit(userData)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition"
        >
          Eliminar Perfil
        </button>
        <button
          onClick={handleGetQR}
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition"
        >
          Obtener QR
        </button>
        
  
        <button
          onClick={onToggleScanner}

          className={`px-4 py-2 text-white font-semibold rounded-md shadow-md transition ${
            isScannerActive 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-green-600 hover:bg-green-700' 
          }`}
        >
          {isScannerActive ? 'Cerrar Escáner' : 'Escanear'}
        </button>
      </div>

      {qrCodeUrl && (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Mi Código QR:</h3>
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto rounded-xl border border-gray-300" style={{ maxWidth: '250px' }} />
        </div>
      )}
    </div>
  );
};