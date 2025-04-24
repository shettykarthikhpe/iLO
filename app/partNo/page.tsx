// app/page.tsx
'use client';

import { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const options = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
    'Option 6',
  ];

  // dynamic tailwind classes for title size
  const titleSizeClass = isSubmitted ? 'text-xl' : 'text-3xl';

  const handleSubmit = () => {
    if (!selectedOption) {
      setError('Please select an option.');
    } else {
      setError('');
      setIsSubmitted(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // shared input + dropdown + title block
  const InputBlock = (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <Avatar src="/iLOlogo.png" sx={{ width: 60, height: 60 }} />
        <h1 className={`font-bold ${titleSizeClass} text-white`}>
          Part number search.
        </h1>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-64"
          placeholder="Enter something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-4 py-2"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {isSubmitted ? 'Update' : 'Submit'}
      </button>
    </div>
  );

  return (
    <main className="h-screen bg-[#0f3555] p-4">
      {!isSubmitted ? (
        // INITIAL CENTERED VIEW
        <div className="flex h-full items-center justify-center">
          {InputBlock}
        </div>
      ) : (
        // SPLIT VIEW
        <div className="flex h-full">
          {/* LEFT COLUMN (half width) */}
          <div className="w-1/2 flex items-center justify-center">
            {InputBlock}
          </div>

          {/* RIGHT COLUMN (half width) */}
          <div className="w-1/2 flex flex-col p-4 space-y-4">
            {/* Top Half: Results */}
            <div className="h-1/2 bg-white rounded shadow p-4 overflow-auto">
              <h2 className="font-semibold mb-2">Result</h2>
              <p><strong>Input:</strong> {inputValue || '—'}</p>
              <p><strong>Selected:</strong> {selectedOption || '—'}</p>
            </div>

            {/* Bottom Half: Drag & Drop */}
            <div
              className="h-1/2 bg-white rounded shadow p-4 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-600 cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedFile
                ? <p>📄 {uploadedFile.name}</p>
                : <p>Drag & drop a file here<br/>or click to browse</p>
              }
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
