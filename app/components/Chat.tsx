"use client";

import { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Chat({
  currentUserId,
  friendId,
}: {
  currentUserId: string;
  friendId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatId =
    currentUserId < friendId
      ? `${currentUserId}_${friendId}`
      : `${friendId}_${currentUserId}`;

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    // 1. Add message to subcollection
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      from: currentUserId,
      to: friendId,
      timestamp: serverTimestamp(),
    });
  
    // 2. Update or create parent chat document
    await setDoc(
      doc(db, "chats", chatId),
      {
        users: [currentUserId, friendId],
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp(),
      },
      { merge: true }
    );
  
    setNewMessage("");
  
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.from === currentUserId
                ? "bg-blue-500 text-white self-end ml-auto text-right"
                : "bg-gray-600 text-white self-start mr-auto text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="pt-4 flex gap-2">
        <input
          className="flex-1 rounded px-4 py-2 text-black"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}