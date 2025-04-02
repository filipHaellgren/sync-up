import React, { createContext, useContext, useState } from "react";
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
import { FriendType, ProfileType } from "../styles";

interface ChatContextType {
  messages: any[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (userId: string, friendId: string) => Promise<void>;
  initializeChat: (user: ProfileType, friend: FriendType) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string>("");

  const initializeChat = (user: ProfileType, friend: FriendType) => {
    const userId = user.steamid; 
    const friendId = friend.steamid; 

    const generatedChatId =
      userId < friendId ? `${userId}_${friendId}` : `${friendId}_${userId}`;
    setChatId(generatedChatId);

    const q = query(
      collection(db, "chats", generatedChatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  };

  const sendMessage = async (userId: string, friendId: string) => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      from: userId, 
      to: friendId, 
      timestamp: serverTimestamp(),
    });

    await setDoc(
      doc(db, "chats", chatId),
      {
        users: [userId, friendId], 
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp(),
      },
      { merge: true }
    );

    setNewMessage("");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        initializeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};