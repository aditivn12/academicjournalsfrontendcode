import React, { RefObject } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatBoxUIProps {
  messages: Message[];
  input: string;
  articleInput: string;
  isUploading: boolean;
  isSending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  setInput: (val: string) => void;
  setArticleInput: (val: string) => void;
  handleSend: () => void;
  handleUploadClick: () => void;
}

export default function ChatBoxUI({
  messages,
  input,
  articleInput,
  isUploading,
  isSending,
  messagesEndRef,
  setInput,
  setArticleInput,
  handleSend,
  handleUploadClick,
}: ChatBoxUIProps) {
  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col p-6">
      <div className="flex flex-col flex-grow bg-white rounded-3xl shadow-xl p-6 space-y-6 overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 rounded-2xl border space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap max-w-[80%] px-4 py-3 rounded-2xl shadow-sm transition-all ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-100 text-blue-900"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
            className="flex-1 border rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all ${
              isSending ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isSending ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-semibold">
            Upload full article
          </label>
          <textarea
            value={articleInput}
            onChange={(e) => setArticleInput(e.target.value)}
            placeholder="Paste your article here (up to ~3000 words)..."
            rows={5}
            className="w-full border px-4 py-3 rounded-xl text-black resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={isUploading}
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl font-medium transition-all ${
              isUploading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isUploading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Article"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
