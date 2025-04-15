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
import { ProfileType, FriendType } from "../styles"; 
import { db } from "@/lib/firebase";

export default function Chat({
  user,
  friend,
}: {
  user: ProfileType;
  friend: FriendType;
}) {
  const currentUserId = user.steamid;
  const friendId = friend.steamid;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatId =
    currentUserId && friendId
      ? currentUserId < friendId
        ? `${currentUserId}_${friendId}`
        : `${friendId}_${currentUserId}`
      : "";

  useEffect(() => {
    if (!currentUserId || !friendId) return;

    console.log( "F", friendId, "U", currentUserId);

    const fetchProfiles = async () => {
      try {
        const [youRes, friendRes] = await Promise.all([
          fetch(`/api/user?steamid=${currentUserId}`),
          fetch(`/api/user?steamid=${friendId}`),
        ]);
        const you = await youRes.json();
        const friend = await friendRes.json();
        console.log

        setUserProfiles({
          [currentUserId]: you,
          [friendId]: friend,
        });
      } catch (err) {
        console.error("Failed to fetch user profiles:", err);
      }
    };

    fetchProfiles();
  }, [currentUserId, friendId]);

  useEffect(() => {
    if (!chatId) return;

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
    if (!newMessage.trim() || !currentUserId || !friendId || !chatId) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      from: currentUserId,
      to: friendId,
      timestamp: serverTimestamp(),
    });

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

  const getDisplayName = (userId: string) => {
    if (userId === currentUserId) {
      return userProfiles[userId]?.personaname;
    } else {
      return userProfiles[friendId]?.personaname;
    }
  
}
  const getAvatar = (userId: string) =>
    {
      if (userId === currentUserId){ return userProfiles[userId]?.avatarfull}
      else { return userProfiles[friendId]?.avatarfull}
     
   }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, i) => {
          const showInfo = i === 0 || messages[i - 1].from !== msg.from;
 
         

          return (
            <div key={i} className="flex items-start gap-3">
              {showInfo ? (
                <img
                  src={getAvatar(msg.from)}
                  alt={getDisplayName(msg.from)}
                  className="w-8 h-8 rounded-full mt-1"
                />
              ) : (
                <div className="w-8 h-8 mt-1" />
              )}

              <div>
                {showInfo && (
                  <p className="text-sm font-semibold text-white mb-1">
                    {getDisplayName(msg.from)}
                  </p>
                )}
                <p className="text-sm text-gray-200">{msg.text}</p>
              </div>
            </div>
          );
        })}
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