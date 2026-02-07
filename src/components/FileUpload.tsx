// app/components/FileUpload.tsx
'use client';
import { useState } from 'react';
import { createHash } from 'crypto';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFile(file);
    
    // Generate SHA-256 hash
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    setHash(hashHex);
  };
  
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <input type="file" onChange={handleFileChange} />
      {hash && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>File Hash: <code className="text-sm">{hash}</code></p>
        </div>
      )}
    </div>
  );
}