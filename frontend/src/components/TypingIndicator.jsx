function TypingIndicator({ darkMode }) {
  return (
    <div className="flex justify-start mb-6 animate-fadeIn">
      <div
        className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border"
        }`}
      >
        {/* AI Avatar */}

        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          🤖
        </div>

        {/* Typing Dots */}

        <div>
          <p className="text-sm font-semibold mb-2">
            AI is typing...
          </p>

          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce"></span>

            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.15s]"></span>

            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.3s]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;