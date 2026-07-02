function UploadProgress({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-indigo-600 h-3 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>

      <p className="text-center text-sm mt-2 text-gray-600">
        {progress}%
      </p>
    </div>
  );
}

export default UploadProgress;