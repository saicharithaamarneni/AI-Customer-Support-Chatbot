import { useState, useRef, useEffect } from "react";
import API from "../api";
import { jsPDF } from "jspdf";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

function ChatBox({
  darkMode,
  messages,
  setMessages,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-center mt-10 text-red-500">
        Your browser doesn't support Speech Recognition.
      </p>
    );
  }

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      console.error(err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Customer Support Chat", 20, y);

    y += 15;

    messages.forEach((msg) => {
      const sender =
        msg.sender === "user" ? "You" : "AI";

      const text = `${sender}: ${msg.text}`;

      const lines = doc.splitTextToSize(
        text,
        170
      );

      doc.text(lines, 20, y);

      y += lines.length * 8 + 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("chat.pdf");
  };

  const exportToTXT = () => {
    const text = messages
      .map(
        (msg) =>
          `${msg.sender.toUpperCase()}:\n${msg.text}\n`
      )
      .join("\n----------------------\n");

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "chat.txt";
    a.click();

    URL.revokeObjectURL(url);
  };
    const clearChat = async () => {
    try {
      await API.post("/clear");
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const stopGenerating = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const regenerateAnswer = async () => {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.sender === "user");

    if (!lastUser) return;

    setLoading(true);

    try {
      const res = await API.post("/chat", {
        question: lastUser.text,
      });

      setMessages((prev) => {
        const updated = [...prev];

        if (
          updated.length > 0 &&
          updated[updated.length - 1].sender === "ai"
        ) {
          updated.pop();
        }

        updated.push({
          sender: "ai",
          text: res.data.answer || "No response.",
          sources: res.data.sources || [],
          pinned: false,
          time: getTime(),
        });

        return updated;
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const summarizeConversation = async () => {
    if (messages.length === 0) {
      alert("No conversation to summarize.");
      return;
    }

    const conversation = messages
      .map(
        (msg) =>
          `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`
      )
      .join("\n");

    setLoading(true);

    try {
      const res = await API.post("/chat", {
        question:
          "Summarize the following conversation in concise bullet points:\n\n" +
          conversation,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `## 📝 Conversation Summary\n\n${res.data.answer}`,
          sources: [],
          pinned: false,
          time: getTime(),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Failed to summarize the conversation.",
          sources: [],
          pinned: false,
          time: getTime(),
        },
      ]);
    }

    setLoading(false);
  };
    const askQuestion = async (customQuestion = null) => {
    if (!(customQuestion || question).trim() || loading)
      return;

    const userQuestion = customQuestion || question;

    // Stop microphone before sending
    SpeechRecognition.stopListening();
    resetTranscript();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
        pinned: false,
        time: getTime(),
      },
    ]);

    if (!customQuestion) {
      setQuestion("");
    }

    setLoading(true);

    controllerRef.current = new AbortController();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
          }),
          signal: controllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to backend.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiMessage = "";

      // Empty AI message
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "",
          sources: [],
          pinned: false,
          time: getTime(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        aiMessage += decoder.decode(value);

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: aiMessage,
          };

          return updated;
        });
      }

      controllerRef.current = null;
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Generation stopped.");
      } else {
        console.error(err);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "❌ Something went wrong.",
            sources: [],
            pinned: false,
            time: getTime(),
          },
        ]);
      }
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };
    return (
    <div
      className={`rounded-2xl shadow-xl p-6 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white"
      }`}
    >

      {/* Header */}

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={exportToPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          📄 PDF
        </button>

        <button
          onClick={exportToTXT}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          📄 TXT
        </button>

        <button
          onClick={summarizeConversation}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          📝 Summary
        </button>

        <button
          onClick={clearChat}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          🗑 Clear
        </button>

      </div>

      {/* Chat Window */}

      <div
        className={`h-[550px] overflow-y-auto rounded-xl border p-5 ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-gray-50"
        }`}
      >

        {messages.length === 0 && !loading && (

          <div className="flex h-full items-center justify-center text-gray-400">

            <p>
              Upload a document and start chatting...
            </p>

          </div>

        )}

        {messages.map((msg, index) => (

          <MessageBubble
            key={index}
            msg={msg}
            darkMode={darkMode}
            copyToClipboard={copyToClipboard}
            regenerateAnswer={regenerateAnswer}
            askQuestion={askQuestion}
            messages={messages}
            setMessages={setMessages}
          />

        ))}

        {loading && (

          <TypingIndicator
            darkMode={darkMode}
          />

        )}

        <div ref={messagesEndRef}></div>

      </div>
            {/* Input Area */}

      <ChatInput
        darkMode={darkMode}
        question={question}
        setQuestion={setQuestion}
        askQuestion={askQuestion}
        loading={loading}
        stopGenerating={stopGenerating}
        inputRef={inputRef}
        listening={listening}
        startListening={() => {
          resetTranscript();

          SpeechRecognition.startListening({
            continuous: true,
            language: "en-US",
          });
        }}
        stopListening={() => {
          SpeechRecognition.stopListening();
        }}
      />

    </div>
  );
}

export default ChatBox;