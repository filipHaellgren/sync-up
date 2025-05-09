import { db } from "@/lib/firebase";
import { useUserMediaDevices } from "./useUserMediaDevices";
import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";


interface RTCHookResult {
  peerConnection: RTCPeerConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (calleeId: string) => Promise<void>;
  answerCall: (callId: string) => Promise<void>;
  hangUp: () => void;
  error: string | null;
  isCalling: boolean;
  isReceivingCall: boolean;
}
export function useRTC(): RTCHookResult {
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const { audioStream } = useUserMediaDevices();

  useEffect(() => {
    setLocalStream(audioStream);
  }, [audioStream]);

  // Initialize RTCPeerConnection
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add more STUN/TURN servers as needed
      ],
    });
    setPeerConnection(pc);

    return () => {
      pc.close();
    };
  }, []);

  // Add tracks to PeerConnection
  useEffect(() => {
    if (peerConnection && localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }
  }, [peerConnection, localStream]);

  // Handle incoming tracks
  useEffect(() => {
    if (peerConnection) {
      peerConnection.ontrack = (event: RTCTrackEvent) => {
        setRemoteStream(event.streams[0]);
      };
    }
  }, [peerConnection]);

  const startCall = async (calleeId: string) => {
    if (!peerConnection) {
      setError("Peer connection not initialized.");
      return;
    }
    setIsCalling(true);
    setCallId(calleeId);

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const callDocRef = doc(db, "Calls", calleeId);
      await setDoc(callDocRef, {
        callerId: "user1",
        calleeId: calleeId,
        offer: offer,
        status: "pending",
      });

      onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer) {
          const answer = new RTCSessionDescription(data.answer);
          peerConnection
            .setRemoteDescription(answer)
            .then(() => {
              setIsCalling(false);
            })
            .catch((e: any) => setError(e.message));
        }
      });
    } catch (error: any) {
      setError(error.message);
      setIsCalling(false);
    }
  };

  const answerCall = async (incomingCallId: string) => {
    if (!peerConnection) {
      setError("Peer connection not initialized.");
      return;
    }
    setIsReceivingCall(true);
    setCallId(incomingCallId);

    try {
      const callDoc = doc(db, "Calls", incomingCallId);
      const callSnapshot = await getDoc(callDoc);
      const offerData = callSnapshot.data()?.offer;

      if (!offerData) {
        setError("No offer found for this call.");
        return;
      }

      const offer = new RTCSessionDescription(offerData);
      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      await setDoc(
        callDoc,
        {
          answer: answer,
          status: "accepted",
        },
        { merge: true }
      );

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer) {
          const answer = new RTCSessionDescription(data.answer);
          peerConnection
            .setRemoteDescription(answer)
            .then(() => {
              setIsReceivingCall(false);
            })
            .catch((e: any) => setError(e.message));
        }
      });
    } catch (error: any) {
      setError(error.message);
      setIsReceivingCall(false);
    }
  };

  const hangUp = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setIsReceivingCall(false);
    setCallId(null);
  };

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  return {
    peerConnection: peerConnection,
    localStream: localStream,
    remoteStream: remoteStream,
    startCall,
    answerCall,
    hangUp,
    error: error,
    isCalling: isCalling,
    isReceivingCall: isReceivingCall,
  };
}
