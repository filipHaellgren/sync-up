// lib/webrtc.ts

import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

/**
 * Google's public STUN server to help peers discover each other.
 */
const servers: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

/**
 * Starts a call (as the caller/initiator).
 * 
 * @param localStream      MediaStream from getUserMedia()
 * @param callId           Firestore doc ID for this call session
 * @param onRemoteStream   Callback fired when the remote stream arrives
 * @returns                The created RTCPeerConnection
 */
export const startCall = async (
  localStream: MediaStream,
  callId: string,
  onRemoteStream: (stream: MediaStream) => void
): Promise<RTCPeerConnection> => {
  const pc = new RTCPeerConnection(servers);

  // Add local video/audio tracks to the connection
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  // When a remote stream arrives, pass it to the callback
  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onRemoteStream(event.streams[0]);
    }
  };

  // Firestore doc and subcollections
  const callDoc = doc(db, "Calls", callId);
  const callerCandidates = collection(callDoc, "callerCandidates");
  const calleeCandidates = collection(callDoc, "calleeCandidates");

  // ICE candidates from this (caller) side -> Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(callerCandidates, event.candidate.toJSON());
    }
  };

  // 1. Create the offer and set it as the local description
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // 2. Save the offer in Firestore
  await setDoc(callDoc, { offer: { type: offer.type, sdp: offer.sdp } });

  // 3. Listen for the answer from the callee
  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (data?.answer && !pc.currentRemoteDescription) {
      pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  });

  // 4. Listen for ICE candidates from the callee and add them to this peer
  onSnapshot(calleeCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};

/**
 * Answers a call (as the callee/receiver).
 * 
 * @param localStream      MediaStream from getUserMedia()
 * @param callId           Firestore doc ID for this call session
 * @param onRemoteStream   Callback fired when the remote stream arrives
 * @returns                The created RTCPeerConnection
 */
export const answerCall = async (
  localStream: MediaStream,
  callId: string,
  onRemoteStream: (stream: MediaStream) => void
): Promise<RTCPeerConnection> => {
  const pc = new RTCPeerConnection(servers);

  // Add local video/audio tracks
  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onRemoteStream(event.streams[0]);
    }
  };

  // Firestore doc and subcollections
  const callDoc = doc(db, "Calls", callId);
  const callerCandidates = collection(callDoc, "callerCandidates");
  const calleeCandidates = collection(callDoc, "calleeCandidates");

  // ICE candidates from this (callee) side -> Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(calleeCandidates, event.candidate.toJSON());
    }
  };

  // 1. Get the offer from Firestore and set it as the remote description
  const callData = (await getDoc(callDoc)).data();
  if (!callData?.offer) throw new Error("Offer not found!");

  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  // 2. Create the answer and set as the local description
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  // 3. Save the answer in Firestore
  await setDoc(
    callDoc,
    { answer: { type: answer.type, sdp: answer.sdp } },
    { merge: true }
  );

  // 4. Listen for ICE candidates from the caller and add them
  onSnapshot(callerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};