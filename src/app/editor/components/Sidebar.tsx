"use client";
import { useState } from "react";
import { Upload, FileSpreadsheet, X, Loader2 } from "lucide-react";
import axios from "axios";

type SidebarProps = { isOpen: boolean; onClose: () => void };

// Constant утгуудыг функцээс гаргах (Мөр хэмнэнэ)
const VALID_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3)
      return setMessage("Зөвхөн 3 хүртэл файл сонгох боломжтой");

    const invalidFiles = selectedFiles.filter(
      (f) => !VALID_TYPES.includes(f.type)
    );
    if (invalidFiles.length > 0)
      return setMessage("Зөвхөн Excel файл сонгоно уу");

    setFiles(selectedFiles);
    setMessage("");
  };

  const handleUpload = async () => {
    if (files.length === 0) return setMessage("Файл сонгоно уу");
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await axios.post("/api/routes/upload", formData);
      setMessage(res.data.message || "Амжилттай хадгалагдлаа!");
      setFiles([]);
      if (document.getElementById("file-input"))
        (document.getElementById("file-input") as HTMLInputElement).value = "";
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      // 1. Энэ нь Axios-оос ирсэн алдаа мөн эсэхийг шалгах
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.error;
        setMessage(serverMessage || "Сервер талд алдаа гарлаа");
      } else if (err instanceof Error) {
        // 2. Ерөнхий JS алдаа бол (жишээ нь сүлжээ тасрах)
        setMessage(err.message);
      } else {
        // 3. Тодорхойгүй алдаа
        setMessage("Тодорхойгүй алдаа гарлаа");
      }
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Excel файл оруулах</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col h-[calc(100%-80px)] overflow-y-auto">
          <div className="mb-6">
            <label
              htmlFor="file-input"
              className="block text-sm font-medium mb-2"
            >
              Файл сонгох (1-3 файл)
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:text-blue-700 cursor-pointer"
            />
          </div>

          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
            >
              <div className="flex items-center space-x-3 truncate">
                <FileSpreadsheet className="text-green-600" size={20} />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <button
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {message && (
            <div
              className={`p-4 rounded-lg mt-4 text-sm ${
                message.includes("Амжилттай")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-auto pt-4">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              <span>{uploading ? "Уншиж байна..." : "Файл хадгалах"}</span>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-30" />
      )}
    </>
  );
}
