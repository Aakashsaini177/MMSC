import { useState } from "react";
import axios from "axios";

const DocumentDropZone = () => {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    try {
      await axios.post("http://localhost:5000/api/documents", formData);
      alert("Uploaded successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
      <p className="mb-4 text-gray-600">Drag & drop files here</p>
      <input type="file" multiple onChange={handleChange} className="mx-auto block" />
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
    </div>
  );
};

export default DocumentDropZone;