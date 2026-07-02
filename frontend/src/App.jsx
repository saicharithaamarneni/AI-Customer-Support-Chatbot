import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import {
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : false;
  });

  const [chats, setChats] = useState(() => {
  const saved = localStorage.getItem("chat-history");

  return saved
    ? JSON.parse(saved)
    : [
        {
          id: Date.now(),
          title: "New Chat",
          messages: [],
        },
      ];
});

const [currentChat, setCurrentChat] = useState(0);

  useEffect(() => {
  localStorage.setItem(
    "chat-history",
    JSON.stringify(chats)
  );
}, [chats]);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      JSON.stringify(darkMode)
    );
  }, [darkMode]);

  const newChat = () => {
  const chat = {
    id: Date.now(),
    title: `New Chat ${chats.length + 1}`,
    messages: [],
  };

  setChats((prev) => [...prev, chat]);
  setCurrentChat(chats.length);
};

 const updateMessages = (newMessages) => {
  setChats((prev) =>
    prev.map((chat, index) =>
      index === currentChat
        ? {
            ...chat,
            messages:
              typeof newMessages === "function"
                ? newMessages(chat.messages)
                : newMessages,
          }
        : chat
    )
  );
};
const renameChat = (index) => {
  const title = prompt(
    "Enter chat title",
    chats[index].title
  );

  if (!title) return;

  setChats((prev) =>
    prev.map((chat, i) =>
      i === index
        ? {
            ...chat,
            title,
          }
        : chat
    )
  );
};
const deleteChat = (index) => {
  if (chats.length === 1) return;

  const updated = chats.filter(
    (_, i) => i !== index
  );

  setChats(updated);

  if (currentChat >= updated.length) {
    setCurrentChat(updated.length - 1);
  }
};
  return (

    <div
      className={`flex h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
    <Sidebar
        darkMode={darkMode}
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        newChat={newChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
    />

      <div className="flex-1 overflow-y-auto">

        <div
          className={`relative shadow ${
            darkMode
              ? "bg-gray-800 text-white"
              : "bg-indigo-600 text-white"
          }`}
        >

          {/* Dark Mode Button */}

          <div className="absolute right-8 top-6">

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
            >

              {darkMode ? (

                <SunIcon className="h-6 w-6" />

              ) : (

                <MoonIcon className="h-6 w-6" />

              )}

            </button>

          </div>

          <div className="max-w-6xl mx-auto py-6">

            <h1 className="text-4xl font-bold text-center">
              🤖 AI Customer Support Chatbot
            </h1>

            <p className="text-center text-indigo-100 mt-2">
              Upload documents and chat with AI
            </p>

          </div>

        </div>

        <div className="max-w-5xl mx-auto p-8 space-y-8">

          <UploadBox darkMode={darkMode} />

         <ChatBox
  darkMode={darkMode}
  messages={chats[currentChat].messages}
  setMessages={updateMessages}
/>

        </div>

      </div>

    </div>

  );
}

export default App;