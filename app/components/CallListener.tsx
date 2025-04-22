
"use client";

import { useEffect } from "react";
import { useCall } from "../context/CallContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function CallListener({ userId }: { userId: string }) {
  const { setIncomingCall } = useCall();

  useEffect(() => {
    // Listen for calls where you are the callee
    const callsQuery = query(
      collection(db, "Calls"),
      where("calleeId", "==", userId),
      where("status", "==", "calling")
    );

    const unsubscribe = onSnapshot(callsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const callData = change.doc.data();
          setIncomingCall({
            callId: change.doc.id,
            from: callData.callerId,
            // Include any other needed info
          });
        }
      });
    });

    return () => unsubscribe();
  }, [userId, setIncomingCall]);

  return null; // This component doesn't render anything
}