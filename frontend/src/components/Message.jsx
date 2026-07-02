import ReactMarkdown from "react-markdown";
import { FaRobot, FaUserCircle } from "react-icons/fa";

function Message({ msg, copyToClipboard }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <FaRobot
          size={35}
          className="text-indigo-600 mr-3 mt-2"
        />
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 shadow ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white border"
        }`}
      >
        <ReactMarkdown>
          {msg.text}
        </ReactMarkdown>

        <div className="flex justify-between mt-4">
          <span
            className={`text-xs ${
              isUser
                ? "text-indigo-100"
                : "text-gray-500"
            }`}
          >
            {msg.time}
          </span>

          {!isUser && (
            <button
              onClick={() => copyToClipboard(msg.text)}
              className="text-sm text-blue-600"
            >
              Copy
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <FaUserCircle
          size={35}
          className="text-indigo-600 ml-3 mt-2"
        />
      )}
    </div>
  );
}

export default Message;