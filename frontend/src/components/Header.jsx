import { FaRobot } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-6 py-5">
        <FaRobot size={34} />

        <div>
          <h1 className="text-3xl font-bold">
            AI Customer Support Chatbot
          </h1>

          <p className="text-indigo-100 text-sm">
            Powered by Llama 3.2 + Ollama
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;