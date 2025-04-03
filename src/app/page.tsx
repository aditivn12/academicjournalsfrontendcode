"use client";
import { useEffect, useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const demoArticle = "This is a sample article used for testing the chatbot functionality.";

  // useEffect(() => {
  //   const uploadArticle = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8000/upsert", {
  //         method: "POST",
  //         mode: "no-cors", // 👈 this line sets it
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ article: "some text here" })
  //       });

  //       if (!res.ok) {
  //         const errorText = await res.text(); 
  //         console.error("Upload failed:", errorText);
  //         throw new Error("Failed to upload article");
  //       }

  //       const data = await res.json();
  //       console.log("✅ Article uploaded:", data);
  //     } catch (err) {
  //       console.error("⚠️ Upload error:", err);
  //       setMessages((prev) => [
  //         ...prev,
  //         { sender: "bot", text: "Failed to upload article to backend." }
  //       ]);
  //     }
  //   };

  //   uploadArticle();
  // }, []);

  const handleUpsert = async () => {
    try {
      const res = await fetch("http://localhost:8000/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          article: "This is a sample article used for testing the chatbot functionality."
        })
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        throw new Error("Failed to upload article");
      }
  
      const data = await res.json();
      console.log("✅ Article uploaded:", data);
  
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `📄 Article uploaded successfully with ${data.num_chunks} chunks.`
        }
      ]);
    } catch (err) {
      console.error("⚠️ Upload error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Failed to upload article to backend."
        }
      ]);
    }
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      console.log("arrived at try")
      console.log(userMessage)
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({question:input})
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Chat fetch error:", errorText);
        throw new Error("Chat fetch failed");
      }

      const data = await res.json();
      const botResponse = { sender: "bot", text: data.response };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error("⚠️ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Unable to get a response from the backend." }
      ]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-2xl shadow-lg bg-white">
      <div className="h-96 overflow-y-auto space-y-2 p-4 bg-gray-50 rounded-xl">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg w-fit max-w-[80%] ${
              msg.sender === "user"
                ? "ml-auto bg-blue-100 text-blue-900"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          //onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Send
        </button>
        <button
          onClick={handleUpsert}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Send in text article
        </button>
      </div>
    </div>
  );
}
