import { useState } from "react";
import API from "../api";
import UploadProgress from "./UploadProgress";

function UploadBox({ darkMode }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (files.length === 0) {
      alert("Please choose at least one file.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setUploading(true);
      setProgress(0);

      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          setProgress(percent);
        },
      });

      setMessage(res.data.message);
      setFiles([]);

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg p-8 ${
  darkMode
    ? "bg-gray-800 text-white"
    : "bg-white"
}`}>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        📄 Upload Your Documents
      </h2>

      {/* Drag & Drop */}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          setFiles(Array.from(e.dataTransfer.files));
        }}
        className={`border-2 border-dashed rounded-xl p-8 transition text-center cursor-pointer
        ${
          dragging
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300"
        }`}
      >
        <p className="text-lg font-semibold">
          Drag & Drop files here
        </p>

        <p className="text-gray-500 mt-2">
          or
        </p>

        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="mt-4"
        />
      </div>

      {/* Selected files */}

      {files.length > 0 && (

        <div className="mt-6">

          <h3 className="font-semibold mb-2">
            Selected Files
          </h3>

          <ul className="space-y-2">

            {files.map((file, index) => (

              <li
                key={index}
                className="bg-gray-100 rounded-lg p-3"
              >
                📄 {file.name}
              </li>

            ))}

          </ul>

        </div>

      )}

      {/* Progress */}

      {uploading && (
        <div className="mt-6">
          <UploadProgress progress={progress} />
        </div>
      )}

      {/* Upload Button */}

      <div className="mt-6 flex justify-center">

        <button
          onClick={uploadFile}
          disabled={uploading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          {uploading ? "Uploading..." : "Upload Documents"}
        </button>

      </div>

      {/* Success / Error */}

      {message && (

        <p className="mt-6 text-center font-medium text-green-600">
          {message}
        </p>

      )}

    </div>
  );
}

export default UploadBox;