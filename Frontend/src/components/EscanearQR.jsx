import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export const EscanearQR = ({ onUserScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [result, setResultado] = useState('');
  const [loading, setLoading] = useState(false);
  const qrScannerRef = useRef(null);
  const hasInitialized = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(error => console.log('Error al limpiar escáner:', error));
        qrScannerRef.current = null;
      }
    }
  }, []);

  const iniciarEscaneo = () => {
    if (qrScannerRef.current || hasInitialized.current) return;

    setScanning(true);
    setError('');
    setUser(null);
    setResultado('');
    hasInitialized.current = true;

    setTimeout(() => {
      try {
        const element = document.getElementById('qr-reader');
        if (!element) {
          setError('Error: No se encontró el elemento del escáner');
          setScanning(false);
          hasInitialized.current = false;
          return;
        }

        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true
          },
          false
        );
        qrScannerRef.current = scanner;

        const onScanSuccess = (decodedText) => {
          setResultado(decodedText);
          try {
            const data = JSON.parse(decodedText);
            if (data.nombre && data.rut && data.rol && data.email) {
              setUser(data);
              setError(''); 

              if (onUserScanned) {
                onUserScanned(data);
              }

              if (qrScannerRef.current) {
                qrScannerRef.current.clear().catch(console.error);
                qrScannerRef.current = null;
              }
              setScanning(false);
              hasInitialized.current = false;
            } else {
              setError('El código QR no contiene datos válidos');
            }
          } catch (error) {
            setError('Error al leer el código QR. No es un formato JSON válido.');
          }
        };
        
        scanner.render(onScanSuccess, () => {});

      } catch (error) {
        console.log('Error al iniciar escáner:', error);
        setError('No se pudo iniciar el escáner.');
        setScanning(false);
        hasInitialized.current = false;
      }
    }, 100);
  }

  const detenerEscaneo = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(console.error);
      qrScannerRef.current = null;
    }
    setScanning(false);
    hasInitialized.current = false;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setUser(null);
    setResultado('');
    setLoading(true);

    const html5QrCode = new Html5Qrcode('qr-file-reader');

    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      setResultado(decodedText);

      try {
        const data = JSON.parse(decodedText);
        if (data.nombre && data.rut && data.rol && data.email) {
          setUser(data);
          setError('');

          if (onUserScanned) {
            onUserScanned(data);
          }

        } else {
          setError('El QR escaneado no contiene datos válidos.');
        }
      } catch (error) {
        console.log("Error de JSON en archivo:", error);
        setError('Error al leer el QR. No es un formato JSON válido.');
      }

    } catch (error) {
      console.log("Error al escanear archivo:", error);
      setError('No se pudo escanear la imagen. ¿Es un QR válido?');
    } finally {
      await html5QrCode.clear();
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="container-qr mt-8 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-4 text-center">Escanear Código QR</h2>

      <div className="flex space-x-4 mb-4 justify-center">
        <button 
          onClick={iniciarEscaneo} 
          disabled={scanning}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Iniciar Escáner
        </button>
        <button 
          onClick={detenerEscaneo} 
          disabled={!scanning}
          className="p-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Detener
        </button>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          ref={fileInputRef}
          className="p-1 border rounded"
        />
      </div>

      <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>
      <div id="qr-file-reader" style={{ display: 'none' }}></div>

      {loading && <p className="text-center">Cargando archivo...</p>}
      
      {error && <p className="text-red-500 font-bold mt-4 text-center">{error}</p>}
      
    </div>
  );
}