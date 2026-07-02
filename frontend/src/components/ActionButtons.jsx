function ActionButtons({
  text,
  copyToClipboard,
  regenerateAnswer,
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      <button
        onClick={() => copyToClipboard(text)}
        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition"
      >
        📋 Copy
      </button>

      <button
        onClick={regenerateAnswer}
        className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm transition"
      >
        🔄 Regenerate
      </button>

      <button
        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition"
      >
        👍 Like
      </button>

      <button
        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
      >
        👎 Dislike
      </button>
    </div>
  );
}

export default ActionButtons;
