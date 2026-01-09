import React, { useState, useEffect } from "react";

import api from "../api";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Documents = () => {
  const [files, setFiles] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadQueue(selectedFiles);
  };

  const handleUpload = async () => {
    if (uploadQueue.length === 0) return;

    setUploading(true);
    try {
      for (const file of uploadQueue) {
        const formData = new FormData();
        formData.append("file", file);
        await api.post("/documents", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success("Files uploaded successfully!");
      setUploadQueue([]);
      fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/documents/${id}`);
      toast.success("File deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext))
      return <FaFilePdf className="text-red-500 text-2xl" />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <FaFileExcel className="text-green-600 text-2xl" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <FaFileImage className="text-purple-500 text-2xl" />;
    return <FaFileAlt className="text-gray-400 text-2xl" />;
  };

  const filteredDocs = files.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Document Manager
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Securely store, organize, and access your files.
          </p>
        </div>
        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative bg-brand-surface rounded-xl flex items-center shadow-sm">
            <FaSearch className="absolute left-4 text-indigo-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-surface/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FaCloudUploadAlt />
              </div>
              Upload New Files
            </h3>

            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-all duration-300 relative group cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-4 pointer-events-none group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-indigo-500 group-hover:text-indigo-600 group-hover:shadow-lg transition-all">
                  <FaCloudUploadAlt className="text-3xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Click or Drag files here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PDF, Excel, Images
                  </p>
                </div>
              </div>
            </div>

            {uploadQueue.length > 0 && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Ready to Upload ({uploadQueue.length})
                  </p>
                  <button
                    onClick={() => setUploadQueue([])}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {uploadQueue.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-brand-surface rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="text-indigo-500">
                          {getFileIcon(file.name)}
                        </div>
                        <span className="truncate text-sm text-gray-700 font-medium">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt /> Upload All Files
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-brand-surface/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden h-full flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-surface/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FaFileAlt className="text-indigo-500" /> Recent Documents
              </h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                {filteredDocs.length} Files
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-4 bg-brand-surface rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-5 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        {getFileIcon(doc.fileName)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate pr-4 group-hover:text-indigo-600 transition-colors">
                          {doc.fileName}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {(doc.size / 1024).toFixed(1)} KB
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(doc.uploadedAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <a
                        href={`${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:5000"
                        }/uploads/${doc.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Download/View"
                      >
                        <FaDownload />
                      </a>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredDocs.length === 0 && (
                  <div className="text-center py-20 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <FaFileAlt className="text-indigo-200 text-4xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      No documents found
                    </h4>
                    <p className="text-gray-500 max-w-xs mx-auto">
                      Upload your first document to get started with secure file
                      management.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
