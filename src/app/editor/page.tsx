'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import Sidebar from './components/Sidebar';


export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
     
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        title="Excel файл оруулах"
      >
        <Upload size={24} />
      </button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

     
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Editor
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
           
            <p className="text-gray-600">Editor </p>
          </div>
        </div>
      </div>
    </div>
  );
}