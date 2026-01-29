'use client';
import { useState } from 'react';
import { Upload, FileSpreadsheet, X, Loader2 } from 'lucide-react';
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 3) {
        setMessage('Зөвхөн 3 хүртэл файл сонгох боломжтой');
        return;
      }
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      const invalidFiles = selectedFiles.filter(
        file => !validTypes.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        setMessage('Зөвхөн Excel файл (.xls, .xlsx, .csv) сонгоно уу');
        return;
      }
      setFiles(selectedFiles);
      setMessage('');
    }
  };
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Файл сонгоно уу');
      return;
    }
    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Амжилттай хадгалагдлаа!');
        setFiles([]);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Алдаа гарлаа');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Файл upload хийхэд алдаа гарлаа');
    } finally {
      setUploading(false);
    }
  };
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Excel файл оруулах</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 flex flex-col h-[calc(100%-80px)]">
          <div className="flex-1 overflow-y-auto">
            {/* File Input Area */}
            <div className="mb-6">
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Файл сонгох (1-3 файл)
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".xls,.xlsx,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="mt-2 text-xs text-gray-500">
                Excel файл (.xls, .xlsx, .csv) сонгоно уу
              </p>
            </div>
            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Сонгосон файлууд ({files.length}/3)
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileSpreadsheet className="text-green-600 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {message && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  message.includes('Амжилттай') || message.includes('амжилттай')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Уншиж байна...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Файл хадгалах</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30" />}
    </>
  );
}