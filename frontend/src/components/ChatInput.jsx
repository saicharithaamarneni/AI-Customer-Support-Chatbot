function ChatInput({
  darkMode,
  question,
  setQuestion,
  askQuestion,
  loading,
  stopGenerating,
  inputRef,
  listening,
  startListening,
  stopListening,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="mt-6 flex gap-4">
      <textarea
        ref={inputRef}
        rows={2}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question... (Press Enter to send)"
        className={`flex-1 rounded-xl border p-4 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-black placeholder-gray-500"
        }`}
      />

     <div className="flex gap-2">

  {/* Microphone */}

  <button
    onClick={
      listening
        ? stopListening
        : startListening
    }
    className={`px-5 rounded-xl text-white transition ${
      listening
        ? "bg-red-600 hover:bg-red-700"
        : "bg-purple-600 hover:bg-purple-700"
    }`}
  >
    {listening ? "🛑 Mic" : "🎤 Mic"}
  </button>

  {loading ? (
    <button
      onClick={stopGenerating}
      className="px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
    >
      🛑 Stop
    </button>
  ) : (
    <button
      onClick={() => {
  console.log("Send button clicked");
  askQuestion();
}}
      className="px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
    >
      Send
    </button>
  )}

</div>
    </div>
  );
}

export default ChatInput;