import React from 'react';

export const QRButton = ({ handleGetQR }) => (
  <button
    onClick={handleGetQR}
    className="w-full bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01] mt-4"
  >
    Obtener QR
  </button>
);

