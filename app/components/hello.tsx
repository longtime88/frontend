'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getHello } from '@/lib/api';

export default function Hello() {
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHello()
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((err: Error) => {
        console.error('[Hello] Backend-Verbindung fehlgeschlagen:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Backend status banner */}
      <div className="text-sm font-medium">
        {loading && (
          <span className="text-gray-300 animate-pulse">
            Verbinde mit Backend…
          </span>
        )}
        {!loading && error && (
          <span className="text-red-400" title={error}>
            ⚠ Backend nicht erreichbar
          </span>
        )}
        {!loading && backendMessage && (
          <span className="text-green-400">✓ {backendMessage}</span>
        )}
      </div>

      {/* Product images */}
      <div className="flex flex-row gap-6 justify-center items-center">
        <div className="rounded-lg px-6 py-4 text-center">
          <Image src="/images/Roggenbrot.jpg"
            alt="Roggenbrot" width={150} height={150}
            className="rounded-lg" />
        </div>

        <div className="rounded-lg px-6 py-4 text-center">
          <Image src="/images/Weisßbrot.png"
            alt="Weizenbrot" width={150} height={150}
            className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}


    
   
  




