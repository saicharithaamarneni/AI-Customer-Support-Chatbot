import { useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

function Sidebar({
  darkMode,
  chats,
  currentChat,
  setCurrentChat,
  newChat,
  renameChat,
  deleteChat,
}) {
    const [search, setSearch] = useState("");
    const filteredChats = chats.filter((chat) =>
  chat.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div
      className={`w-72 flex flex-col ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gray-900 text-white"
      }`}
    >
      {/* Header */}

      <div className="p-4 border-b border-gray-700">

        <button
          onClick={newChat}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 transition"
        >
          <PlusIcon className="h-5 w-5" />

          New Chat
        </button>

      </div>
      <div className="p-3">

  <input
    type="text"
    placeholder="🔍 Search chats..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={`w-full rounded-lg px-3 py-2 outline-none ${
      darkMode
        ? "bg-gray-800 text-white placeholder-gray-400"
        : "bg-gray-100 text-black"
    }`}
  />

</div>

      {/* Chats */}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {filteredChats.map((chat, index) => {

        const originalIndex = chats.findIndex(
  (c) => c.id === chat.id
);

  return (
          <div
            key={chat.id}
            className={`group rounded-xl p-3 cursor-pointer transition ${
              currentChat === originalIndex
                ? "bg-indigo-600"
                : "hover:bg-gray-800"
            }`}
            onClick={() => setCurrentChat(originalIndex)}
          >

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2 overflow-hidden">

                <ChatBubbleLeftRightIcon className="h-5 w-5 flex-shrink-0" />

                <span className="truncate">
                  {chat.title}
                </span>

              </div>

              <div className="hidden group-hover:flex gap-2">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameChat(originalIndex);
                  }}
                  className="hover:text-yellow-300"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(index);
                  }}
                  className="hover:text-red-400"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

              </div>

            </div>

          </div>
        );

})}
{filteredChats.length === 0 && (

  <div className="text-center text-gray-400 mt-10">
    No chats found
  </div>

)}

      </div>

      {/* Footer */}

      <div className="border-t border-gray-700 p-4">

        <p className="text-sm text-center text-gray-400">
          AI Customer Support Bot
        </p>

      </div>

    </div>
  );
}

export default Sidebar;