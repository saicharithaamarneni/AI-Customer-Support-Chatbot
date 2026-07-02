import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  UserCircleIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";

import SourceCard from "./SourceCard";
import ActionButtons from "./ActionButtons";

function MessageBubble({
  msg,
  darkMode,
  copyToClipboard,
  regenerateAnswer,
  askQuestion,
}) {
    const suggestions = [
  "Explain this in simple words",
  "Give me an example",
  "Summarize this answer",
  "What are the key points?",
];
  return (
    <div
      className={`mb-8 flex items-start gap-3 ${
        msg.sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* AI Avatar */}

      {msg.sender === "ai" && (
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
          <CpuChipIcon className="w-6 h-6 text-white" />
        </div>
      )}
      {msg.sender === "ai" && (
  <div className="mt-4 border-t pt-4">
    <p className="text-sm font-semibold mb-3 text-gray-500">
      💡 You may also ask
    </p>

    <div className="flex flex-wrap gap-2">
      {suggestions.map((item, index) => (
        <button
          key={index}
          onClick={() => askQuestion(item)}
          className={`px-3 py-2 rounded-full text-sm transition ${
            darkMode
              ? "bg-gray-700 hover:bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-indigo-100 text-gray-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
)}

      {/* Message Bubble */}

      <div
        className={`max-w-[72%] rounded-3xl px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
          msg.sender === "user"
            ? "bg-indigo-600 text-white"
            : darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border"
        }`}
      >
        {/* Header */}

        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-sm uppercase tracking-wide">
            {msg.sender === "user"
              ? "👤 You"
              : "🤖 AI"}
          </h4>

          <span className="text-[11px] opacity-70">
            {msg.time}
          </span>
        </div>

        {/* Markdown */}

        <div
          className={`prose prose-lg max-w-none ${
            msg.sender === "user" || darkMode
              ? "prose-invert"
              : ""
          }`}
        >
          {msg.text.startsWith("## 📝 Conversation Summary") ? (

  <div
    className={`rounded-xl border-l-4 p-5 ${
      darkMode
        ? "bg-purple-900/30 border-purple-400"
        : "bg-purple-50 border-purple-600"
    }`}
  >

    <h3 className="text-xl font-bold mb-4">
      📝 Conversation Summary
    </h3>

    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
    >
      {msg.text.replace(
        "## 📝 Conversation Summary",
        ""
      )}
    </ReactMarkdown>

  </div>

) : (

  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      // your existing code component
    }}
  >
    {msg.text}
  </ReactMarkdown>

)}
        </div>

        {/* Sources */}

        {msg.sender === "ai" &&
          msg.sources &&
          msg.sources.length > 0 && (
            <SourceCard
              sources={msg.sources}
              darkMode={darkMode}
            />
          )}

        {/* Action Buttons */}

        {msg.sender === "ai" && (
          <ActionButtons
            text={msg.text}
            copyToClipboard={copyToClipboard}
            regenerateAnswer={regenerateAnswer}
          />
        )}
      </div>

      {/* User Avatar */}

      {msg.sender === "user" && (
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shadow-md flex-shrink-0">
          <UserCircleIcon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;