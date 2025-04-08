"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! Ask me a question or upload an article below to begin."
    }
  ]);
  const [input, setInput] = useState("");
  const [articleInput, setArticleInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Chat fetch error:", errorText);
        throw new Error("Chat fetch failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response }
      ]);
    } catch (err) {
      console.error("⚠️ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get a response from backend." }
      ]);
    }
  };

  const handleUploadClick = async () => {
    if (!articleInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Cannot upload empty article." }
      ]);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: articleInput })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Article uploaded with ${data.num_chunks} chunks.`
        },
        {
          sender: "bot",
          text: `Article Content:\n\n${articleInput.trim()}`
        }
      ]);
      setArticleInput("");
    } catch (err) {
      console.error("⚠️ Upload error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to upload article." }
      ]);
    }
  };

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
            className="flex-1 border rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition"
          >
            Send
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
          />
          <button
            onClick={handleUploadClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition"
          >
            Upload Article
          </button>
        </div>
      </div>
    </div>
  );
}
