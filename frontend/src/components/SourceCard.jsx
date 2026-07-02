function SourceCard({ sources, darkMode }) {
  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-sm mb-3">
        📄 Sources
      </h4>

      {sources.map((source, index) => (
        <div
          key={index}
          className={`rounded-xl p-4 mb-3 transition-all ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <p className="font-semibold">
            📁 {source.file || "Unknown File"}
          </p>

          <p className="text-sm opacity-70">
            Page: {source.page ?? "-"}
          </p>

          <p className="italic mt-2 text-sm leading-6">
            "
            {source.content
              ? source.content.substring(0, 180)
              : "No preview available"}
            ..."
          </p>
        </div>
      ))}
    </div>
  );
}

export default SourceCard;