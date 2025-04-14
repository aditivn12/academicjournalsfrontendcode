"use client";
import { useState, useRef, useEffect } from "react";
import ChatBoxUI from "./chatboxUI"; 


type Message = {
  sender: "bot" | "user";
  text: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi there! Upload an article below to begin (paste in the text)."
    }
  ]);
  const [input, setInput] = useState("");
  const [articleInput, setArticleInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Chat fetch error:", errorText);
        throw new Error("Chat fetch failed");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get a response from backend." }
      ]);
    } finally {
      setIsSending(false);
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

    const articleToSend = articleInput.trim();
    setArticleInput("");
    setIsUploading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: articleToSend })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        throw new Error("Upload failed");
      }

      const data = await res.json();

      const uploadMessages: Message[] = [
        {
          sender: "bot",
          text: `Article uploaded with ${data.num_chunks} chunks.`
        },
        {
          sender: "bot",
          text: `TL;DR Summary:\n\n${data.summary || "No summary provided."}`
        },
        {
          sender: "bot",
          text: `Article Content:\n\n${articleToSend}`
        }
      ];

      setMessages((prev) => [...prev, ...uploadMessages]);
    } catch (err) {
      console.error("Upload error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to upload article." }
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ChatBoxUI
      messages={messages}
      input={input}
      articleInput={articleInput}
      isUploading={isUploading}
      isSending={isSending}
      messagesEndRef={messagesEndRef}
      setInput={setInput}
      setArticleInput={setArticleInput}
      handleSend={handleSend}
      handleUploadClick={handleUploadClick}
    />
  );
}
